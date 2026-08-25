import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export interface FieldProps {
  label?: string;
  htmlFor?: string;
  help?: ReactNode;
  error?: string;
  optional?: boolean;
  /** Rendered on the right of the label row, e.g. an enhance action. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Field({
  label,
  htmlFor,
  help,
  error,
  optional,
  action,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label || action ? (
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            {label ? (
              <label htmlFor={htmlFor} className="text-sm font-medium text-ink-900">
                {label}
              </label>
            ) : null}
            {optional ? <span className="text-xs text-ink-400">Optional</span> : null}
          </div>
          {action}
        </div>
      ) : null}
      {help ? <p className="text-[13px] leading-relaxed text-ink-500">{help}</p> : null}
      {children}
      {error ? (
        <p
          role="alert"
          data-field-error
          className="flex items-center gap-1.5 text-[13px] font-medium text-red-600"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
