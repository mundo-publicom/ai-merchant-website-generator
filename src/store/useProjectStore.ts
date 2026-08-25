import { create } from "zustand";
import type {
  Competitor,
  HomepageSection,
  InspirationSite,
  MerchantWebsiteProject,
  Service,
  Testimonial,
  WebsitePage,
  WebsiteProjectType,
  WeekDay,
} from "@/types/project";
import { createEmptyProject } from "@/data/emptyProject";
import { demoProject } from "@/data/demoProject";
import {
  clearPersistedState,
  loadPersistedState,
  savePersistedState,
} from "@/utils/storage";
import { recommendHomepageSections, recommendPages } from "@/services/recommendations";
import { clampStepIndex, LAST_STEP_INDEX } from "@/store/wizardSteps";
import { toast } from "@/store/useToastStore";
import { createId } from "@/utils/id";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/** Project keys whose value is a plain object, so they can be shallow-merged. */
type ObjectSection =
  | "existingWebsite"
  | "business"
  | "location"
  | "audience"
  | "goals"
  | "branding"
  | "design"
  | "content"
  | "contact"
  | "businessHours"
  | "trust"
  | "assets"
  | "seo";

interface ProjectStore {
  project: MerchantWebsiteProject;
  /** Mirrors the step in the URL; the URL stays the source of truth. */
  currentStep: number;
  /** Highest step reached, so completed steps stay clickable in the rail. */
  furthestStep: number;
  saveStatus: SaveStatus;
  hydrated: boolean;
  hasSavedProject: boolean;

  hydrate: () => void;

  patch: <K extends ObjectSection>(
    key: K,
    value: Partial<MerchantWebsiteProject[K]>,
  ) => void;
  setProjectType: (type: WebsiteProjectType) => void;

  addService: (service?: Partial<Service>) => void;
  updateService: (id: string, patch: Partial<Service>) => void;
  removeService: (id: string) => void;
  moveService: (id: string, direction: -1 | 1) => void;
  setPrimaryService: (id: string) => void;

  addInspiration: () => void;
  updateInspiration: (id: string, patch: Partial<InspirationSite>) => void;
  removeInspiration: (id: string) => void;

  addCompetitor: () => void;
  updateCompetitor: (id: string, patch: Partial<Competitor>) => void;
  removeCompetitor: (id: string) => void;

  addTestimonial: () => void;
  updateTestimonial: (id: string, patch: Partial<Testimonial>) => void;
  removeTestimonial: (id: string) => void;

  setFeatures: (features: string[]) => void;

  addPage: (title?: string) => void;
  updatePage: (id: string, patch: Partial<WebsitePage>) => void;
  removePage: (id: string) => void;
  movePage: (id: string, direction: -1 | 1) => void;

  toggleSection: (id: string) => void;
  moveSectionItem: (id: string, direction: -1 | 1) => void;
  setHomepageSections: (sections: HomepageSection[]) => void;

  setHours: (day: WeekDay, patch: Partial<MerchantWebsiteProject["businessHours"]["days"][WeekDay]>) => void;
  setOpen24: (open24: boolean) => void;
  copyWeekdayHours: () => void;

  /** Rebuild pages + homepage sections from the current answers. */
  refreshStructure: (force?: boolean) => void;

  /** Records the step the router landed on. Never navigates by itself. */
  setCurrentStep: (index: number) => void;

  resetProject: () => void;
  loadDemoProject: () => void;
}

let saveTimer: ReturnType<typeof setTimeout> | undefined;

function cancelPendingSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = undefined;
}

function writeNow(get: () => ProjectStore, set: (partial: Partial<ProjectStore>) => void) {
  const { project, currentStep, furthestStep, saveStatus } = get();
  const ok = savePersistedState({ project, currentStep, furthestStep });

  // Storage failures are silent by nature, so say it out loud - once, not on
  // every keystroke that follows.
  if (!ok && saveStatus !== "error") {
    toast.error("Your progress isn't being saved", {
      description:
        "This browser's storage is full or blocked. Your answers stay on screen, but they will be lost if you close the tab.",
      key: "storage-error",
      duration: 0,
    });
  }

  set({ saveStatus: ok ? "saved" : "error", hasSavedProject: ok });
}

