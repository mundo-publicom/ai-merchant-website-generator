import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface StepGroupProps {
  /** Omit on a step that holds a single topic. */
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * One topic inside a step.
 *
 * The wizard groups several former screens onto a single step, so each group
 * gets a quiet eyebrow heading and a hairline rule to keep a long page
 * scannable without turning it back into a list of screens.
 */
export function StepGroup({ title, description, children, className }: StepGroupProps) {
  return (
    <section
      className={cn(
        "space-y-8 border-t border-ink-100 pt-9 first:border-t-0 first:pt-0",
        className,
      )}
    >
      {title ? (
        <div className="space-y-1.5">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-ink-500">
            {title}
          </h2>
          {description ? (
            <p className="max-w-prose text-[14px] leading-relaxed text-ink-500">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
