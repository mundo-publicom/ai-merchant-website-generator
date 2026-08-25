import type { MerchantWebsiteProject } from "@/types/project";
import { createEmptyProject } from "@/data/emptyProject";
import { clampStepIndex, LAST_STEP_INDEX } from "@/store/wizardSteps";

export const STORAGE_KEY = "merchantWebsiteProject";

/** Bumped when the wizard's step layout changes. `project` shape is unchanged. */
const VERSION = 2;

export interface PersistedState {
  version: number;
  currentStep: number;
  furthestStep: number;
  project: MerchantWebsiteProject;
  updatedAt: string;
}

export interface RestoredState {
  currentStep: number;
  furthestStep: number;
  project: MerchantWebsiteProject;
  /** True when the saved plan came from the older, longer wizard. */
  migrated: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Merges a saved value onto a default: plain objects are merged key by key,
 * arrays and primitives are replaced wholesale. Keys the default does not know
 * about are carried through, because optional project fields such as
 * `primaryServiceId` never appear on an empty project.
 */
function deepMerge<T>(base: T, saved: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(saved) ? saved : base) as T;

  if (isRecord(base)) {
    if (!isRecord(saved)) return base;
    const merged: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(saved)) {
      merged[key] = key in base ? deepMerge(base[key as keyof T], value) : value;
    }
    return merged as T;
  }

  return (saved === undefined ? base : saved) as T;
}

/**
 * Rebuilds a project on top of a fresh empty one.
 *
 * A saved plan can predate any field added since it was written, so every
 * nested section is merged rather than replaced - otherwise a missing
 * `contact.social` or `businessHours.days` crashes the step that reads it.
 */
export function reviveProject(saved: unknown): MerchantWebsiteProject {
  const project = deepMerge(createEmptyProject(), saved);

  // The few fields whose type the rest of the app relies on, normalised in case
  // an old or hand-edited payload holds something else.
  project.websiteProjectType =
    project.websiteProjectType === "new" || project.websiteProjectType === "redesign"
      ? project.websiteProjectType
      : null;
  project.content.structureTouched = project.content.structureTouched === true;
  project.businessHours.open24 = project.businessHours.open24 === true;

  return project;
}

export function loadPersistedState(): RestoredState | null {
  if (typeof window === "undefined") return null;

  let parsed: unknown;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(parsed) || !isRecord(parsed.project)) return null;
  if (parsed.version !== 1 && parsed.version !== VERSION) return null;

  const project = reviveProject(parsed.project);

  // Step indices from v1 pointed into an eighteen-step wizard, so they cannot be
  // carried across. The answers are kept and every step stays reachable.
  if (parsed.version === 1) {
    return { project, currentStep: 0, furthestStep: LAST_STEP_INDEX, migrated: true };
  }

  const currentStep = clampStepIndex(Number(parsed.currentStep));
  return {
    project,
    currentStep,
    furthestStep: Math.max(currentStep, clampStepIndex(Number(parsed.furthestStep))),
    migrated: false,
  };
}

export function savePersistedState(state: {
  currentStep: number;
  furthestStep: number;
  project: MerchantWebsiteProject;
}): boolean {
  if (typeof window === "undefined") return false;
  try {
    const payload: PersistedState = {
      version: VERSION,
      currentStep: state.currentStep,
      furthestStep: state.furthestStep,
      project: state.project,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    // Quota exceeded (usually from a large logo preview) - progress is not saved.
    return false;
  }
}

export function clearPersistedState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Storage disabled entirely - nothing to clear. */
  }
}
