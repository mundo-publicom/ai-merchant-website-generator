import { Check } from "lucide-react";
import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { Slider } from "@/components/ui/Slider";
import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { CORNER_OPTIONS, DENSITY_OPTIONS, THEME_OPTIONS } from "@/data/options";
import { DESIGN_STYLES } from "@/data/designStyles";
import { useProjectStore } from "@/store/useProjectStore";
import { cn } from "@/utils/cn";

export function DesignGroup() {
  const design = useProjectStore((state) => state.project.design);
  const patch = useProjectStore((state) => state.patch);
  const update = (value: Partial<typeof design>) => patch("design", value);

  const selectPrimary = (value: string) => {
    if (design.primaryStyle === value) {
      update({ primaryStyle: undefined });
      return;
    }
    update({
      primaryStyle: value,
      secondaryStyle: design.secondaryStyle === value ? undefined : design.secondaryStyle,
    });
  };

  const selectSecondary = (value: string) => {
    update({ secondaryStyle: design.secondaryStyle === value ? undefined : value });
  };

  return (
    <div className="space-y-8">
      <QuestionBlock
        id="q-style"
        question="Pick the style that fits your business"
        help="Tap a card to choose your main direction. You can add a second influence below it."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {DESIGN_STYLES.map((style) => {
            const isPrimary = design.primaryStyle === style.value;
            const isSecondary = design.secondaryStyle === style.value;
            return (
              <div
                key={style.value}
                className={cn(
                  "flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-150",
                  isPrimary
                    ? "border-cobalt-500 ring-4 ring-cobalt-100"
                    : isSecondary
                      ? "border-cobalt-300"
                      : "border-ink-200",
                )}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={isPrimary}
                  onClick={() => selectPrimary(style.value)}
                  className="block w-full flex-1 text-left"
                >
                  <span className="flex h-20 w-full" aria-hidden="true">
                    {style.swatches.map((swatch) => (
                      <span key={swatch} className="flex-1" style={{ backgroundColor: swatch }} />
                    ))}
                  </span>
                  <span className="block bg-white p-4">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[15px] font-semibold text-ink-900">{style.label}</span>
                      {isPrimary ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-cobalt-600 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                          <Check className="size-3" strokeWidth={3} />
                          Primary
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-500">
                      {style.description}
                    </span>
                  </span>
                </button>
                {design.primaryStyle ? (
                  <div className="border-t border-ink-100 bg-ink-50/60 px-4 py-2.5">
                    {isPrimary ? (
                      <p className="text-[12px] font-medium text-cobalt-700">
                        Your main direction
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => selectSecondary(style.value)}
                        className={cn(
                          "text-[12px] font-medium transition-colors",
                          isSecondary ? "text-cobalt-700" : "text-ink-500 hover:text-ink-800",
                        )}
                      >
                        {isSecondary ? "✓ Secondary influence" : "Use as secondary influence"}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </QuestionBlock>

      <QuestionBlock id="q-theme" question="Light or dark?">
        <ChoiceChips
          options={THEME_OPTIONS}
          value={design.theme ? [design.theme] : []}
          onChange={(values) => update({ theme: values[0] })}
          single
        />
      </QuestionBlock>

      <QuestionBlock
        id="q-density"
        question="How much should each screen show?"
        help="Minimal screens feel calmer. Information-rich screens answer more questions without scrolling."
      >
        <ChoiceChips
          options={DENSITY_OPTIONS}
          value={design.density ? [design.density] : []}
          onChange={(values) => update({ density: values[0] })}
          single
        />
      </QuestionBlock>

      <QuestionBlock id="q-corners" question="Corner style">
        <ChoiceChips
          options={CORNER_OPTIONS}
          value={design.cornerStyle ? [design.cornerStyle] : []}
          onChange={(values) => update({ cornerStyle: values[0] })}
          single
        />
      </QuestionBlock>

      <QuestionBlock id="q-energy" question="Overall visual energy">
        <Slider
          id="design-energy"
          ariaLabel="Visual energy"
          value={design.energy}
          onChange={(energy) => update({ energy })}
          minLabel="Calm"
          maxLabel="Energetic"
        />
      </QuestionBlock>
    </div>
  );
}
