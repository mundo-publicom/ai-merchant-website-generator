import type { MerchantWebsiteProject } from "@/types/project";
import type { EnhanceContext, EnhanceField } from "@/services/enhanceFields";
import { industryLabel } from "@/data/industries";
import { CTA_BY_VALUE, labelsFor } from "@/data/options";
import { formatAddress } from "@/utils/formatting";

// Falls back to the Vite dev-server route, resolved against the deploy base
// path. On static hosting (GitHub Pages) nothing answers it, the probe below
// fails, and the "Enhance with AI" buttons stay hidden - set VITE_ENHANCE_URL
// to a deployed endpoint to turn them on.
const ENDPOINT = import.meta.env.VITE_ENHANCE_URL ?? `${import.meta.env.BASE_URL}api/enhance`;

export type EnhanceErrorCode =
  | "unconfigured"
  | "auth"
  | "rate_limit"
  | "network"
  | "refused"
  | "bad_request"
  | "server";

export class EnhanceError extends Error {
  readonly code: EnhanceErrorCode;

  constructor(code: EnhanceErrorCode, message: string) {
    super(message);
    this.name = "EnhanceError";
    this.code = code;
  }
}

export interface EnhanceAvailability {
  enabled: boolean;
  model: string | null;
}

let availabilityProbe: Promise<EnhanceAvailability> | null = null;

/** Cached once per page load - the answer cannot change without a server restart. */
export function getEnhanceAvailability(): Promise<EnhanceAvailability> {
  availabilityProbe ??= fetch(ENDPOINT, { method: "GET" })
    .then((response) => (response.ok ? response.json() : { enabled: false, model: null }))
    .then((data: EnhanceAvailability) => ({
      enabled: Boolean(data?.enabled),
      model: data?.model ?? null,
    }))
    .catch(() => ({ enabled: false, model: null }));
  return availabilityProbe;
}

/** Only the handful of answers that help ground a rewrite - never the whole project. */
export function buildEnhanceContext(project: MerchantWebsiteProject): EnhanceContext {
  const cta = project.goals.primaryCTA ? CTA_BY_VALUE.get(project.goals.primaryCTA) : undefined;
  const location =
    formatAddress({ city: project.location.city, state: project.location.state }) || undefined;

  return {
    businessName: project.business.name.trim() || undefined,
    industry: industryLabel(project.business.industry) || undefined,
    location,
    serviceAreas: project.location.serviceAreas.slice(0, 8),
    services: project.services.map((service) => service.name).filter(Boolean).slice(0, 8),
    audience: project.audience.description?.trim() || undefined,
    primaryCTA: cta?.buttonLabel,
    brandPersonality: labelsFor(project.branding.personality),
  };
}

export interface EnhanceRequest {
  field: EnhanceField;
  text: string;
  context: EnhanceContext;
  signal?: AbortSignal;
}

export async function enhanceText({
  field,
  text,
  context,
  signal,
}: EnhanceRequest): Promise<string> {
  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, text, context }),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new EnhanceError("network", "Couldn't reach the enhancement service.");
  }

  const data = (await response.json().catch(() => null)) as
    | { text?: string; error?: string; message?: string }
    | null;

  if (!response.ok) {
    const code: EnhanceErrorCode =
      response.status === 501
        ? "unconfigured"
        : response.status === 401
          ? "auth"
          : response.status === 429
            ? "rate_limit"
            : response.status === 422
              ? "refused"
              : response.status === 400
                ? "bad_request"
                : "server";
    throw new EnhanceError(code, data?.message ?? "Enhancement failed.");
  }

  if (!data?.text) throw new EnhanceError("server", "No suggestion came back.");
  return data.text;
}
