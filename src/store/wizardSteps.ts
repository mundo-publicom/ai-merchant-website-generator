/**
 * The wizard is deliberately short: ten screens, each one a coherent topic a
 * merchant can answer in one sitting. Related questions that used to live on
 * their own screens are now grouped inside a step (see `StepGroup`).
 */
export type StepId =
  | "basics"
  | "market"
  | "services"
  | "goals"
  | "brand"
  | "design"
  | "features"
  | "structure"
  | "contact"
  | "review";

export interface WizardStep {
  id: StepId;
  /** Short label for the progress rail and the review screen. */
  label: string;
  title: string;
  subtitle?: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: "basics",
    label: "Business",
    title: "Let's start with your business",
    subtitle: "This becomes the foundation of every page we plan for you.",
  },
  {
    id: "market",
    label: "Market",
    title: "Where you work and who you serve",
    subtitle: "Location and audience decide which pages you need and how they're written.",
  },
  {
    id: "services",
    label: "Offering",
    title: "What do you sell or provide?",
    subtitle: "Each item can become its own page, so add the ones worth being found for.",
  },
  {
    id: "goals",
    label: "Goals",
    title: "Your goals, and how customers reach you",
    subtitle: "The outcome you want, the button that delivers it, and how people find you.",
  },
  {
    id: "brand",
    label: "Brand",
    title: "Let's understand your brand",
    subtitle: "Even rough answers here give your website a consistent look.",
  },
  {
    id: "design",
    label: "Design",
    title: "How should your website feel?",
    subtitle: "Pick a direction, then show us anything you want us to look at.",
  },
  {
    id: "features",
    label: "Features",
    title: "What should your website include and do?",
    subtitle: "Content is what visitors read; features are what they interact with.",
  },
  {
    id: "structure",
    label: "Structure",
    title: "Here's the website structure we recommend",
    subtitle: "Built from your answers. Add, rename, reorder or remove anything.",
  },
  {
    id: "contact",
    label: "Contact",
    title: "Reaching you, and trusting you",
    subtitle: "Contact details, opening hours and the proof that wins customers over.",
  },
  {
    id: "review",
    label: "Review",
    title: "Review your answers",
    subtitle: "Check anything you want to change before we build your plan.",
  },
];

export const STEP_IDS = WIZARD_STEPS.map((step) => step.id);

export const LAST_STEP_INDEX = WIZARD_STEPS.length - 1;

export function isStepId(value: string | undefined): value is StepId {
  return value !== undefined && (STEP_IDS as string[]).includes(value);
}

export function stepIndexOf(id: StepId | undefined): number {
  return WIZARD_STEPS.findIndex((step) => step.id === id);
}

/** Guards every index that comes from storage, a URL or a saved plan. */
export function clampStepIndex(index: number): number {
  if (!Number.isFinite(index)) return 0;
  return Math.max(0, Math.min(Math.trunc(index), LAST_STEP_INDEX));
}

export function stepAt(index: number): WizardStep {
  return WIZARD_STEPS[clampStepIndex(index)];
}
