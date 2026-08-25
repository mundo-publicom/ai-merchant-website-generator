import { useMemo } from "react";
import { INDUSTRIES } from "@/data/industries";
import {
  Accent,
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
  SectionLead,
  SectionTitle,
} from "./primitives";

/** Groups the industry list the wizard already ships, so the two cannot drift. */
function useIndustryGroups() {
  return useMemo(() => {
    const groups = new Map<string, string[]>();
    for (const industry of INDUSTRIES) {
      if (industry.group === "Other") continue;
      const existing = groups.get(industry.group);
      if (existing) existing.push(industry.label);
      else groups.set(industry.group, [industry.label]);
    }
    return [...groups.entries()].map(([name, labels]) => ({ name, labels }));
  }, []);
}

export function Industries() {
  const groups = useIndustryGroups();

  return (
    <section id="who-its-for" className="relative isolate scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal className="max-w-3xl">
          <Eyebrow>Who it's for</Eyebrow>
          <SectionTitle className="mt-5">
            Built for the businesses that get the <Accent>worst</Accent> websites.
          </SectionTitle>
          <SectionLead className="mt-5">
            Local trades, restaurants, clinics, studios, professional practices - businesses whose
            customers are searching for them right now, and finding a Facebook page. The questions
            adapt to what you do: an emergency plumber and a bakery are not asked the same things.
          </SectionLead>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
          {groups.map((group) => (
            <RevealItem key={group.name} className="bg-white p-6 sm:p-7">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[15px] font-semibold text-ink-950">{group.name}</h3>
                <span className="font-mono text-[12px] text-cobalt-600">{group.labels.length}</span>
              </div>
              <ul className="mt-4 space-y-1.5">
                {group.labels.slice(0, 5).map((label) => (
                  <li key={label} className="text-[14px] leading-relaxed text-ink-600">
                    {label}
                  </li>
                ))}
                {group.labels.length > 5 ? (
                  <li className="text-[14px] text-ink-400">
                    +{group.labels.length - 5} more
                  </li>
                ) : null}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-8" delay={0.08}>
          <p className="text-[14px] leading-relaxed text-ink-500">
            Not on the list? Type your own - the plan is generated from your answers, not from a
            category.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
