import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SearchSelectOption {
  value: string;
  label: string;
  group?: string;
}

export interface SearchSelectProps {
  options: SearchSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  invalid?: boolean;
  /** Allows a free-text value stored as `custom:<text>`. */
  allowCustom?: boolean;
  customLabel?: string;
}

export function SearchSelect({
  options,
  value,
  onChange,
  placeholder = "Search...",
  id,
  invalid,
  allowCustom,
  customLabel = "Other / enter manually",
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCustom = value.startsWith("custom:");
  const selectedLabel = isCustom
    ? value.slice("custom:".length)
    : (options.find((option) => option.value === value)?.label ?? "");

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    inputRef.current?.focus();
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) || option.group?.toLowerCase().includes(q),
    );
  }, [options, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchSelectOption[]>();
    for (const option of filtered) {
      const key = option.group ?? "";
      const list = map.get(key) ?? [];
      list.push(option);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-2 rounded-xl border bg-white px-3.5 text-left text-[15px] transition-colors hover:border-ink-300 focus:border-cobalt-500 focus:outline-none focus:ring-4 focus:ring-cobalt-100",
          invalid ? "border-red-400" : "border-ink-200",
          selectedLabel ? "text-ink-900" : "text-ink-400",
        )}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-ink-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-ink-200 bg-white shadow-lift">
          <div className="flex items-center gap-2 border-b border-ink-100 px-3.5">
            <Search className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to search"
              aria-label="Search options"
              className="h-11 w-full bg-transparent text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
              onKeyDown={(event) => {
                if (event.key === "Escape") setOpen(false);
                if (event.key === "Enter" && filtered.length === 1) {
                  onChange(filtered[0].value);
                  setOpen(false);
                }
              }}
            />
          </div>

          <div role="listbox" className="max-h-72 overflow-y-auto p-1.5">
            {grouped.map(([group, groupOptions]) => (
              <div key={group}>
                {group ? (
                  <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                    {group}
                  </p>
                ) : null}
                {groupOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors",
                      option.value === value
                        ? "bg-cobalt-50 font-medium text-cobalt-700"
                        : "text-ink-700 hover:bg-ink-50",
                    )}
                  >
                    {option.label}
                    {option.value === value ? <Check className="size-4" /> : null}
                  </button>
                ))}
              </div>
            ))}

            {allowCustom ? (
              <div className="mt-1 border-t border-ink-100 p-2">
                <label htmlFor={`${id}-custom`} className="px-1 text-[12px] font-medium text-ink-500">
                  {customLabel}
                </label>
                <input
                  id={`${id}-custom`}
                  defaultValue={isCustom ? value.slice("custom:".length) : ""}
                  placeholder="Type your category"
                  className="mt-1.5 h-10 w-full rounded-lg border border-ink-200 px-3 text-[14px] focus:border-cobalt-500 focus:outline-none focus:ring-4 focus:ring-cobalt-100"
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    const text = event.currentTarget.value.trim();
                    if (text) {
                      onChange(`custom:${text}`);
                      setOpen(false);
                    }
                  }}
                  onBlur={(event) => {
                    const text = event.currentTarget.value.trim();
                    if (text && text !== selectedLabel) onChange(`custom:${text}`);
                  }}
                />
              </div>
            ) : null}

            {filtered.length === 0 && !allowCustom ? (
              <p className="px-3 py-6 text-center text-[13px] text-ink-400">No matches</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
