import { QuestionBlock } from "@/components/wizard/QuestionBlock";
import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { CONTENT_TYPES } from "@/data/options";
import { useProjectStore } from "@/store/useProjectStore";

export function ContentGroup() {
  const content = useProjectStore((state) => state.project.content);
  const patch = useProjectStore((state) => state.patch);

  return (
    <QuestionBlock
      id="q-content"
      question="What content should the website include?"
      help="Pick everything you want covered. The next step turns this into actual pages."
    >
      <ChoiceChips
        options={CONTENT_TYPES}
        value={content.requiredContent}
        onChange={(requiredContent) => patch("content", { requiredContent })}
        allowOther
        otherPlaceholder="Something else to include"
      />
    </QuestionBlock>
  );
}