/** Field edits are debounced; step changes are written immediately so a refresh resumes exactly. */
function persist(
  get: () => ProjectStore,
  set: (partial: Partial<ProjectStore>) => void,
  immediate = false,
) {
  cancelPendingSave();
  if (immediate) {
    writeNow(get, set);
    return;
  }
  set({ saveStatus: "saving" });
  saveTimer = setTimeout(() => writeNow(get, set), 400);
}

export const useProjectStore = create<ProjectStore>((set, get) => {
  /** Apply a mutation to the project, stamp updatedAt, and schedule a save. */
  const mutate = (recipe: (draft: MerchantWebsiteProject) => MerchantWebsiteProject) => {
    set((state) => ({
      project: { ...recipe(state.project), updatedAt: new Date().toISOString() },
    }));
    persist(get, set);
  };

  return {
    project: createEmptyProject(),
    currentStep: 0,
    furthestStep: 0,
    saveStatus: "idle",
    hydrated: false,
    hasSavedProject: false,

    hydrate: () => {
      if (get().hydrated) return;
      const restored = loadPersistedState();
      if (!restored) {
        set({ hydrated: true });
        return;
      }

      set({
        project: restored.project,
        currentStep: restored.currentStep,
        furthestStep: restored.furthestStep,
        hydrated: true,
        hasSavedProject: true,
        saveStatus: "saved",
      });

      if (restored.migrated) {
        toast.info("We shortened the questionnaire", {
          description:
            "Your saved answers were kept. The same questions are now grouped into ten steps instead of eighteen.",
          duration: 7000,
        });
      }
    },

    patch: (key, value) =>
      mutate(
        (project) =>
          ({
            ...project,
            [key]: { ...project[key], ...value },
          }) as MerchantWebsiteProject,
      ),

    setProjectType: (type) =>
      mutate((project) => ({ ...project, websiteProjectType: type })),

    addService: (service) =>
      mutate((project) => {
        const next: Service = {
          id: createId("svc"),
          name: service?.name ?? "",
          description: service?.description ?? "",
          price: service?.price ?? "",
          priority: service?.priority ?? (project.services.length === 0 ? "primary" : "secondary"),
        };
        const services = [...project.services, next];
        return {
          ...project,
          services,
          primaryServiceId: project.primaryServiceId ?? next.id,
        };
      }),

    updateService: (id, patch) =>
      mutate((project) => ({
        ...project,
        services: project.services.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      })),

    removeService: (id) =>
      mutate((project) => {
        const services = project.services.filter((s) => s.id !== id);
        return {
          ...project,
          services,
          primaryServiceId:
            project.primaryServiceId === id ? services[0]?.id : project.primaryServiceId,
        };
      }),

    moveService: (id, direction) =>
      mutate((project) => ({ ...project, services: move(project.services, id, direction) })),

    setPrimaryService: (id) =>
      mutate((project) => ({
        ...project,
        primaryServiceId: id,
        services: project.services.map((s) => ({
          ...s,
          priority: s.id === id ? "primary" : s.priority === "primary" ? "secondary" : s.priority,
        })),
      })),

    addInspiration: () =>
      mutate((project) => ({
        ...project,
        inspirationSites: [
          ...project.inspirationSites,
          { id: createId("insp"), url: "", notes: "" },
        ],
      })),

    updateInspiration: (id, patch) =>
      mutate((project) => ({
        ...project,
        inspirationSites: project.inspirationSites.map((i) =>
          i.id === id ? { ...i, ...patch } : i,
        ),
      })),

    removeInspiration: (id) =>
      mutate((project) => ({
        ...project,
        inspirationSites: project.inspirationSites.filter((i) => i.id !== id),
      })),

    addCompetitor: () =>
      mutate((project) => ({
        ...project,
        competitors: [
          ...project.competitors,
          { id: createId("comp"), name: "", url: "", notes: "" },
        ],
      })),

    updateCompetitor: (id, patch) =>
      mutate((project) => ({
        ...project,
        competitors: project.competitors.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      })),

    removeCompetitor: (id) =>
      mutate((project) => ({
        ...project,
        competitors: project.competitors.filter((c) => c.id !== id),
      })),

    addTestimonial: () =>
      mutate((project) => ({
        ...project,
        trust: {
          ...project.trust,
          testimonials: [
            ...project.trust.testimonials,
            { id: createId("tst"), author: "", quote: "", rating: 5, source: "" },
          ],
        },
      })),

    updateTestimonial: (id, patch) =>
      mutate((project) => ({
        ...project,
        trust: {
          ...project.trust,
          testimonials: project.trust.testimonials.map((t) =>
            t.id === id ? { ...t, ...patch } : t,
          ),
        },
      })),

    removeTestimonial: (id) =>
      mutate((project) => ({
        ...project,
        trust: {
          ...project.trust,
          testimonials: project.trust.testimonials.filter((t) => t.id !== id),
        },
      })),

    setFeatures: (features) => mutate((project) => ({ ...project, features })),

    addPage: (title) =>
      mutate((project) => ({
        ...project,
        content: {
          ...project.content,
          structureTouched: true,
          pages: [
            ...project.content.pages,
            { id: createId("page"), title: title ?? "New page", purpose: "" },
          ],
        },
      })),

    updatePage: (id, patch) =>
      mutate((project) => ({
        ...project,
        content: {
          ...project.content,
          structureTouched: true,
          pages: project.content.pages.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        },
      })),

    removePage: (id) =>
      mutate((project) => ({
        ...project,
        content: {
          ...project.content,
          structureTouched: true,
          pages: project.content.pages
            .filter((p) => p.id !== id)
            .map((p) => ({
              ...p,
              children: p.children?.filter((child) => child.id !== id),
            })),
        },
      })),

    movePage: (id, direction) =>
      mutate((project) => ({
        ...project,
        content: {
          ...project.content,
          structureTouched: true,
          pages: move(project.content.pages, id, direction),
        },
      })),

    toggleSection: (id) =>
      mutate((project) => ({
        ...project,
        content: {
          ...project.content,
          structureTouched: true,
          homepageSections: project.content.homepageSections.map((s) =>
            s.id === id ? { ...s, enabled: !s.enabled } : s,
          ),
        },
      })),

    moveSectionItem: (id, direction) =>
      mutate((project) => ({
        ...project,
        content: {
          ...project.content,
          structureTouched: true,
          homepageSections: move(project.content.homepageSections, id, direction),
        },
      })),

    setHomepageSections: (sections) =>
      mutate((project) => ({
        ...project,
        content: { ...project.content, structureTouched: true, homepageSections: sections },
      })),

    setHours: (day, patch) =>
      mutate((project) => ({
        ...project,
        businessHours: {
          ...project.businessHours,
          days: {
            ...project.businessHours.days,
            [day]: { ...project.businessHours.days[day], ...patch },
          },
        },
      })),

    setOpen24: (open24) =>
      mutate((project) => ({
        ...project,
        businessHours: { ...project.businessHours, open24 },
      })),

    copyWeekdayHours: () =>
      mutate((project) => {
        const monday = project.businessHours.days.monday;
        const days = { ...project.businessHours.days };
        for (const day of ["tuesday", "wednesday", "thursday", "friday"] as WeekDay[]) {
          days[day] = { ...monday };
        }
        return { ...project, businessHours: { ...project.businessHours, days } };
      }),

    refreshStructure: (force = false) => {
      // Hand-edited structure is never overwritten unless the merchant asks.
      if (get().project.content.structureTouched && !force) return;
      mutate((project) => ({
        ...project,
        content: {
          ...project.content,
          structureTouched: false,
          pages: recommendPages(project),
          homepageSections: recommendHomepageSections(project),
        },
      }));
    },

    setCurrentStep: (index) => {
      const next = clampStepIndex(index);
      const { currentStep, furthestStep } = get();
      if (next === currentStep && next <= furthestStep) return;
      set({ currentStep: next, furthestStep: Math.max(furthestStep, next) });
      persist(get, set, true);
    },

    resetProject: () => {
      cancelPendingSave();
      clearPersistedState();
      set({
        project: createEmptyProject(),
        currentStep: 0,
        furthestStep: 0,
        saveStatus: "idle",
        hasSavedProject: false,
      });
    },

    loadDemoProject: () => {
      // Drop any debounced write first, or it would land after the demo and
      // overwrite it with the project the merchant just replaced.
      cancelPendingSave();
      const project = demoProject();
      set({ project, currentStep: LAST_STEP_INDEX, furthestStep: LAST_STEP_INDEX });
      writeNow(get, set);
    },
  };
});

function move<T extends { id: string }>(items: T[], id: string, direction: -1 | 1): T[] {
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return items;
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}
