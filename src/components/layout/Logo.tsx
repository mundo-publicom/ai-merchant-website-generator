import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

export function Logo({
  className,
  to = "/",
  tone = "dark",
}: {
  className?: string;
  to?: string;
  /** `light` inverts the mark for use on dark backgrounds. */
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80",
        light ? "text-white" : "text-ink-950",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-8 items-center justify-center rounded-[10px]",
          light ? "bg-white" : "bg-ink-950",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          className={cn("size-4", light ? "text-ink-950" : "text-white")}
          fill="none"
        >
          <path
            d="M4 7h16M4 12h10M4 17h13"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-tight">WebBlueprint</span>
    </Link>
  );
}
