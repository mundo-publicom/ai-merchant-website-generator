import { cn } from "@/utils/cn";

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
  id?: string;
  ariaLabel: string;
  className?: string;
}

export function Slider({
  value,
  onChange,
  minLabel,
  maxLabel,
  id,
  ariaLabel,
  className,
}: SliderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        aria-label={ariaLabel}
        aria-valuetext={`${value} out of 100`}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-ink-200 accent-cobalt-600 [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-cobalt-600 [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(11,13,18,0.3)]"
      />
      <div className="flex justify-between text-[13px] font-medium text-ink-500">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
