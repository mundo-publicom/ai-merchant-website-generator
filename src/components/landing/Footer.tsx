import { Logo } from "@/components/layout/Logo";

const LINKS = [
  { label: "What's inside", href: "#whats-inside" },
  { label: "How it works", href: "#how-it-works" },
  { label: "The model", href: "#the-model" },
  { label: "Who it's for", href: "#who-its-for" },
  { label: "Questions", href: "#faq" },
];

export function Footer({ onTryDemo }: { onTryDemo: () => void }) {
  return (
    <footer className="border-t border-ink-200/70 bg-canvas">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-[14px] leading-relaxed text-ink-500">
              A website blueprint builder for business owners. Answer questions about your business;
              walk away with the specification a website gets built from.
            </p>
          </div>

          <nav aria-label="Page sections" className="flex flex-col gap-2.5">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] text-ink-600 transition-colors hover:text-ink-950"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-ink-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-ink-400">
            Your answers are stored in this browser only. Nothing is uploaded.
          </p>
          {/* `/results` bounces to the wizard without a plan, so this loads the
              example rather than linking somewhere that redirects. */}
          <button
            type="button"
            onClick={onTryDemo}
            className="text-left text-[13px] font-medium text-cobalt-600 transition-colors hover:text-cobalt-700"
          >
            View a finished plan &rarr;
          </button>
        </div>
      </div>
    </footer>
  );
}
