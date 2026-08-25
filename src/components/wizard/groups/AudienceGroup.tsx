import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { EnhanceableTextarea } from "@/components/forms/EnhanceableTextarea";
import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { OptionCard } from "@/components/ui/OptionCard";
import { CUSTOMER_TYPES, DECISION_FACTORS, GEOGRAPHIC_REACH } from "@/data/options";
import { useProjectStore } from "@/store/useProjectStore";

export function AudienceGroup() {
  const audience = useProjectStore((state) => state.project.audience);
  const patch = useProjectStore((state) => state.patch);
  const update = (value: Partial<typeof audience>) => patch("audience", value);

  return (
    <div className="space-y-8">
      <QuestionBlock
        id="q-audience"
        question="Who are your ideal customers?"
        help="Homeowners, tourists, local businesses, families, property managers, professionals - describe them the way you'd describe them to a friend."
      >
        <EnhanceableTextarea
          field="audience-description"
          value={audience.description ?? ""}
          onChange={(description) => update({ description })}
          placeholder="Homeowners and renters across Miami-Dade, plus property managers who need a locksmith they can call again and again."
          aria-labelledby="q-audience"
        />
      </QuestionBlock>

      <QuestionBlock id="q-customer-type" question="Who do you sell to?">
        <ChoiceChips
          options={CUSTOMER_TYPES}
          value={audience.customerType}
          onChange={(customerType) => update({ customerType })}
          single
        />
      </QuestionBlock>

      <QuestionBlock id="q-reach" question="Where are your typical customers?">
        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-labelledby="q-reach">
          {GEOGRAPHIC_REACH.map((option) => (
            <OptionCard
              key={option.value}
              title={option.label}
              description={option.description}
              selected={audience.geographicReach === option.value}
              onSelect={() =>
                update({
                  geographicReach:
                    audience.geographicReach === option.value ? undefined : option.value,
                })
              }
              className="p-4"
            />
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock
        id="q-problems"
        question="What problem are customers trying to solve when they contact you?"
        help="We use this to write the opening line of your homepage."
      >
        <EnhanceableTextarea
          field="audience-problems"
          value={audience.customerProblems ?? ""}
          onChange={(customerProblems) => update({ customerProblems })}
          placeholder="They're locked out right now and stressed, or they just moved in and don't trust the old locks."
          aria-labelledby="q-problems"
        />
      </QuestionBlock>

      <QuestionBlock
        id="q-factors"
        question="What matters most to customers choosing your business?"
        help="These become the points your website argues, so pick the ones that are genuinely true for you."
      >
        <ChoiceChips
          options={DECISION_FACTORS}
          value={audience.decisionFactors}
          onChange={(decisionFactors) => update({ decisionFactors })}
          allowOther
          otherPlaceholder="Something else that matters"
        />
      </QuestionBlock>
    </div>
  );
}
