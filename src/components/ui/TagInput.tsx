import { useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  id?: string;
  suggestions?: string[];
  invalid?: boolean;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
  id,
  suggestions = [],
  invalid,
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  const commit = (raw: string) => {
    const parts = raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .filter((part) => !value.some((v) => v.toLowerCase() === part.toLowerCase()));
    if (parts.length) onChange([...value, ...parts]);
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit(draft);
    } else if (event.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const available = suggestions.filter(
    (s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()),
  );

  return (
    <div className="space-y-2.5">
      <div
        className={cn(
          "flex min-h-12 flex-wrap items-center gap-2 rounded-xl border bg-white p-2 transition-colors focus-within:border-cobalt-500 focus-within:ring-4 focus-within:ring-cobalt-100",
          invalid ? "border-red-400" : "border-ink-200",
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink-100 py-1.5 pl-3 pr-1.5 text-[13px] font-medium text-ink-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((v) => v !== tag))}
              aria-label={`Remove ${tag}`}
              className="rounded p-0.5 text-ink-400 transition-colors hover:bg-ink-200 hover:text-ink-700"
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => commit(draft)}
          placeholder={value.length ? "Add another" : placeholder}
          className="h-8 min-w-[10rem] flex-1 bg-transparent px-2 text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      </div>
      {available.length ? (
        <div className="flex flex-wrap gap-1.5">
          {available.slice(0, 8).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => commit(suggestion)}
              className="inline-flex items-center gap-1 rounded-lg border border-dashed border-ink-300 px-2.5 py-1.5 text-[12px] font-medium text-ink-500 transition-colors hover:border-cobalt-400 hover:text-cobalt-700"
            >
              <Plus className="size-3" />
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
