import type { Connect, Plugin } from "vite";
import type { ServerResponse } from "node:http";
import OpenAI from "openai";
import {
  ENHANCE_FIELDS,
  MAX_INPUT_CHARS,
  isEnhanceField,
  type EnhanceContext,
  type EnhanceFieldSpec,
} from "../src/services/enhanceFields.ts";

const ROUTE = "/api/enhance";
const DEFAULT_MODEL = "gpt-5.6";

export interface EnhanceApiOptions {
  /** Resolved by vite.config from .env.local / .env / the shell. */
  apiKey?: string;
  model?: string;
  /** For OpenAI-compatible gateways (Azure OpenAI, a proxy, a local server). */
  baseURL?: string;
}

/**
 * Dev-server endpoint backing the "Enhance with AI" buttons.
 *
 * It lives here rather than in the client so OPENAI_API_KEY stays on the
 * machine running Vite and never reaches the browser bundle. For production,
 * deploy the same handler as a serverless function and point
 * VITE_ENHANCE_URL at it.
 */
export function enhanceApi(options: EnhanceApiOptions = {}): Plugin {
  const apiKey = options.apiKey || process.env.OPENAI_API_KEY || "";
  const model = options.model || process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const baseURL = options.baseURL || process.env.OPENAI_BASE_URL || undefined;
  const handler = createHandler({ apiKey, model, baseURL });

  return {
    name: "WebBlueprint-enhance-api",
    configureServer(server) {
      server.middlewares.use(ROUTE, handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(ROUTE, handler);
    },
  };
}

interface HandlerConfig {
  apiKey: string;
  model: string;
  baseURL?: string;
}

const createHandler =
  (config: HandlerConfig): Connect.NextHandleFunction =>
  (req, res, next) => {
    const hasKey = Boolean(config.apiKey);

    if (req.method === "GET") {
      send(res, 200, { enabled: hasKey, model: hasKey ? config.model : null });
      return;
    }

    if (req.method !== "POST") {
      next();
      return;
    }

    if (!hasKey) {
      send(res, 501, {
        error: "unconfigured",
        message:
          "Set OPENAI_API_KEY in .env.local (or your shell) and restart the dev server to enable AI enhancement.",
      });
      return;
    }

    void readBody(req)
      .then(async (body) => {
        const field = body?.field;
        if (!isEnhanceField(field)) {
          send(res, 400, { error: "bad_request", message: "Unknown field." });
          return;
        }

        const text = typeof body?.text === "string" ? body.text.slice(0, MAX_INPUT_CHARS) : "";
        const context = (body?.context ?? {}) as EnhanceContext;
        const spec = ENHANCE_FIELDS[field];

        if (spec.mode === "tidy" && !text.trim()) {
          send(res, 400, {
            error: "bad_request",
            message: "There's nothing to tidy up yet.",
          });
          return;
        }

        const client = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL });

        try {
          const response = await client.responses.create({
            model: config.model,
            instructions: instructions(spec),
            input: userPrompt(spec, text, context),
            // Rewriting one short answer needs speed, not deliberation.
            reasoning: { effort: "low" },
            max_output_tokens: 2000,
          });

          const output = response.output_text?.trim() ?? "";

          if (!output) {
            const reason = response.incomplete_details?.reason;
            send(res, 502, {
              error: "empty",
              message: reason
                ? `No suggestion came back (${reason}). Try again.`
                : "No suggestion came back. Try again.",
            });
            return;
          }

          send(res, 200, { text: stripWrappingQuotes(output), model: config.model });
        } catch (error) {
          if (error instanceof OpenAI.AuthenticationError) {
            send(res, 401, {
              error: "auth",
              message: "OPENAI_API_KEY was rejected. Check the key and restart the dev server.",
            });
            return;
          }
          if (error instanceof OpenAI.PermissionDeniedError) {
            send(res, 401, {
              error: "auth",
              message: `This key can't use ${config.model}. Set OPENAI_MODEL to a model you have access to.`,
            });
            return;
          }
          if (error instanceof OpenAI.NotFoundError) {
            send(res, 400, {
              error: "bad_request",
              message: `Model "${config.model}" was not found. Set OPENAI_MODEL to a valid model.`,
            });
            return;
          }
          if (error instanceof OpenAI.RateLimitError) {
            send(res, 429, {
              error: "rate_limit",
              message: "Rate limited - try again in a moment.",
            });
            return;
          }
          if (error instanceof OpenAI.APIConnectionError) {
            send(res, 503, { error: "network", message: "Couldn't reach the OpenAI API." });
            return;
          }
          if (error instanceof OpenAI.APIError) {
            send(res, 502, { error: "api", message: error.message });
            return;
          }
          send(res, 500, { error: "unknown", message: "Something went wrong." });
        }
      })
      .catch(() => send(res, 400, { error: "bad_request", message: "Malformed request." }));
  };

