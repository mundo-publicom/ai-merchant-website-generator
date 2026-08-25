import type { StepErrors } from "@/schemas/projectSchema";

/**
 * One topic inside a wizard step. Groups read and write the store directly and
 * only receive the errors for the step they are rendered on.
 */
export interface GroupProps {
  errors: StepErrors;
}
