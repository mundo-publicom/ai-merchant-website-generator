import { StepGroup } from "@/components/wizard/StepGroup";
import { ContactGroup } from "@/components/wizard/groups/ContactGroup";
import { TrustGroup } from "@/components/wizard/groups/TrustGroup";
import type { StepProps } from "@/components/wizard/steps/types";

export function ContactStep({ errors }: StepProps) {
  return (
    <>
      <StepGroup title="Contact & hours">
        <ContactGroup errors={errors} />
      </StepGroup>

      <StepGroup title="Trust & proof">
        <TrustGroup errors={errors} />
      </StepGroup>
    </>
  );
}
