import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { OptionCard } from "@/components/ui/OptionCard";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { CTA_BY_VALUE, CTA_OPTIONS } from "@/data/options";
import { useProjectStore } from "@/store/useProjectStore";
import type { GroupProps } from "@/components/wizard/groups/types";

export function CtaGroup({ errors }: GroupProps) {
  const goals = useProjectStore((state) => state.project.goals);
  const patch = useProjectStore((state) => state.patch);
  const update = (value: Partial<typeof goals>) => patch("goals", value);

  const selected = goals.primaryCTA ? CTA_BY_VALUE.get(goals.primaryCTA) : undefined;

  return (
    <div className="space-y-8">
      <QuestionBlock
        id="q-cta"
        question="What action do you want visitors to take most often?"
        help="This becomes the button we repeat across the entire website."
        error={errors.primaryCTA}
      >
        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-labelledby="q-cta">
          {CTA_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              title={option.label}
              description={`Button reads "${option.buttonLabel}"`}
              selected={goals.primaryCTA === option.value}
              onSelect={() =>
                update({
                  primaryCTA: option.value,
                  primaryCTADestination:
                    goals.primaryCTA === option.value ? goals.primaryCTADestination : "",
                  secondaryCTA:
                    goals.secondaryCTA === option.value ? undefined : goals.secondaryCTA,
                })
              }
              className="p-4"
            />
          ))}
        </div>
      </QuestionBlock>

      {selected?.destinationLabel ? (
        <Field
          label={selected.destinationLabel}
          htmlFor="cta-destination"
          error={errors.primaryCTADestination}
        >
          <Input
            id="cta-destination"
            value={goals.primaryCTADestination ?? ""}
            onChange={(event) => update({ primaryCTADestination: event.target.value })}
            placeholder={selected.destinationPlaceholder}
            inputMode={selected.destinationField === "phone" ? "tel" : "text"}
            aria-invalid={Boolean(errors.primaryCTADestination)}
          />
        </Field>
      ) : null}

      {goals.primaryCTA ? (
        <QuestionBlock
          id="q-secondary-cta"
          question="And a backup action, for visitors who aren't ready yet?"
          help="Optional. This becomes the quieter second button next to your main one."
        >
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="q-secondary-cta">
            {CTA_OPTIONS.filter((option) => option.value !== goals.primaryCTA).map((option) => (
              <Chip
                key={option.value}
                label={option.buttonLabel}
                selected={goals.secondaryCTA === option.value}
                onToggle={() =>
                  update({
                    secondaryCTA: goals.secondaryCTA === option.value ? undefined : option.value,
                  })
                }
              />
            ))}
          </div>
        </QuestionBlock>
      ) : null}
    </div>
  );
}
