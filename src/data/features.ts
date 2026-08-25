export interface FeatureOption {
  value: string;
  label: string;
  description: string;
  /** Advanced features warn that extra integration work may be needed. */
  advanced?: boolean;
  group: "Contact & Conversion" | "Content & Media" | "Commerce & Scheduling" | "Engagement" | "Advanced";
}

export const FEATURES: FeatureOption[] = [
  { value: "contact-form", label: "Contact form", description: "A simple form that emails you.", group: "Contact & Conversion" },
  { value: "quote-form", label: "Quote request form", description: "Collect job details before you call back.", group: "Contact & Conversion" },
  { value: "click-to-call", label: "Click-to-call", description: "Tap the number to dial from a phone.", group: "Contact & Conversion" },
  { value: "whatsapp", label: "WhatsApp button", description: "Start a WhatsApp chat in one tap.", group: "Contact & Conversion" },
  { value: "google-maps", label: "Google Maps", description: "An embedded map of your location.", group: "Contact & Conversion" },
  { value: "multiple-locations", label: "Multiple locations", description: "A page or section per location.", group: "Contact & Conversion" },

  { value: "gallery", label: "Photo gallery", description: "Show your work or your space.", group: "Content & Media" },
  { value: "video", label: "Video", description: "Embedded video on key pages.", group: "Content & Media" },
  { value: "blog", label: "Blog", description: "Publish articles and updates.", group: "Content & Media" },
  { value: "faq", label: "FAQ", description: "Answer common questions up front.", group: "Content & Media" },
  { value: "team-profiles", label: "Team profiles", description: "Introduce the people behind the business.", group: "Content & Media" },
  { value: "downloads", label: "File downloads", description: "Brochures, price lists, forms.", group: "Content & Media" },
  { value: "search", label: "Site search", description: "Let visitors search your content.", group: "Content & Media" },

  { value: "booking", label: "Appointment booking", description: "Visitors pick a time and book.", advanced: true, group: "Commerce & Scheduling" },
  { value: "online-ordering", label: "Online ordering", description: "Take orders directly from the site.", advanced: true, group: "Commerce & Scheduling" },
  { value: "ecommerce", label: "Ecommerce store", description: "Product catalog, cart and checkout.", advanced: true, group: "Commerce & Scheduling" },
  { value: "menu-display", label: "Menu display", description: "A structured, easy-to-update menu.", group: "Commerce & Scheduling" },
  { value: "pricing-tables", label: "Pricing tables", description: "Compare packages or plans side by side.", group: "Commerce & Scheduling" },

  { value: "reviews", label: "Reviews", description: "Show ratings from Google or elsewhere.", group: "Engagement" },
  { value: "testimonials", label: "Testimonials", description: "Quotes from happy customers.", group: "Engagement" },
  { value: "newsletter", label: "Newsletter signup", description: "Collect email addresses.", group: "Engagement" },
  { value: "live-chat", label: "Live chat", description: "Chat with visitors in real time.", advanced: true, group: "Engagement" },
  { value: "social-links", label: "Social media links", description: "Link out to your profiles.", group: "Engagement" },
  { value: "job-applications", label: "Job applications", description: "Accept applications with a resume upload.", advanced: true, group: "Engagement" },

  { value: "customer-portal", label: "Customer portal", description: "Logged-in area for existing customers.", advanced: true, group: "Advanced" },
  { value: "integrations", label: "External integrations", description: "Connect a CRM, POS or other system.", advanced: true, group: "Advanced" },
  { value: "multilingual", label: "Multiple languages", description: "Serve the site in more than one language.", advanced: true, group: "Advanced" },
];

export const FEATURE_BY_VALUE = new Map(FEATURES.map((f) => [f.value, f]));

export function featureLabel(value: string): string {
  if (value.startsWith("other:")) return value.slice("other:".length);
  return FEATURE_BY_VALUE.get(value)?.label ?? value;
}

export const FEATURE_GROUPS = [
  "Contact & Conversion",
  "Content & Media",
  "Commerce & Scheduling",
  "Engagement",
  "Advanced",
] as const;
