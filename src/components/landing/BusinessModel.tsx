import { ArrowRight, Check, Download, Lock, ShieldCheck, Wallet } from "lucide-react";
import {
  Accent,
  CornerMarks,
  DarkBackdrop,
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
  SectionLead,
  SectionTitle,
  StatusDot,
} from "./primitives";

/**
 * The business model, stated plainly.
 *
 * A free tool that produces a valuable document invites one unspoken question:
 * "what's the catch?" Leaving that unanswered costs more trust than any feature
 * list buys back - so the exchange is on the page, in the hero's own visual
 * language, rather than buried in a pricing table that doesn't exist yet.
 */

const PHASES = [
  {
    number: "Phase 01",
    status: "live" as const,
    statusLabel: "Available now",
    title: "The blueprint",
    price: "Free",
    priceNote: "No account, no card, no trial clock",
    body: "Answer the questions and the full specification is generated for you - strategy, sitemap, homepage architecture, design direction, features, SEO, and the AI generation prompt.",
    points: [
      "Ten topics of plain-language questions",
      "A complete website specification",
      "An AI-ready generation prompt",
      "Copy or download every section",
      "Edit any answer and regenerate",
    ],
  },
  {
    number: "Phase 02",
    status: "pending" as const,
    statusLabel: "Coming next",
    title: "The build",
    price: "Later",
    priceNote: "The blueprint stays free either way",
    body: "The same blueprint, turned into a working website without leaving the app. Until then the Build button is honest about what it is: a marker for what comes next.",
    points: [
      "Generate the site from your blueprint",
      "Review before anything goes live",
      "Keep the plan as the source of truth",
      "Nothing you've answered gets re-asked",
    ],
  },
];

const PRINCIPLES = [
  {
    icon: Download,
    title: "The output is yours",
    body: "Copy it, download it, hand it to any AI builder, developer or agency. It works fine somewhere else.",
  },
  {
    icon: Lock,
    title: "No lock-in by design",
    body: "The plan is plain text and the prompt is portable. Nothing about it only works here.",
  },
  {
    icon: ShieldCheck,
    title: "Your answers stay put",
    body: "Everything is saved in your own browser. There's no account to create and no database holding it.",
  },
  {
    icon: Wallet,
    title: "We'd rather earn the build",
    body: "Charging for the plan would mean charging you to find out what you need. That part should be free.",
  },
];

export function BusinessModel() {
  return (
    <section id="the-model" className="relative isolate scroll-mt-20 overflow-hidden bg-ink-950">
      <DarkBackdrop />

      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal className="max-w-3xl">
          <Eyebrow tone="dark">The model</Eyebrow>
          <SectionTitle tone="dark" className="mt-5">
            Free to plan. <Accent tone="dark">Yours</Accent> to build.
          </SectionTitle>
          <SectionLead tone="dark" className="mt-5">
            Two phases, and only one of them is a product you'd ever pay for. Here's exactly where
            the line sits, so you know what you're getting before you spend ten minutes on it.
          </SectionLead>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8" stagger={0.12}>
          {PHASES.map((phase) => (
            <RevealItem key={phase.number} className="relative">
              <div
                className={
                  phase.status === "live"
                    ? "relative h-full rounded-2xl border border-cobalt-400/40 bg-white/[0.06] p-7 backdrop-blur-sm sm:p-9"
                    : "relative h-full rounded-2xl border border-white/12 bg-white/[0.02] p-7 sm:p-9"
                }
              >
                {phase.status === "live" ? <CornerMarks tone="dark" /> : null}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-400">
                    {phase.number}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1">
                    <StatusDot tone={phase.status} />
                    <span
                      className={
                        phase.status === "live"
                          ? "text-[12px] font-medium text-green-400"
                          : "text-[12px] font-medium text-ink-400"
                      }
                    >
                      {phase.statusLabel}
                    </span>
                  </span>
                </div>

                <h3 className="mt-6 text-[26px] font-semibold tracking-[-0.02em] text-white sm:text-[30px]">
                  {phase.title}
                </h3>

                <div className="mt-4 flex items-baseline gap-3">
                  <span
                    className={
                      phase.status === "live"
                        ? "font-display text-[40px] italic leading-none text-cobalt-300"
                        : "font-display text-[40px] italic leading-none text-ink-500"
                    }
                  >
                    {phase.price}
                  </span>
                  <span className="text-[13px] text-ink-400">{phase.priceNote}</span>
                </div>

                <p className="mt-5 text-[15px] leading-relaxed text-ink-300">{phase.body}</p>

                <ul className="mt-7 space-y-3 border-t border-white/10 pt-7">
                  {phase.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[14px] text-ink-200">
                      <span
                        aria-hidden="true"
                        className={
                          phase.status === "live"
                            ? "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-cobalt-500/20 text-cobalt-300"
                            : "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-white/5 text-ink-500"
                        }
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* The exchange, said out loud. */}
        <Reveal className="mt-10" delay={0.08}>
          <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03] p-7 sm:p-9">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cobalt-400/0 via-cobalt-400/70 to-cobalt-400/0"
            />
            <p className="max-w-4xl text-balance text-[19px] leading-relaxed text-white sm:text-[22px]">
              The blueprint is free because it's{" "}
              <Accent tone="dark">useful without us</Accent> - take it to any AI builder, a
              developer, or the agency quoting you next week. If it's good enough to make that
              decision easier, it's good enough to bring you back when the build is ready.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((principle) => (
            <RevealItem key={principle.title} className="bg-ink-950 p-6 sm:p-7">
              <span className="flex size-10 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-cobalt-300">
                <principle.icon className="size-[18px]" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-[15px] font-semibold text-white">{principle.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-400">{principle.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10" delay={0.06}>
          <a
            href="#faq"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-cobalt-300 transition-colors hover:text-cobalt-200"
          >
            Still have questions? Read the honest answers
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
