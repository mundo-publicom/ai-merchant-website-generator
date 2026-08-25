import { StepGroup } from "@/components/wizard/StepGroup";
import { ContentGroup } from "@/components/wizard/groups/ContentGroup";
import { FeaturesGroup } from "@/components/wizard/groups/FeaturesGroup";

export function FeaturesStep() {
  return (
    <>
      <StepGroup title="Content">
        <ContentGroup />
      </StepGroup>

      <StepGroup
        title="Functionality"
        description="Not content - the things visitors actually interact with."
      >
        <FeaturesGroup />
      </StepGroup>
    </>
  );
}
