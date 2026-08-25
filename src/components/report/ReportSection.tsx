import type { ReactNode } from "react";

export interface ReportSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function ReportSection({ title, description, action, children }: ReportSectionProps) {
  return (
    <section className="animate-fade-rise space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h2 className="text-[22px] font-semibold tracking-tight text-ink-950 sm:text-[26px]">
            {title}
          </h2>
          {description ? (
            <p className="max-w-prose text-[15px] leading-relaxed text-ink-500">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function FactList({ facts }: { facts: Array<{ label: string; value: string }> }) {
  return (
    <dl className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-200 bg-white">
      {facts.map((fact) => (
        <div key={fact.label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[13rem_1fr] sm:gap-4">
          <dt className="text-[13px] font-medium text-ink-500">{fact.label}</dt>
          <dd className="text-[15px] leading-relaxed text-ink-900">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
