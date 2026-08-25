import { StepGroup } from "@/components/wizard/StepGroup";
import { WebsiteTypeGroup } from "@/components/wizard/groups/WebsiteTypeGroup";
import { ExistingWebsiteGroup } from "@/components/wizard/groups/ExistingWebsiteGroup";
import { BusinessGroup } from "@/components/wizard/groups/BusinessGroup";
import { useProjectStore } from "@/store/useProjectStore";
import type { StepProps } from "@/components/wizard/steps/types";

export function BasicsStep({ errors }: StepProps) {
  const isRedesign = useProjectStore((state) => state.project.websiteProjectType === "redesign");

  return (
    <>
      <StepGroup
        title="Your project"
        description="This changes the questions we ask and how we write your final plan."
      >
        <WebsiteTypeGroup errors={errors} />
      </StepGroup>

      {isRedesign ? (
        <StepGroup
          title="Your current website"
          description="Knowing what works and what doesn't keeps the good parts and fixes the rest."
        >
          <ExistingWebsiteGroup errors={errors} />
        </StepGroup>
      ) : null}

      <StepGroup title="Business basics">
        <BusinessGroup errors={errors} />
      </StepGroup>
    </>
  );
}
