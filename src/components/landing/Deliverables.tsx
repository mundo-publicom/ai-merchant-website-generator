import {
  Accent,
  CornerMarks,
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
  SectionLead,
  SectionTitle,
} from "./primitives";

/**
 * The eight tabs of the finished report, spelled out. This mirrors `TABS` in
 * `pages/ResultsPage.tsx` - the promise made here is the artefact delivered
 * there, in the same order.
 */
const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    body: "Your business in the words a stranger needs to hear, plus every fact the site has to state up front.",
  },
  {
    id: "strategy",
    title: "Strategy",
    body: "What the website is for, who it's talking to, and the single action it should be pushing towards.",
  },
  {
    id: "pages",
    title: "Pages",
    body: "A full sitemap with parent and child pages, recommended from your services and service areas.",
  },
  {
    id: "homepage",
    title: "Homepage",
    body: "Section-by-section architecture, in the order that makes your case fastest to a cold visitor.",
  },
  {
    id: "design",
    title: "Design",
    body: "Style direction, typography notes, colour palette and the references you told us to look at.",
  },
  {
    id: "features",
    title: "Features",
    body: "Required and optional functionality, separated so nobody builds a booking system you didn't ask for.",
  },
  {
    id: "seo",
    title: "SEO",
    body: "The terms your customers actually search, the location pages worth having, and content to write.",
  },
  {
    id: "prompt",
    title: "Website prompt",
    body: "The whole thing compiled into one build brief - copy it into an AI website builder and go.",
  },
];

export function Deliverables() {
  return (
    <section id="whats-inside" className="relative isolate scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal className="max-w-3xl">
          <Eyebrow>What's inside</Eyebrow>
          <SectionTitle className="mt-5">
            One document. <Accent>Eight</Accent> sections. Nothing left to guess.
          </SectionTitle>
          <SectionLead className="mt-5">
            This is the brief an agency would charge you for before a single pixel gets drawn -
            except it's generated from your answers, and you can edit any of it.
          </SectionLead>
        </Reveal>

        <Reveal className="relative mt-14" delay={0.06}>
          <CornerMarks />
          <RevealGroup
            as="ol"
            className="grid gap-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4"
            stagger={0.05}
          >
            {SECTIONS.map((section, index) => (
              <RevealItem as="li" key={section.id} className="bg-white p-6 sm:p-7">
                <span className="font-mono text-[13px] font-medium text-cobalt-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[16px] font-semibold text-ink-950">{section.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{section.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>

        <Reveal className="mt-8" delay={0.1}>
          <p className="text-[14px] leading-relaxed text-ink-500">
            Every section is copyable on its own, and the prompt comes in three forms - a plain
            website plan, a developer brief, and the AI generation prompt.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
