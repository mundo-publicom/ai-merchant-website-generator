import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { SaveIndicator } from "@/components/wizard/SaveIndicator";
import { WizardProgress, type WizardProgressProps } from "@/components/wizard/WizardProgress";
import { Button } from "@/components/ui/Button";

export interface WizardLayoutProps extends WizardProgressProps {
  /** Identity of the current step, used to re-run the enter animation. */
  stepKey: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onBack: () => void;
  onContinue: () => void;
  onExit: () => void;
  continueLabel?: string;
  backLabel?: string;
  error?: string;
}

export function WizardLayout({
  stepKey,
  title,
  subtitle,
  children,
  onBack,
  onContinue,
  onExit,
  continueLabel = "Continue",
  backLabel = "Back",
  error,
  ...progress
}: WizardLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="sticky top-0 z-20 border-b border-ink-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <Logo />
          <div className="flex items-center gap-3">
            <SaveIndicator />
            <Button variant="ghost" size="sm" onClick={onExit}>
              Exit
            </Button>
          </div>
        </div>
        <WizardProgress {...progress} />
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-40 pt-10 sm:px-8 sm:pt-14 md:pb-28">
        <div key={stepKey} className="animate-fade-rise">
          <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-ink-950 sm:text-[32px]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-ink-500 sm:text-base">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-10 space-y-9">{children}</div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto w-full max-w-3xl px-5 py-3.5 sm:px-8">
          {error ? (
            <p className="mb-2.5 text-[13px] font-medium text-red-600">{error}</p>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="size-4" />
              {backLabel}
            </Button>
            <Button size="lg" onClick={onContinue} className="min-w-40 flex-1 sm:flex-none">
              {continueLabel}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
