import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BusinessModel } from "@/components/landing/BusinessModel";
import { ClosingCta } from "@/components/landing/ClosingCta";
import { Deliverables } from "@/components/landing/Deliverables";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Industries } from "@/components/landing/Industries";
import { PlanPreview } from "@/components/landing/PlanPreview";
import { StatStrip } from "@/components/landing/StatStrip";
import { ValueProps } from "@/components/landing/ValueProps";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "@/store/useToastStore";
import { clampStepIndex, WIZARD_STEPS } from "@/store/wizardSteps";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { label: "What's inside", href: "#whats-inside" },
  { label: "How it works", href: "#how-it-works" },
  { label: "The model", href: "#the-model" },
  { label: "Questions", href: "#faq" },
];

export function LandingPage() {
  const navigate = useNavigate();
  const resetProject = useProjectStore((state) => state.resetProject);
  const loadDemoProject = useProjectStore((state) => state.loadDemoProject);
  const project = useProjectStore((state) => state.project);
  const currentStep = useProjectStore((state) => state.currentStep);
  const hasSavedProject = useProjectStore((state) => state.hasSavedProject);

  const [confirmRestart, setConfirmRestart] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // The hero is dark; the header only takes its light frosted treatment once
  // the page has scrolled past it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const saved = hasSavedProject
    ? { name: project.business.name || "Untitled plan", updatedAt: project.updatedAt }
    : null;

  const resumeStepId = WIZARD_STEPS[clampStepIndex(currentStep)].id;

  const startFresh = () => {
    resetProject();
    navigate(`/plan/${WIZARD_STEPS[0].id}`);
  };

  const start = () => (saved ? navigate(`/plan/${resumeStepId}`) : startFresh());

  const tryDemo = () => {
    loadDemoProject();
    navigate("/results");
    toast.info("Example plan loaded", {
      description: "This is a fully answered plan for a Miami locksmith. Edit any answer to make it yours.",
    });
  };

  return (
    <div className="min-h-dvh bg-canvas">
      <header
        className={cn(
          "sticky top-0 z-20 border-b transition-colors duration-300",
          scrolled
            ? "border-ink-200/70 bg-canvas/85 backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Logo tone={scrolled ? "dark" : "light"} />
          <div className="flex items-center gap-1">
            <nav aria-label="Page sections" className="hidden items-center lg:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-[14px] font-medium transition-colors",
                    scrolled ? "text-ink-600 hover:text-ink-900" : "text-ink-300 hover:text-white",
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <a
              href="#how-it-works"
              className={cn(
                "hidden rounded-lg px-3 py-2 text-[14px] font-medium transition-colors sm:block lg:hidden",
                scrolled ? "text-ink-600 hover:text-ink-900" : "text-ink-300 hover:text-white",
              )}
            >
              How it works
            </a>
            <Button
              size="sm"
              onClick={start}
              className={cn("ml-2", !scrolled && "bg-white text-ink-950 hover:bg-ink-100")}
            >
              {saved ? "Continue" : "Get started"}
            </Button>
          </div>
        </div>
      </header>

      <main>
        <Hero saved={saved} onStart={start} onRestart={() => setConfirmRestart(true)} />
        <StatStrip />
        <PlanPreview />
        <ValueProps />
        <Deliverables />
        <HowItWorks onTryDemo={tryDemo} />
        <BusinessModel />
        <Industries />
        <Faq />
        <ClosingCta saved={Boolean(saved)} onStart={start} onTryDemo={tryDemo} />
      </main>

      <Footer onTryDemo={tryDemo} />

      <Modal
        open={confirmRestart}
        onClose={() => setConfirmRestart(false)}
        title="Start a new plan?"
        description="Your saved answers will be permanently deleted from this browser."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmRestart(false)}>
              Keep my plan
            </Button>
            <Button
              onClick={() => {
                setConfirmRestart(false);
                startFresh();
                toast.success("Started a new plan", {
                  description: "Your previous answers were deleted from this browser.",
                });
              }}
            >
              Delete and start new
            </Button>
          </>
        }
      />
    </div>
  );
}
