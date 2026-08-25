import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import type { WizardStep } from "@/store/wizardSteps";

export interface WizardProgressProps {
  steps: WizardStep[];
  currentIndex: number;
  /** Highest step reached - everything up to here stays clickable. */
  furthestIndex: number;
  onSelectStep: (index: number) => void;
}

export function WizardProgress({
  steps,
  currentIndex,
  furthestIndex,
  onSelectStep,
}: WizardProgressProps) {
  const current = steps[currentIndex];
  const percent = Math.round(((currentIndex + 1) / steps.length) * 100);

  return (
    <div className="border-b border-ink-200/80 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        {/* Mobile */}
        <div className="py-3.5 md:hidden">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[13px] font-medium text-ink-500">
              Step {currentIndex + 1} of {steps.length}
            </p>
            <p className="truncate text-[13px] font-semibold text-ink-900">{current?.label}</p>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-cobalt-600 transition-[width] duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Desktop */}
        <nav aria-label="Progress" className="relative hidden md:block">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent"
          />
          <ol className="no-scrollbar flex items-center gap-0.5 overflow-x-auto py-3">
            {steps.map((step, index) => {
              const isCurrent = index === currentIndex;
              const isDone = index < currentIndex;
              const reachable = index <= furthestIndex;

              return (
                <li key={step.id} className="flex shrink-0 items-center">
                  <button
                    type="button"
                    disabled={!reachable}
                    onClick={() => onSelectStep(index)}
                    aria-current={isCurrent ? "step" : undefined}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                      isCurrent && "bg-ink-950 text-white",
                      !isCurrent && isDone && "text-ink-700 hover:bg-ink-100",
                      !isCurrent && !isDone && "text-ink-400",
                      reachable ? "cursor-pointer" : "cursor-default",
                    )}
                  >
                    {isDone ? (
                      <Check
                        className="size-3.5 text-cobalt-600"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    ) : null}
                    {step.label}
                  </button>
                  {index < steps.length - 1 ? (
                    <span aria-hidden="true" className="mx-0.5 text-ink-300">
                      ›
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
