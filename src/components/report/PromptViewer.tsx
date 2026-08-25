import { CopyButton } from "@/components/ui/CopyButton";

export interface PromptViewerProps {
  value: string;
  label: string;
  /** Rough guide for how big the output is. */
  meta?: string;
}

export function PromptViewer({ value, label, meta }: PromptViewerProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-ink-50/70 px-4 py-3">
        <div>
          <p className="text-[14px] font-semibold text-ink-900">{label}</p>
          {meta ? <p className="text-[12px] text-ink-500">{meta}</p> : null}
        </div>
        <CopyButton value={value} label="Copy" copiedLabel="Copied" what={`${label} copied`} />
      </div>
      <pre className="max-h-[32rem] overflow-auto p-4 font-mono text-[12.5px] leading-relaxed text-ink-800 sm:p-5">
        {value}
      </pre>
    </div>
  );
}
