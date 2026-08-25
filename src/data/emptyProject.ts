import type { BusinessHours, MerchantWebsiteProject, WeekDay } from "@/types/project";
import { createId } from "@/utils/id";

const WEEKDAY_KEYS: WeekDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function createEmptyHours(): BusinessHours {
  const days = {} as BusinessHours["days"];
  for (const key of WEEKDAY_KEYS) {
    const weekend = key === "saturday" || key === "sunday";
    days[key] = { closed: weekend, open: "09:00", close: "17:00" };
  }
  return { open24: false, days };
}

export function createEmptyProject(): MerchantWebsiteProject {
  const now = new Date().toISOString();
  return {
    id: createId("project"),
    createdAt: now,
    updatedAt: now,
    websiteProjectType: null,
    existingWebsite: { problems: [] },
    business: { name: "", industry: "", description: "" },
    location: {
      customersVisitLocation: null,
      servesCustomerLocations: null,
      serviceAreas: [],
      country: "",
    },
    services: [],
    audience: { customerType: [], decisionFactors: [] },
    goals: { goals: [] },
    branding: { hasLogo: null, colors: [], personality: [] },
    design: { energy: 50 },
    inspirationSites: [],
    competitors: [],
    content: {
      requiredContent: [],
      pages: [],
      homepageSections: [],
      structureTouched: false,
    },
    features: [],
    contact: { social: {} },
    businessHours: createEmptyHours(),
    trust: { trustFactors: [], testimonials: [] },
    assets: { availableAssets: [], uploads: [] },
    seo: { discoveryChannels: [], searchTerms: [], importantLocations: [] },
  };
}
