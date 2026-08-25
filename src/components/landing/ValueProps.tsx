import { ClipboardList, MessageSquareText, Sparkles } from "lucide-react";
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

const VALUE_PROPS = [
  {
    step: "01",
    icon: MessageSquareText,
    title: "Tell us about your business",
    body: "Answer straightforward business questions - what you sell, who buys it, and what you want more of. No web jargon, no technical decisions.",
    note: "Nothing you need to look up",
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Get a complete website strategy",
    body: "We translate your answers into a page structure, homepage layout, design direction, feature list and conversion plan a developer could build from.",
    note: "Recommended, then yours to edit",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Ready for website creation",
    body: "You finish with a detailed, AI-ready prompt containing everything needed to generate your website - yours to copy, keep and use.",
    note: "Copy, download, or hand it over",
  },
];

export function ValueProps() {
  return (
    <section className="relative isolate border-y border-ink-200/70 bg-white">
      <LightBackdrop />
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal className="max-w-3xl">
          <Eyebrow>Why it works</Eyebrow>
          <SectionTitle className="mt-5">
            You know your business. We know what a website <Accent>needs</Accent>.
          </SectionTitle>
          <SectionLead className="mt-5">
            Most website projects stall at the same place: nobody ever wrote down what the site is
            supposed to say or do. That document is the whole job - and it's the part you're
            uniquely qualified to answer.
          </SectionLead>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 sm:grid-cols-3">
          {VALUE_PROPS.map((prop) => (
            <RevealItem key={prop.title} className="group bg-white p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-ink-950 text-white transition-colors duration-200 group-hover:bg-cobalt-600">
                  <prop.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-[13px] font-medium text-ink-300">{prop.step}</span>
              </div>
              <h3 className="mt-5 text-[17px] font-semibold text-ink-950">{prop.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-600">{prop.body}</p>
              <p className="mt-5 border-t border-ink-100 pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-cobalt-600">
                {prop.note}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
