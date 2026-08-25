import { create } from "zustand";
import { createId } from "@/utils/id";

export type ToastTone = "success" | "error" | "warning" | "info";

export interface ToastRecord {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  /** Milliseconds on screen. `0` keeps the toast until it is dismissed by hand. */
  duration: number;
  /** Identity used to refresh an existing toast instead of stacking a duplicate. */
  dedupeKey: string;
}

export interface ToastOptions {
  description?: string;
  duration?: number;
  /** Overrides the default `tone:title` de-duplication key. */
  key?: string;
}

interface ToastStore {
  toasts: ToastRecord[];
  push: (tone: ToastTone, title: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

/** Older toasts are dropped rather than allowed to bury the page. */
const MAX_VISIBLE = 3;

const DEFAULT_DURATION: Record<ToastTone, number> = {
  success: 3200,
  info: 4000,
  warning: 5000,
  error: 6500,
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  push: (tone, title, options = {}) => {
    const dedupeKey = options.key ?? `${tone}:${title}`;
    const next: ToastRecord = {
      id: createId("toast"),
      tone,
      title,
      description: options.description,
      duration: options.duration ?? DEFAULT_DURATION[tone],
      dedupeKey,
    };

    set((state) => ({
      toasts: [...state.toasts.filter((t) => t.dedupeKey !== dedupeKey), next].slice(-MAX_VISIBLE),
    }));

    return next.id;
  },

  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  clear: () => set({ toasts: [] }),
}));

/**
 * Imperative entry point so services, the store and event handlers can raise a
 * toast without being React components.
 */
export const toast = {
  success: (title: string, options?: ToastOptions) =>
    useToastStore.getState().push("success", title, options),
  error: (title: string, options?: ToastOptions) =>
    useToastStore.getState().push("error", title, options),
  warning: (title: string, options?: ToastOptions) =>
    useToastStore.getState().push("warning", title, options),
  info: (title: string, options?: ToastOptions) =>
    useToastStore.getState().push("info", title, options),
  dismiss: (id: string) => useToastStore.getState().dismiss(id),
  clear: () => useToastStore.getState().clear(),
};
