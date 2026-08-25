import { ServicesGroup } from "@/components/wizard/groups/ServicesGroup";
import type { StepProps } from "@/components/wizard/steps/types";

export function ServicesStep({ errors }: StepProps) {
  return <ServicesGroup errors={errors} />;
}
