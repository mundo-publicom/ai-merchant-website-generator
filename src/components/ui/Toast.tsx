import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToastStore, type ToastRecord, type ToastTone } from "@/store/useToastStore";
import { cn } from "@/utils/cn";

/** How long the leave animation runs before the toast is removed from the store. */
const LEAVE_MS = 180;

const TONES: Record<
  ToastTone,
  { icon: typeof Info; tile: string; bar: string; role: "status" | "alert" }
> = {
  success: {
    icon: CheckCircle2,
    tile: "bg-cobalt-50 text-cobalt-600 ring-1 ring-cobalt-100",
    bar: "bg-cobalt-500",
    role: "status",
  },
  info: {
    icon: Info,
    tile: "bg-ink-100 text-ink-600 ring-1 ring-ink-200",
    bar: "bg-ink-400",
    role: "status",
  },
  warning: {
    icon: AlertTriangle,
    tile: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
    bar: "bg-amber-500",
    role: "status",
  },
  error: {
    icon: XCircle,
    tile: "bg-red-50 text-red-600 ring-1 ring-red-100",
    bar: "bg-red-500",
    role: "alert",
  },
};

/**
 * Renders every active toast. Mounted once, at the app root.
 *
 * The viewport sits above the sticky headers and the wizard's fixed action bar,
 * and is pointer-transparent everywhere except on the cards themselves.
 */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div
      aria-live="polite"
      aria-relevant="additions text"
      className={cn(
        "pointer-events-none fixed z-[60] flex flex-col gap-2.5",
        // Mobile: across the top, clear of the fixed action bar at the bottom.
        "inset-x-0 top-0 items-center px-4 pt-4",
        // Desktop: bottom-right, high enough to clear the wizard's action bar.
        "sm:inset-x-auto sm:bottom-24 sm:right-5 sm:top-auto sm:items-end sm:px-0 sm:pt-0",
      )}
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} toast={item} />
      ))}
    </div>
  );
}

function ToastCard({ toast }: { toast: ToastRecord }) {
  const dismiss = useToastStore((state) => state.dismiss);
  const [leaving, setLeaving] = useState(false);

  // Auto-dismiss is paused while the pointer or keyboard focus is on the card,
  // so a toast can always be read to the end.
  const [paused, setPaused] = useState(false);
  const remainingRef = useRef(toast.duration);
  const startedAtRef = useRef(0);

  const close = useCallback(() => {
    setLeaving(true);
    setTimeout(() => dismiss(toast.id), LEAVE_MS);
  }, [dismiss, toast.id]);

  useEffect(() => {
    if (toast.duration <= 0 || leaving) return;
    if (paused) {
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current));
      return;
    }
    startedAtRef.current = Date.now();
    const timer = setTimeout(close, remainingRef.current);
    return () => clearTimeout(timer);
  }, [close, leaving, paused, toast.duration]);

  const tone = TONES[toast.tone];
  const Icon = tone.icon;

  return (
    <div
      role={tone.role}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className={cn(
        "pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-ink-200",
        "bg-white/95 shadow-lift backdrop-blur-md",
        leaving ? "animate-toast-out" : "animate-toast-in",
      )}
    >
      <div className="flex items-start gap-3 p-4 pr-11">
        <span
          aria-hidden="true"
          className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tone.tile)}
        >
          <Icon className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1 pt-1">
          <p className="text-[14px] font-semibold leading-snug text-ink-900">{toast.title}</p>
          {toast.description ? (
            <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{toast.description}</p>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={close}
        aria-label="Dismiss notification"
        className="absolute right-2.5 top-2.5 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
      >
        <X className="size-4" />
      </button>

      {toast.duration > 0 ? (
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-ink-100">
          <span
            className={cn("block h-full origin-left animate-toast-timer", tone.bar)}
            style={
              {
                "--toast-duration": `${toast.duration}ms`,
                animationPlayState: paused || leaving ? "paused" : "running",
              } as CSSProperties
            }
          />
        </span>
      ) : null}
    </div>
  );
}
