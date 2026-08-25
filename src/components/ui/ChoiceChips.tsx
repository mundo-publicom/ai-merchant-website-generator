import { useState } from "react";
import { Plus } from "lucide-react";
import type { Choice } from "@/data/options";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface ChoiceChipsProps {
  options: Choice[];
  value: string[];
  onChange: (value: string[]) => void;
  /** Adds an "Other" chip that stores free text as `other:<text>`. */
  allowOther?: boolean;
  otherPlaceholder?: string;
  max?: number;
  /** Single-select mode stores at most one value. */
  single?: boolean;
}

export function ChoiceChips({
  options,
  value,
  onChange,
  allowOther,
  otherPlaceholder = "Tell us more",
  max,
  single,
}: ChoiceChipsProps) {
  const others = value.filter((v) => v.startsWith("other:"));
  const [otherOpen, setOtherOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const showOther = otherOpen || others.length > 0;

  const atMax = max !== undefined && value.length >= max;

  const toggle = (optionValue: string) => {
    if (single) {
      onChange(value.includes(optionValue) ? [] : [optionValue]);
      return;
    }
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else if (!atMax) {
      onChange([...value, optionValue]);
    }
  };

  const addOther = () => {
    const text = draft.trim();
    if (!text) return;
    const tag = `other:${text}`;
    if (!value.includes(tag) && !atMax) onChange([...value, tag]);
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="group">
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={value.includes(option.value)}
            disabled={atMax && !value.includes(option.value)}
            onToggle={() => toggle(option.value)}
          />
        ))}
        {others.map((other) => (
          <Chip
            key={other}
            label={other.slice("other:".length)}
            selected
            onToggle={() => onChange(value.filter((v) => v !== other))}
          />
        ))}
        {allowOther && !showOther ? (
          <button
            type="button"
            onClick={() => setOtherOpen(true)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-dashed border-ink-300 px-4 py-2 text-sm font-medium text-ink-500 transition-colors hover:border-cobalt-400 hover:text-cobalt-700"
          >
            <Plus className="size-3.5" />
            Other
          </button>
        ) : null}
      </div>

      {allowOther && showOther ? (
        <div className="flex flex-wrap gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addOther();
              }
            }}
            placeholder={otherPlaceholder}
            className="h-11 max-w-xs flex-1"
            aria-label={otherPlaceholder}
          />
          <Button variant="secondary" onClick={addOther} disabled={!draft.trim() || atMax}>
            Add
          </Button>
        </div>
      ) : null}

      {max !== undefined ? (
        <p className="text-[13px] text-ink-400">
          {value.length} of {max} selected
        </p>
      ) : null}
    </div>
  );
}
