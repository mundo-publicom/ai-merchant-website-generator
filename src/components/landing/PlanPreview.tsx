import type { ReactNode } from "react";
import { Accent, CornerMarks, Eyebrow, Reveal, SectionLead, SectionTitle } from "./primitives";

const SITEMAP = [
  "Home",
  "Services",
  "  Emergency lockout",
  "  Residential",
  "  Commercial",
  "Service Areas",
  "Reviews",
  "FAQ",
  "Contact",
];

const HOMEPAGE = [
  "Hero",
  "Trust indicators",
  "Primary services",
  "Why choose us",
  "Reviews",
  "Service area",
  "Final CTA",
];

/**
 * A static illustration of the deliverable. Showing the artefact early answers
 * the only question a visitor actually has - "what do I end up holding?" - and
 * the sample is the same Miami locksmith the demo project loads, so the
 * preview and the example plan tell one story.
 */
export function PlanPreview() {
  return (
    <section className="relative isolate mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal className="max-w-3xl">
        <Eyebrow>The deliverable</Eyebrow>
        <SectionTitle className="mt-5">
          Not a template. A <Accent>specification</Accent> for your website.
        </SectionTitle>
        <SectionLead className="mt-5">
          Every answer feeds one document: the pages you need, the order your homepage should make
          its case in, and a build-ready prompt written in the language AI website builders expect.
        </SectionLead>
      </Reveal>

      <Reveal className="relative mt-12" delay={0.08}>
        <CornerMarks />
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-lift">
          <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50/70 px-4 py-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-ink-200" />
              <span className="size-2.5 rounded-full bg-ink-200" />
              <span className="size-2.5 rounded-full bg-ink-200" />
            </span>
            <p className="ml-2 text-[13px] font-medium text-ink-500">Your website plan</p>
            <p className="ml-auto hidden font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400 sm:block">
              Example · Miami locksmith
            </p>
          </div>

          <div className="grid gap-px bg-ink-100 sm:grid-cols-3">
            <PreviewPane label="Sitemap">
              <ul className="space-y-1.5 font-mono text-[13px] text-ink-700">
                {SITEMAP.map((page) => (
                  <li key={page} className="whitespace-pre">
                    {page}
                  </li>
                ))}
              </ul>
            </PreviewPane>

            <PreviewPane label="Homepage">
              <ol className="space-y-1.5 text-[13px] text-ink-700">
                {HOMEPAGE.map((section, index) => (
                  <li key={section} className="flex gap-2">
                    <span className="font-mono text-ink-400">{index + 1}.</span>
                    {section}
                  </li>
                ))}
              </ol>
            </PreviewPane>

            <PreviewPane label="Website prompt">
              <div className="space-y-2 font-mono text-[11px] leading-relaxed text-ink-500">
                <p className="font-semibold text-cobalt-700">BUSINESS</p>
                <p>Name: Miami Pro Locksmith</p>
                <p>Industry: Locksmith services</p>
                <p className="pt-2 font-semibold text-cobalt-700">PRIMARY CTA</p>
                <p>"Call Now" &rarr; (305) 555-0142</p>
                <p className="pt-2 font-semibold text-cobalt-700">DESIGN DIRECTION</p>
                <p>Professional corporate, high contrast&hellip;</p>
                <p className="pt-2 font-semibold text-cobalt-700">SEO</p>
                <p>emergency locksmith miami&hellip;</p>
              </div>
            </PreviewPane>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-ink-100 px-6 py-4 text-[13px] text-ink-400">
            {["Overview", "Strategy", "Pages", "Homepage", "Design", "Features", "SEO", "Prompt"].map(
              (tab, index) => (
                <span key={tab} className="flex items-center gap-2">
                  {index > 0 ? <span aria-hidden="true">·</span> : null}
                  {tab}
                </span>
              ),
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function PreviewPane({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-white p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
