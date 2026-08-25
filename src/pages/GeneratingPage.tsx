import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "@/store/useToastStore";
import { isProjectReadyForReport } from "@/schemas/projectSchema";
import { cn } from "@/utils/cn";

const STAGES = [
  "Understanding your business…",
  "Organising your services…",
  "Mapping your customers and goals…",
  "Planning your website pages…",
  "Designing your homepage structure…",
  "Creating your conversion strategy…",
  "Preparing your website development brief…",
  "Building your website generation prompt…",
];

const STAGE_MS = 460;

export function GeneratingPage() {
  const navigate = useNavigate();
  const project = useProjectStore((state) => state.project);
  const [stage, setStage] = useState(0);
  const ready = useMemo(() => isProjectReadyForReport(project), [project]);

  useEffect(() => {
    if (!ready) {
      toast.warning("A few answers are still missing", {
        description: "We need your business details, at least one service, and a goal.",
      });
      navigate("/plan/basics", { replace: true });
      return;
    }

    // Owned by this run only, so a re-run can never clear another run's timers
    // or leak the ones it scheduled.
    const timers = Array.from({ length: STAGES.length }, (_, offset) =>
      setTimeout(() => setStage(offset + 1), STAGE_MS * (offset + 1)),
    );
    timers.push(
      setTimeout(() => navigate("/results", { replace: true }), STAGE_MS * (STAGES.length + 1)),
    );
    return () => timers.forEach(clearTimeout);
  }, [navigate, ready]);

  const percent = Math.round((stage / STAGES.length) * 100);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="flex h-16 items-center px-5 sm:px-8">
        <Logo />
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 pb-24 sm:px-8">
        <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-ink-950 sm:text-[32px]">
          Building your website plan
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
          We're turning everything you told us into a complete website specification.
        </p>

        <div className="mt-8" role="status" aria-live="polite">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-200">
            <div
              className="h-full rounded-full bg-cobalt-600 transition-[width] duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="sr-only">{percent}% complete</p>
        </div>

        <ol className="mt-8 space-y-3">
          {STAGES.map((label, index) => {
            const done = index < stage;
            const active = index === stage;
            return (
              <li
                key={label}
                className={cn(
                  "flex items-center gap-3 text-[15px] transition-colors duration-300",
                  done && "text-ink-500",
                  active && "font-medium text-ink-900",
                  !done && !active && "text-ink-300",
                )}
              >
                <span className="flex size-5 shrink-0 items-center justify-center">
                  {done ? (
                    <Check className="size-4 text-cobalt-600" strokeWidth={3} aria-hidden="true" />
                  ) : active ? (
                    <Loader2 className="size-4 animate-spin text-cobalt-600" aria-hidden="true" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-ink-200" aria-hidden="true" />
                  )}
                </span>
                {label}
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
