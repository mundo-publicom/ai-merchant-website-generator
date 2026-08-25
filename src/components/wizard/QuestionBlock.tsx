import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface QuestionBlockProps {
  question: string;
  help?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}

/** One question with its label, helper copy, inline error and control. */
export function QuestionBlock({
  question,
  help,
  error,
  children,
  className,
  id,
}: QuestionBlockProps) {
  return (
    <section className={cn("space-y-3.5", className)} aria-labelledby={id}>
      <div className="space-y-1.5">
        <h3 id={id} className="text-[17px] font-semibold leading-snug text-ink-900">
          {question}
        </h3>
        {help ? <p className="max-w-prose text-[14px] leading-relaxed text-ink-500">{help}</p> : null}
      </div>
      {children}
      {error ? (
        <p role="alert" data-field-error className="text-[13px] font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </section>
  );
}
