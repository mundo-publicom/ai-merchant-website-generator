import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-ink-200 bg-white", className)}>{children}</div>
  );
}

export function SectionHeading({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3", className)}>
      <div className="space-y-1">
        <h3 className="text-[15px] font-semibold text-ink-900">{title}</h3>
        {description ? (
          <p className="max-w-prose text-[13px] leading-relaxed text-ink-500">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