function instructions(spec: EnhanceFieldSpec): string {
  const shared = [
    "You improve one answer at a time inside a website-planning tool used by small business owners.",
    "",
    "Output rules, without exception:",
    "- Return ONLY the improved answer. No preamble, no sign-off, no surrounding quotation marks, no markdown, no explanation of what you changed.",
    "- Never invent facts. Do not add prices, dates, years in business, certifications, licence numbers, awards, review counts, response times, staff numbers, guarantees or locations that are not already in the answer or the business context.",
    "- Keep the owner's voice and point of view. If they wrote \"we\", keep \"we\".",
    "- Match the spelling convention already used in the answer.",
    "- Plain language. No marketing filler, no \"world-class\", no \"solutions\".",
  ];

  if (spec.mode === "tidy") {
    return [
      ...shared,
      "",
      "This answer is a real customer's testimonial. Correct spelling, punctuation, capitalisation and obvious typos ONLY.",
      "Do not rewrite phrasing, do not improve the wording, do not add or remove claims, do not change the tone, and do not make it sound more positive.",
      "If the text is already clean, return it unchanged.",
    ].join("\n");
  }

  return [
    ...shared,
    "",
    `- At most ${spec.maxSentences} sentences.`,
    "- Prefer specifics the owner already gave you over generalities.",
    "- If the current answer is empty, write a first draft from the business context that the owner can obviously edit. Only use facts from the context.",
    "- If the current answer is already clear and specific, make small improvements rather than rewriting it into something they would not recognise.",
  ].join("\n");
}

function userPrompt(spec: EnhanceFieldSpec, text: string, context: EnhanceContext): string {
  const lines: string[] = [];
  const contextLines = [
    context.businessName && `Business: ${context.businessName}`,
    context.industry && `Industry: ${context.industry}`,
    context.location && `Based in: ${context.location}`,
    context.serviceAreas?.length && `Serves: ${context.serviceAreas.join(", ")}`,
    context.services?.length && `Services: ${context.services.join(", ")}`,
    context.audience && `Customers: ${context.audience}`,
    context.primaryCTA && `Main action visitors should take: ${context.primaryCTA}`,
    context.brandPersonality?.length && `Brand personality: ${context.brandPersonality.join(", ")}`,
  ].filter(Boolean) as string[];

  if (contextLines.length) {
    lines.push("BUSINESS CONTEXT", ...contextLines, "");
  }

  lines.push(
    `QUESTION: ${spec.label}`,
    `HOW THE ANSWER IS USED: ${spec.purpose}`,
    "",
    "CURRENT ANSWER:",
    text.trim() || "(empty - write a first draft)",
  );

  return lines.join("\n");
}

/** Models occasionally wrap a rewrite in quotes despite being told not to. */
function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  const wrapped =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("“") && trimmed.endsWith("”"));
  return wrapped ? trimmed.slice(1, -1).trim() : trimmed;
}

interface RequestBody {
  field?: unknown;
  text?: unknown;
  context?: unknown;
}

function readBody(req: Connect.IncomingMessage): Promise<RequestBody> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > 64_000) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")) as RequestBody);
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function send(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}
