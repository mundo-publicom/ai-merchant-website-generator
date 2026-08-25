import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "@/store/useToastStore";
import {
  clampStepIndex,
  isStepId,
  LAST_STEP_INDEX,
  stepIndexOf,
  WIZARD_STEPS,
  type StepId,
} from "@/store/wizardSteps";
import { hasErrors, validateStep, type StepErrors } from "@/schemas/projectSchema";
import type { StepProps } from "@/components/wizard/steps/types";

import { BasicsStep } from "@/components/wizard/steps/BasicsStep";
import { MarketStep } from "@/components/wizard/steps/MarketStep";
import { ServicesStep } from "@/components/wizard/steps/ServicesStep";
import { GoalsStep } from "@/components/wizard/steps/GoalsStep";
import { BrandStep } from "@/components/wizard/steps/BrandStep";
import { DesignStep } from "@/components/wizard/steps/DesignStep";
import { FeaturesStep } from "@/components/wizard/steps/FeaturesStep";
import { StructureStep } from "@/components/wizard/steps/StructureStep";
import { ContactStep } from "@/components/wizard/steps/ContactStep";
import { ReviewStep } from "@/components/wizard/steps/ReviewStep";

const STEP_COMPONENTS: Record<StepId, (props: StepProps) => React.ReactElement> = {
  basics: BasicsStep,
  market: MarketStep,
  services: ServicesStep,
  goals: GoalsStep,
  brand: BrandStep,
  design: DesignStep,
  features: FeaturesStep,
  structure: StructureStep,
  contact: ContactStep,
  review: ReviewStep,
};

/**
 * The wizard.
 *
 * The URL is the single source of truth for which step is showing. The store
 * only records where the merchant got to, so a refresh resumes in the right
 * place - it never drives navigation, which is what used to make Back and the
 * progress rail fight each other and appear to reset the form.
 */
export function WizardPage() {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();

  const project = useProjectStore((state) => state.project);
  const setCurrentStep = useProjectStore((state) => state.setCurrentStep);
  const rememberedStep = useProjectStore((state) => state.currentStep);
  const furthestStep = useProjectStore((state) => state.furthestStep);

  const index = isStepId(stepId) ? stepIndexOf(stepId) : -1;
  const step = index >= 0 ? WIZARD_STEPS[index] : undefined;

  /**
   * The step whose answers are being checked as they are typed. A step is only
   * added once Continue has been refused on it, so nobody is shouted at before
   * they have finished answering.
   */
  const [validatedStepId, setValidatedStepId] = useState<StepId | null>(null);
  /** Bumped on every blocked Continue so the scroll-to-error effect re-fires. */
  const [blockedAt, setBlockedAt] = useState(0);

  // Errors are derived, not stored: moving to another step empties them without
  // any resetting, which is what used to make the form look like it had reset.
  const errors: StepErrors = useMemo(
    () => (step && validatedStepId === step.id ? validateStep(step.id, project) : {}),
    [project, step, validatedStepId],
  );

  // Mirror the URL into the store so a refresh resumes on this step.
  useEffect(() => {
    if (index >= 0) setCurrentStep(index);
  }, [index, setCurrentStep]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  // Jump to the first problem only after React has rendered the messages.
  useEffect(() => {
    if (blockedAt === 0) return;
    document
      .querySelector("[data-field-error]")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [blockedAt]);

  const goToIndex = useCallback(
    (target: number) => navigate(`/plan/${WIZARD_STEPS[clampStepIndex(target)].id}`),
    [navigate],
  );

  const handleContinue = useCallback(() => {
    if (!step) return;

    const stepErrors = validateStep(step.id, project);
    setValidatedStepId(step.id);

    if (hasErrors(stepErrors)) {
      setBlockedAt((count) => count + 1);
      const count = Object.keys(stepErrors).length;
      toast.error(count === 1 ? "One answer needs attention" : `${count} answers need attention`, {
        description: "We highlighted what's missing on this step.",
        key: "step-validation",
      });
      return;
    }

    if (index === LAST_STEP_INDEX) {
      navigate("/generating");
      return;
    }
    goToIndex(index + 1);
  }, [goToIndex, index, navigate, project, step]);

  const handleBack = useCallback(() => {
    if (index <= 0) {
      navigate("/");
      return;
    }
    goToIndex(index - 1);
  }, [goToIndex, index, navigate]);

  // An unknown or missing step in the URL falls back to where they left off.
  if (!step) {
    return <Navigate to={`/plan/${WIZARD_STEPS[clampStepIndex(rememberedStep)].id}`} replace />;
  }

  const StepComponent = STEP_COMPONENTS[step.id];
  const isLastStep = index === LAST_STEP_INDEX;

  return (
    <WizardLayout
      stepKey={step.id}
      title={step.title}
      subtitle={step.subtitle}
      steps={WIZARD_STEPS}
      currentIndex={index}
      furthestIndex={Math.max(furthestStep, index)}
      onSelectStep={goToIndex}
      onBack={handleBack}
      onContinue={handleContinue}
      onExit={() => navigate("/")}
      backLabel={index === 0 ? "Home" : "Back"}
      continueLabel={isLastStep ? "Create my website plan" : "Continue"}
      error={hasErrors(errors) ? Object.values(errors)[0] : undefined}
    >
      <StepComponent errors={errors} />
    </WizardLayout>
  );
}
