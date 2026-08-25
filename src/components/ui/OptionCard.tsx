import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

export interface OptionCardProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  selected: boolean;
  onSelect: () => void;
  /** Radio semantics by default; set to "checkbox" for multi-select grids. */
  role?: "radio" | "checkbox";
  className?: string;
  children?: ReactNode;
}

export function OptionCard({
  title,
  description,
  icon,
  selected,
  onSelect,
  role = "radio",
  className,
  children,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "group relative flex w-full flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-all duration-150",
        selected
          ? "border-cobalt-500 bg-cobalt-50/60 ring-4 ring-cobalt-100"
          : "border-ink-200 bg-white hover:border-ink-300 hover:shadow-soft",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-4 top-4 flex size-5 items-center justify-center rounded-full border transition-colors",
          selected ? "border-cobalt-600 bg-cobalt-600 text-white" : "border-ink-300 bg-white",
          role === "radio" ? "rounded-full" : "rounded-md",
        )}
      >
        {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </span>
      {icon ? (
        <span
          className={cn(
            "mb-1 flex size-10 items-center justify-center rounded-xl transition-colors",
            selected ? "bg-cobalt-600 text-white" : "bg-ink-100 text-ink-600",
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="pr-7 text-[15px] font-semibold text-ink-900">{title}</span>
      {description ? (
        <span className="text-[13px] leading-relaxed text-ink-500">{description}</span>
      ) : null}
      {children}
    </button>
  );
}
