import { useEffect, useRef, useState } from "react";
import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/Input";
import {
  EnhanceError,
  buildEnhanceContext,
  enhanceText,
  getEnhanceAvailability,
} from "@/services/aiEnhance";
import { ENHANCE_FIELDS, type EnhanceField } from "@/services/enhanceFields";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "@/store/useToastStore";
import { cn } from "@/utils/cn";

export interface EnhanceableTextareaProps {
  field: EnhanceField;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  rows?: number;
  placeholder?: string;
  className?: string;
  "aria-labelledby"?: string;
  "aria-invalid"?: boolean;
}

/**
 * A textarea with an AI-backed "Enhance" action.
 *
 * The button is hidden entirely when the endpoint reports no API key, so it is
 * never a dead control. Every enhancement is undoable in one click.
 */
export function EnhanceableTextarea({
  field,
  value,
  onChange,
  id,
  rows,
  placeholder,
  className,
  ...aria
}: EnhanceableTextareaProps) {
  const spec = ENHANCE_FIELDS[field];

  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [previous, setPrevious] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let active = true;
    void getEnhanceAvailability().then((availability) => {
      if (active) setAvailable(availability.enabled);
    });
    return () => {
      active = false;
      abortRef.current?.abort();
    };
  }, []);

  const canTidyOnly = spec.mode === "tidy";
  const isEmpty = !value.trim();
  const disabled = busy || (canTidyOnly && isEmpty);

  const run = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setBusy(true);
    setMessage(null);
    const before = value;

    try {
      const improved = await enhanceText({
        field,
        text: value,
        // Read at click time rather than subscribed to, so typing in one field
        // does not re-render every other enhanceable field on the step.
        context: buildEnhanceContext(useProjectStore.getState().project),
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      if (improved.trim() === before.trim()) {
        setMessage(canTidyOnly ? "Nothing to fix - left as written." : "Already looks good.");
      } else {
        setPrevious(before);
        onChange(improved);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      const reason =
        error instanceof EnhanceError ? error.message : "Enhancement failed. Try again.";
      setMessage(reason);
      toast.error("Couldn't improve that answer", { description: reason, key: "enhance" });
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  };

  const undo = () => {
    if (previous === null) return;
    onChange(previous);
    setPrevious(null);
    setMessage(null);
  };

  const actionLabel = isEmpty && !canTidyOnly ? "Draft with AI" : spec.actionLabel;

  return (
    <div className="space-y-2">
      <Textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          if (previous !== null) setPrevious(null);
          if (message) setMessage(null);
        }}
        placeholder={placeholder}
        className={cn(busy && "opacity-70", className)}
        disabled={busy}
        {...aria}
      />

      <div className="flex flex-wrap items-center justify-end gap-2">
        <p
          className={cn(
            "mr-auto text-[13px]",
            message ? "text-ink-500" : "sr-only",
          )}
          role={message ? "status" : undefined}
          aria-live="polite"
        >
          {message ?? ""}
        </p>

        {previous !== null ? (
          <button
            type="button"
            onClick={undo}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800"
          >
            <RotateCcw className="size-3.5" />
            Undo
          </button>
        ) : null}

        {available ? (
          <button
            type="button"
            onClick={() => void run()}
            disabled={disabled}
            title={
              canTidyOnly
                ? "Fix spelling and punctuation only - the customer's wording is never changed"
                : "Improve this answer with AI"
            }
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-all duration-150",
              "border-cobalt-200 bg-cobalt-50 text-cobalt-700 hover:border-cobalt-300 hover:bg-cobalt-100",
              disabled && "cursor-not-allowed opacity-50 hover:bg-cobalt-50",
            )}
          >
            {busy ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="size-3.5" aria-hidden="true" />
            )}
            {busy ? "Writing…" : actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
