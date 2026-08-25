import { Check, Info } from "lucide-react";
import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { FEATURES, FEATURE_GROUPS } from "@/data/features";
import { useProjectStore } from "@/store/useProjectStore";
import { cn } from "@/utils/cn";

export function FeaturesGroup() {
  const features = useProjectStore((state) => state.project.features);
  const setFeatures = useProjectStore((state) => state.setFeatures);

  const toggle = (value: string) => {
    setFeatures(
      features.includes(value) ? features.filter((f) => f !== value) : [...features, value],
    );
  };

  const hasAdvanced = features.some(
    (value) => FEATURES.find((f) => f.value === value)?.advanced,
  );

  return (
    <div className="space-y-8">
      {FEATURE_GROUPS.map((group) => (
        <QuestionBlock key={group} id={`q-features-${group}`} question={group}>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {FEATURES.filter((feature) => feature.group === group).map((feature) => {
              const selected = features.includes(feature.value);
              return (
                <button
                  key={feature.value}
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  onClick={() => toggle(feature.value)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-150",
                    selected
                      ? "border-cobalt-500 bg-cobalt-50/60 ring-4 ring-cobalt-100"
                      : "border-ink-200 bg-white hover:border-ink-300",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                      selected
                        ? "border-cobalt-600 bg-cobalt-600 text-white"
                        : "border-ink-300 bg-white",
                    )}
                  >
                    {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold text-ink-900">
                      {feature.label}
                      {feature.advanced ? (
                        <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                          Advanced
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-500">
                      {feature.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </QuestionBlock>
      ))}

      {hasAdvanced ? (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Info className="mt-0.5 size-4.5 shrink-0 text-amber-600" aria-hidden="true" />
          <p className="text-[14px] leading-relaxed text-amber-900">
            Some of the features you selected are marked advanced. They may require additional
            integration work during website development - your plan flags them so nobody is
            surprised.
          </p>
        </div>
      ) : null}
    </div>
  );
}
