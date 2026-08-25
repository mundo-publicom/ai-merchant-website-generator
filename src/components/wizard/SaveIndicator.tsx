import { Check, CloudOff, Loader2 } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";

export function SaveIndicator() {
  const status = useProjectStore((state) => state.saveStatus);

  if (status === "idle") return null;

  const content = {
    saving: {
      icon: <Loader2 className="size-3.5 animate-spin" />,
      label: "Saving",
      className: "text-ink-400",
    },
    saved: { icon: <Check className="size-3.5" />, label: "Saved", className: "text-ink-400" },
    error: {
      icon: <CloudOff className="size-3.5" />,
      label: "Not saved",
      className: "text-amber-600",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${content.className}`}
      role="status"
      aria-live="polite"
    >
      {content.icon}
      <span>{content.label}</span>
    </span>
  );
}
