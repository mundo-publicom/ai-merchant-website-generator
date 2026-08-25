import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "subtle";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-ink-950 text-white hover:bg-ink-800 active:bg-ink-900 shadow-[0_1px_2px_rgba(11,13,18,0.16)] disabled:bg-ink-300",
  secondary:
    "bg-white text-ink-900 border border-ink-200 hover:border-ink-300 hover:bg-ink-50 disabled:text-ink-400",
  ghost: "text-ink-600 hover:text-ink-900 hover:bg-ink-100",
  subtle: "bg-cobalt-50 text-cobalt-700 hover:bg-cobalt-100 border border-cobalt-100",
  danger: "text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-11 px-4 text-sm gap-2 rounded-xl",
  lg: "h-13 px-6 text-[15px] gap-2 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex select-none items-center justify-center font-medium transition-all duration-150",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});
