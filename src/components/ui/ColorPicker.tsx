import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export interface ColorPickerProps {
  colors: string[];
  onChange: (colors: string[]) => void;
}

export function ColorPicker({ colors, onChange }: ColorPickerProps) {
  const [draft, setDraft] = useState("#4250e0");
  const valid = HEX.test(draft.trim());

  const add = () => {
    const hex = draft.trim().toLowerCase();
    if (!HEX.test(hex) || colors.includes(hex)) return;
    onChange([...colors, hex]);
  };

  return (
    <div className="space-y-4">
      {colors.length ? (
        <ul className="flex flex-wrap gap-2.5">
          {colors.map((color, index) => (
            <li
              key={color}
              className="group flex items-center gap-2.5 rounded-xl border border-ink-200 bg-white py-2 pl-2 pr-1.5"
            >
              <span
                className="size-8 rounded-lg border border-ink-200"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="font-mono text-[13px] uppercase text-ink-700">{color}</span>
              {index === 0 ? (
                <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[11px] font-medium text-ink-500">
                  Main
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => onChange(colors.filter((c) => c !== color))}
                aria-label={`Remove ${color}`}
                className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="color-swatch">
          Pick a colour
        </label>
        <input
          id="color-swatch"
          type="color"
          value={valid ? draft : "#4250e0"}
          onChange={(event) => setDraft(event.target.value)}
          className="size-12 cursor-pointer rounded-xl border border-ink-200 bg-white p-1"
        />
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          placeholder="#4250e0"
          aria-label="Hex colour value"
          aria-invalid={!valid}
          className="h-12 w-36 font-mono uppercase"
        />
        <Button variant="secondary" onClick={add} disabled={!valid}>
          <Plus className="size-4" />
          Add colour
        </Button>
      </div>
      {!valid ? (
        <p className="text-[13px] text-ink-500">Enter a hex value such as #1a2b3c.</p>
      ) : null}
    </div>
  );
}
