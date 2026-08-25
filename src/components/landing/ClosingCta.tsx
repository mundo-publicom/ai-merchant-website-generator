import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Accent, CornerMarks, DarkBackdrop, Reveal } from "./primitives";

export function ClosingCta({
  saved,
  onStart,
  onTryDemo,
}: {
  saved: boolean;
  onStart: () => void;
  onTryDemo: () => void;
}) {
  return (
    <section className="relative isolate overflow-hidden border-t border-ink-200/70 bg-ink-950">
      <DarkBackdrop />

      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="relative mx-auto max-w-4xl px-2">
          {/* The hero's framed headline, closing the page the way it opened.
              The border lives in its own layer: a CSS mask on an element stops
              its children from ever registering as in-view, which would leave
              the corner marks stuck at their entrance opacity. */}
          <div className="relative px-6 py-12 text-center sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 border border-white/15 mask-frame-fade"
            />
            <CornerMarks tone="dark" />
            <h2 className="text-balance text-[32px] font-semibold leading-[1.06] tracking-[-0.03em] text-white sm:text-[46px]">
              Stop guessing what your website should <Accent tone="dark">say</Accent>.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-[16px] leading-relaxed text-ink-300 sm:text-[17px]">
              Ten minutes of questions gives you a website specification most businesses never get
              around to writing - and never stop paying for.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-3" delay={0.08}>
          <Button size="lg" onClick={onStart} className="bg-white text-ink-950 hover:bg-ink-100">
            {saved ? "Continue your website plan" : "Create my website plan"}
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={onTryDemo}
            className="border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            See an example first
          </Button>
        </Reveal>

        <Reveal className="mt-5 text-center text-[13px] text-ink-400" delay={0.12}>
          <p>Free · No account · Your answers stay in your browser</p>
        </Reveal>
      </div>
    </section>
  );
}
