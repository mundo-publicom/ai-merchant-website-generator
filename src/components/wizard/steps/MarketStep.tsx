import { StepGroup } from "@/components/wizard/StepGroup";
import { LocationGroup } from "@/components/wizard/groups/LocationGroup";
import { AudienceGroup } from "@/components/wizard/groups/AudienceGroup";
import type { StepProps } from "@/components/wizard/steps/types";

export function MarketStep({ errors }: StepProps) {
  return (
    <>
      <StepGroup
        title="Location & service area"
        description="Location shapes your pages, your map, and how customers find you locally."
      >
        <LocationGroup errors={errors} />
      </StepGroup>

      <StepGroup
        title="Your customers"
        description="The website should speak to these people specifically, not to everyone."
      >
        <AudienceGroup />
      </StepGroup>
    </>
  );
}
