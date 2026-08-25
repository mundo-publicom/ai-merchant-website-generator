import { LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WIZARD_STEPS } from "@/store/wizardSteps";
import {
  Accent,
  Eyebrow,
  LightBackdrop,
  Reveal,
  RevealGroup,
  RevealItem,
  SectionLead,
  SectionTitle,
} from "./primitives";

const STEPS = [
  {
    number: "01",
    title: "Answer the questions",
    body: "Around ten minutes, one topic per screen. Your progress saves as you go - leave and come back.",
  },
  {
    number: "02",
    title: "Review your answers",
    body: "Everything in one place, with an edit link on every section. Nothing is locked in.",
  },
  {
    number: "03",
    title: "Get your website plan",
    body: "Strategy, sitemap, homepage architecture, design brief, features and SEO - generated instantly.",
  },
  {
    number: "04",
    title: "Copy your prompt",
    body: "A complete build brief you can hand to an AI website builder, a developer, or an agency.",
  },
];

export function HowItWorks({ onTryDemo }: { onTryDemo: () => void }) {
  return (
    <section
      id="how-it-works"
      className="relative isolate scroll-mt-20 border-y border-ink-200/70 bg-white"
    >
      <LightBackdrop />
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal className="max-w-3xl">
          <Eyebrow>How it works</Eyebrow>
          <SectionTitle className="mt-5">
            Four steps between here and a <Accent>finished</Accent> brief.
          </SectionTitle>
          <SectionLead className="mt-5">
            No account, no install, no call with a salesperson. Open it, answer, walk away with the
            document.
          </SectionLead>
        </Reveal>

        <RevealGroup
          as="ol"
          className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((step) => (
            <RevealItem as="li" key={step.number} className="relative bg-white p-6 sm:p-7">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cobalt-400/0 via-cobalt-400/60 to-cobalt-400/0"
              />
              <span className="font-mono text-[13px] font-medium text-cobalt-600">
                {step.number}
              </span>
              <h3 className="mt-3 text-[16px] font-semibold text-ink-950">{step.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* The ten topics, named. "Ten minutes of questions" is easier to
            commit to once you can see exactly which ten. */}
        <Reveal className="mt-10" delay={0.06}>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
            The ten topics
          </p>
          <ol className="mt-4 flex flex-wrap gap-2">
            {WIZARD_STEPS.map((step, index) => (
              <li
                key={step.id}
                className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-ink-50/60 px-3 py-1.5 text-[13px] font-medium text-ink-700"
              >
                <span className="font-mono text-[11px] text-ink-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {step.label}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal
          className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-ink-200 bg-ink-50/60 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8"
          delay={0.1}
        >
          <div>
            <h3 className="text-[17px] font-semibold text-ink-950">Want to see the output first?</h3>
            <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-ink-600">
              Load a fully answered example - a Miami locksmith - and jump straight to the finished
              plan and generated prompt. Nothing to fill in.
            </p>
          </div>
          <Button variant="secondary" size="lg" onClick={onTryDemo} className="shrink-0">
            <LayoutTemplate className="size-4" />
            Try with an example business
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
