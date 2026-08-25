import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "animate-fade-rise relative w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-lift focus:outline-none sm:rounded-3xl sm:p-8",
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
        >
          <X className="size-4.5" />
        </button>
        <h2 className="pr-8 text-xl font-semibold tracking-tight text-ink-950">{title}</h2>
        {description ? (
          <div className="mt-3 text-[15px] leading-relaxed text-ink-600">{description}</div>
        ) : null}
        {children ? <div className="mt-5">{children}</div> : null}
        {footer ? <div className="mt-7 flex flex-wrap justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}
