import { StepGroup } from "@/components/wizard/StepGroup";
import { DesignGroup } from "@/components/wizard/groups/DesignGroup";
import { InspirationGroup } from "@/components/wizard/groups/InspirationGroup";
import type { StepProps } from "@/components/wizard/steps/types";

export function DesignStep({ errors }: StepProps) {
  return (
    <>
      <StepGroup title="Design direction">
        <DesignGroup />
      </StepGroup>

      <StepGroup
        title="Inspiration & competitors"
        description="Websites you admire and businesses you compete with. Both are optional."
      >
        <InspirationGroup errors={errors} />
      </StepGroup>
    </>
  );
}
