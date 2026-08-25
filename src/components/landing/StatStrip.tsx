import { INDUSTRIES } from "@/data/industries";
import { RevealGroup, RevealItem } from "./primitives";

/**
 * The seam between the dark hero and the light page - four numbers that answer
 * "what am I actually signing up for?" before the visitor has to scroll for it.
 * Counts are derived from the option lists so they cannot drift from the app.
 */
const STATS = [
  { value: "10", label: "guided topics", detail: "One subject per screen" },
  { value: "~10", label: "minutes to finish", detail: "Progress saves as you go" },
  { value: "8", label: "sections in your plan", detail: "Overview through prompt" },
  { value: `${INDUSTRIES.length}`, label: "industries covered", detail: "Trades to restaurants" },
];

export function StatStrip() {
  return (
    <section aria-label="What you get" className="relative border-t border-white/10 bg-ink-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-lines mask-radial-fade"
      />
      <RevealGroup
        className="relative mx-auto grid w-full max-w-6xl grid-cols-2 gap-px bg-white/10 px-0 sm:grid-cols-4"
        stagger={0.07}
      >
        {STATS.map((stat) => (
          <RevealItem key={stat.label} className="bg-ink-950 px-5 py-8 sm:px-8 sm:py-10">
            <p className="text-[34px] font-semibold leading-none tracking-[-0.03em] text-white sm:text-[40px]">
              {stat.value}
            </p>
            <p className="mt-2.5 text-[14px] font-medium text-cobalt-300">{stat.label}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-400">{stat.detail}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
