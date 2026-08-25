import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}

/** Compact multi-select pill used for the long option lists. */
export function Chip({ label, selected, onToggle, disabled, className }: ChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150",
        selected
          ? "border-cobalt-500 bg-cobalt-600 text-white shadow-[0_1px_2px_rgba(66,80,224,0.35)]"
          : "border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50",
        disabled && !selected && "cursor-not-allowed opacity-45 hover:border-ink-200 hover:bg-white",
        className,
      )}
    >
      {selected ? <Check className="size-3.5 shrink-0" strokeWidth={3} aria-hidden="true" /> : null}
      {label}
    </button>
  );
}
