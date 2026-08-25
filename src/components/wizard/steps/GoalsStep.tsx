import { StepGroup } from "@/components/wizard/StepGroup";
import { GoalsGroup } from "@/components/wizard/groups/GoalsGroup";
import { CtaGroup } from "@/components/wizard/groups/CtaGroup";
import { SeoGroup } from "@/components/wizard/groups/SeoGroup";
import type { StepProps } from "@/components/wizard/steps/types";

export function GoalsStep({ errors }: StepProps) {
  return (
    <>
      <StepGroup title="What the website is for">
        <GoalsGroup errors={errors} />
      </StepGroup>

      <StepGroup title="The action visitors take">
        <CtaGroup errors={errors} />
      </StepGroup>

      <StepGroup title="Getting found" description="Plain language, no SEO jargon required.">
        <SeoGroup />
      </StepGroup>
    </>
  );
}
