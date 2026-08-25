import { Plus } from "lucide-react";
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

const FAQS = [
  {
    question: "Do I need to know anything about websites?",
    answer:
      "No - that's the point. Every question is about your business: what you sell, who buys it, where you work, what you want more of. There are no technical decisions to make and no jargon to decode. The web thinking happens on our side.",
  },
  {
    question: "What exactly do I get at the end?",
    answer:
      "A website plan in eight sections - business overview, strategy, sitemap, homepage architecture, design direction, features, SEO - plus a generation prompt containing all of it. The prompt for our example business runs to about 2,700 words. You can copy any section on its own or download the whole thing.",
  },
  {
    question: "Can I use the prompt with any AI tool?",
    answer:
      "Yes. It's plain text, written to be read by an AI website builder, and it comes in three forms: a human-readable website plan, a developer brief, and the generation prompt itself. Nothing in it is specific to us.",
  },
  {
    question: "Does this build the website for me?",
    answer:
      "Not yet. Right now it produces the blueprint - the specification a person or an AI builds from. Generating the site from that blueprint is the next phase, and the Build button says so rather than pretending otherwise.",
  },
  {
    question: "What happens to my answers?",
    answer:
      "They're saved in your own browser and stay there. There's no account to create, no sign-up, and no server storing your plan. Clearing your browser data clears the plan, so download it once you're happy with it.",
  },
  {
    question: "Can I change my answers later?",
    answer:
      "Any of them, any time. The review screen lists every answer with an edit link, and the plan regenerates from whatever the answers currently say. If you rename or reorder the recommended pages, your version is kept from then on.",
  },
  {
    question: "I already have a website - is this useful?",
    answer:
      "Yes, and the first question asks which situation you're in. For a redesign, we take what you have as the starting point: what's working, what isn't, and what has to survive the rebuild.",
  },
  {
    question: "How long does it really take?",
    answer:
      "Around ten minutes if you already know your business, which you do. Progress saves after every answer, so stopping halfway and finishing tomorrow costs you nothing.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative isolate scroll-mt-20 border-y border-ink-200/70 bg-white">
      <LightBackdrop />
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <Eyebrow>Questions</Eyebrow>
            <SectionTitle className="mt-5">
              The <Accent>honest</Accent> answers.
            </SectionTitle>
            <SectionLead className="mt-5">
              Including the ones we'd rather you didn't ask.
            </SectionLead>
          </Reveal>

          <RevealGroup className="divide-y divide-ink-200 border-y border-ink-200" stagger={0.05}>
            {FAQS.map((faq) => (
              <RevealItem key={faq.question}>
                <details className="group">
                  <summary className="flex list-none items-start justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                    <h3 className="text-[16px] font-semibold text-ink-950 transition-colors group-hover:text-cobalt-700 sm:text-[17px]">
                      {faq.question}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border border-ink-200 text-ink-500 transition-transform duration-200 group-open:rotate-45 group-open:border-cobalt-200 group-open:text-cobalt-600"
                    >
                      <Plus className="size-3.5" strokeWidth={2.5} />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 pr-12 text-[15px] leading-relaxed text-ink-600">
                    {faq.answer}
                  </p>
                </details>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
