import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { Chip } from "@/components/ui/Chip";
import { WEBSITE_GOALS, labelFor } from "@/data/options";
import { useProjectStore } from "@/store/useProjectStore";
import type { GroupProps } from "@/components/wizard/groups/types";

export function GoalsGroup({ errors }: GroupProps) {
  const goals = useProjectStore((state) => state.project.goals);
  const patch = useProjectStore((state) => state.patch);
  const update = (value: Partial<typeof goals>) => patch("goals", value);

  const setGoals = (next: string[]) => {
    update({
      goals: next,
      primaryGoal: goals.primaryGoal && next.includes(goals.primaryGoal)
        ? goals.primaryGoal
        : undefined,
    });
  };

  return (
    <div className="space-y-8">
      <QuestionBlock
        id="q-goals"
        question="What should your website help you accomplish?"
        help="Choose everything that applies."
        error={errors.goals}
      >
        <ChoiceChips
          options={WEBSITE_GOALS}
          value={goals.goals}
          onChange={setGoals}
          allowOther
          otherPlaceholder="Another goal"
        />
      </QuestionBlock>

      {goals.goals.length > 0 ? (
        <QuestionBlock
          id="q-primary-goal"
          question="Which one matters most?"
          help="Everything on your website will be arranged around this single goal."
          error={errors.primaryGoal}
        >
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="q-primary-goal">
            {goals.goals.map((goal) => (
              <Chip
                key={goal}
                label={labelFor(goal)}
                selected={goals.primaryGoal === goal}
                onToggle={() =>
                  update({ primaryGoal: goals.primaryGoal === goal ? undefined : goal })
                }
              />
            ))}
          </div>
        </QuestionBlock>
      ) : null}
    </div>
  );
}
