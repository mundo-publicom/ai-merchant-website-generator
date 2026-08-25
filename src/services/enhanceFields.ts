/**
 * Catalogue of the answers that the AI enhancement endpoint can improve.
 *
 * Shared by the browser (which sends `field`) and the dev-server endpoint
 * (which turns `field` into the model's instructions), so the two can never
 * drift apart. Keep this module free of browser and Node APIs.
 */
export type EnhanceField =
  | "business-description"
  | "existing-likes"
  | "existing-dislikes"
  | "existing-preserve"
  | "service-description"
  | "audience-description"
  | "audience-problems"
  | "inspiration-notes"
  | "competitor-notes"
  | "trust-details"
  | "testimonial-quote";

export interface EnhanceFieldSpec {
  /** What the merchant was asked. */
  label: string;
  /** How the answer is used downstream, so the model knows what to optimise for. */
  purpose: string;
  /** Length ceiling, enforced by instruction rather than by token limit. */
  maxSentences: number;
  /**
   * "rewrite" improves the merchant's own answer.
   * "tidy" only fixes spelling and punctuation - used where changing the
   * meaning would misrepresent someone else's words.
   */
  mode: "rewrite" | "tidy";
  /** Button copy, so a "tidy" action never claims to be doing more than it is. */
  actionLabel: string;
}

export const ENHANCE_FIELDS: Record<EnhanceField, EnhanceFieldSpec> = {
  "business-description": {
    label: "Describe your business in a few sentences",
    purpose:
      "It becomes the foundation of the homepage copy, the About page and the whole website brief. It should say what the business does, who it serves, where, and what makes it different - concretely.",
    maxSentences: 4,
    mode: "rewrite",
    actionLabel: "Enhance",
  },
  "existing-likes": {
    label: "What do you like about your current website?",
    purpose:
      "It tells the website builder what to carry over from the existing site.",
    maxSentences: 3,
    mode: "rewrite",
    actionLabel: "Enhance",
  },
  "existing-dislikes": {
    label: "What do you dislike about your current website?",
    purpose:
      "It tells the website builder what must change. Specific problems are far more useful than general dissatisfaction.",
    maxSentences: 3,
    mode: "rewrite",
    actionLabel: "Enhance",
  },
  "existing-preserve": {
    label: "What should we preserve from the current site?",
    purpose:
      "It becomes a migration checklist - assets, content and pages that must survive the redesign.",
    maxSentences: 3,
    mode: "rewrite",
    actionLabel: "Enhance",
  },
  "service-description": {
    label: "Service description",
    purpose:
      "It becomes the service card on the homepage and the opening paragraph of that service's own page. It should say what the service covers and who it is for.",
    maxSentences: 2,
    mode: "rewrite",
    actionLabel: "Enhance",
  },
  "audience-description": {
    label: "Who are your ideal customers?",
    purpose:
      "It decides who every page is written for. Concrete customer types beat demographics.",
    maxSentences: 3,
    mode: "rewrite",
    actionLabel: "Enhance",
  },
  "audience-problems": {
    label: "What problem are customers trying to solve when they contact you?",
    purpose:
      "It becomes the opening line of the homepage, so it should be in the customer's own words and describe their situation, not the service.",
    maxSentences: 2,
    mode: "rewrite",
    actionLabel: "Enhance",
  },
  "inspiration-notes": {
    label: "What do you like about this website?",
    purpose:
      "It becomes design direction, so it should name the specific thing that works - layout, imagery, tone, navigation - rather than saying it looks nice.",
    maxSentences: 2,
    mode: "rewrite",
    actionLabel: "Enhance",
  },
  "competitor-notes": {
    label: "Notes about this competitor",
    purpose:
      "It is used to position the business against this competitor, so it should name a concrete strength or weakness.",
    maxSentences: 2,
    mode: "rewrite",
    actionLabel: "Enhance",
  },
  "trust-details": {
    label: "Credentials and proof",
    purpose:
      "It is quoted on the site where credibility matters, so it should be a tight list of verifiable specifics.",
    maxSentences: 3,
    mode: "rewrite",
    actionLabel: "Enhance",
  },
  "testimonial-quote": {
    label: "Customer testimonial",
    purpose:
      "It is published as a real customer's words. Only spelling, punctuation and capitalisation may change.",
    maxSentences: 4,
    mode: "tidy",
    actionLabel: "Tidy up",
  },
};

export function isEnhanceField(value: unknown): value is EnhanceField {
  return typeof value === "string" && value in ENHANCE_FIELDS;
}

/** Trimmed slice of the project sent as grounding context. Never the whole project. */
export interface EnhanceContext {
  businessName?: string;
  industry?: string;
  location?: string;
  serviceAreas?: string[];
  services?: string[];
  audience?: string;
  primaryCTA?: string;
  brandPersonality?: string[];
}

export const MAX_INPUT_CHARS = 4000;
