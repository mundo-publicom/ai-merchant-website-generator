export type WebsiteProjectType = "new" | "redesign";

export type ServicePriority = "primary" | "secondary";

export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: string;
  priority: ServicePriority;
}

export interface WebsitePage {
  id: string;
  title: string;
  purpose?: string;
  children?: WebsitePage[];
  /** Pages proposed by the recommendation engine rather than added by hand. */
  recommended?: boolean;
}

export interface HomepageSection {
  id: string;
  title: string;
  purpose: string;
  enabled: boolean;
}

export interface Testimonial {
  id: string;
  author: string;
  quote: string;
  rating?: number;
  source?: string;
}

export interface DayHours {
  closed: boolean;
  open: string;
  close: string;
}

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface BusinessHours {
  open24: boolean;
  days: Record<WeekDay, DayHours>;
  note?: string;
}

export interface InspirationSite {
  id: string;
  url: string;
  notes?: string;
}

export interface Competitor {
  id: string;
  name?: string;
  url?: string;
  notes?: string;
}

export interface MerchantWebsiteProject {
  id: string;
  createdAt: string;
  updatedAt: string;

  websiteProjectType: WebsiteProjectType | null;

  existingWebsite: {
    url?: string;
    likes?: string;
    dislikes?: string;
    problems: string[];
    preserve?: string;
  };

  business: {
    name: string;
    industry: string;
    description: string;
    yearEstablished?: string;
    locationCount?: string;
    businessStage?: string;
  };

  location: {
    address?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    customersVisitLocation: boolean | null;
    servesCustomerLocations: boolean | null;
    serviceAreas: string[];
  };

  services: Service[];
  primaryServiceId?: string;

  audience: {
    description?: string;
    customerType: string[];
    geographicReach?: string;
    customerProblems?: string;
    decisionFactors: string[];
  };

  goals: {
    goals: string[];
    primaryGoal?: string;
    primaryCTA?: string;
    primaryCTADestination?: string;
    secondaryCTA?: string;
  };

  branding: {
    hasLogo: boolean | null;
    logoPreview?: string;
    logoName?: string;
    colors: string[];
    personality: string[];
  };

  design: {
    primaryStyle?: string;
    secondaryStyle?: string;
    theme?: string;
    density?: string;
    cornerStyle?: string;
    energy: number;
  };

  inspirationSites: InspirationSite[];
  competitors: Competitor[];

  content: {
    requiredContent: string[];
    pages: WebsitePage[];
    homepageSections: HomepageSection[];
    /** Set once the merchant has hand-edited structure so we stop overwriting it. */
    structureTouched: boolean;
  };

  features: string[];

  contact: {
    phone?: string;
    secondaryPhone?: string;
    email?: string;
    whatsapp?: string;
    social: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      tiktok?: string;
      x?: string;
      youtube?: string;
      pinterest?: string;
      other?: string;
    };
  };

  businessHours: BusinessHours;

  trust: {
    trustFactors: string[];
    details?: string;
    testimonials: Testimonial[];
  };

  assets: {
    availableAssets: string[];
    uploads: Array<{ id: string; name: string; preview: string }>;
  };

  seo: {
    discoveryChannels: string[];
    searchTerms: string[];
    importantLocations: string[];
  };

  /** Reserved for Phase 2. Never written to in Phase 1. */
  generation?: {
    status:
      | "not_started"
      | "queued"
      | "generating"
      | "preview_ready"
      | "failed"
      | "completed";
    prompt?: string;
    generationId?: string;
    previewUrl?: string;
  };
}

export interface HomepageSectionPlan {
  title: string;
  purpose: string;
  includes: string[];
}

export interface WebsiteReport {
  businessSummary: string;
  businessFacts: Array<{ label: string; value: string }>;
  websiteStrategy: string;
  sitemap: WebsitePage[];
  homepagePlan: HomepageSectionPlan[];
  designDirection: string;
  designFacts: Array<{ label: string; value: string }>;
  functionality: { required: string[]; optional: string[] };
  seoStrategy: string;
  searchThemes: string[];
  locationPages: string[];
  contentRecommendations: string[];
  developerBrief: string;
}
