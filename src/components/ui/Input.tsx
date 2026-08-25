import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const BASE =
  "w-full rounded-xl border border-ink-200 bg-white px-3.5 text-[15px] text-ink-900 placeholder:text-ink-400 transition-colors hover:border-ink-300 focus:border-cobalt-500 focus:outline-none focus:ring-4 focus:ring-cobalt-100 disabled:bg-ink-50 aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-100";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(BASE, "h-12", className)} {...props} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 4, ...props }, ref) {
  return (
    <textarea ref={ref} rows={rows} className={cn(BASE, "py-3 leading-relaxed", className)} {...props} />
  );
});
