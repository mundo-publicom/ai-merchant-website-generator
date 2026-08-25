import { cn } from "@/utils/cn";

export interface YesNoProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
  name: string;
}

export function YesNo({ value, onChange, yesLabel = "Yes", noLabel = "No", name }: YesNoProps) {
  const options: Array<{ label: string; option: boolean }> = [
    { label: yesLabel, option: true },
    { label: noLabel, option: false },
  ];

  return (
    <div className="inline-flex rounded-xl border border-ink-200 bg-ink-50 p-1" role="radiogroup" aria-label={name}>
      {options.map(({ label, option }) => (
        <button
          key={label}
          type="button"
          role="radio"
          aria-checked={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "min-h-9 min-w-24 rounded-lg px-4 text-sm font-medium transition-all duration-150",
            value === option
              ? "bg-white text-ink-900 shadow-[0_1px_2px_rgba(11,13,18,0.10)]"
              : "text-ink-500 hover:text-ink-800",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
