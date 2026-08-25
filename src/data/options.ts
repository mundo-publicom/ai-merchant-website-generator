export interface Choice {
  value: string;
  label: string;
  description?: string;
}

export const EXISTING_SITE_PROBLEMS: Choice[] = [
  { value: "outdated-design", label: "Design looks outdated" },
  { value: "not-mobile", label: "Hard to use on mobile" },
  { value: "slow", label: "Slow to load" },
  { value: "hard-to-find-info", label: "Customers cannot find information" },
  { value: "few-leads", label: "Not generating enough leads" },
  { value: "hard-to-update", label: "Hard to update" },
  { value: "poor-seo", label: "Poor SEO / not found on Google" },
  { value: "inconsistent-branding", label: "Branding is inconsistent" },
  { value: "outdated-content", label: "Content is outdated" },
  { value: "confusing-offer", label: "Products / services are confusing" },
  { value: "hard-to-contact", label: "Contact process is difficult" },
];

export const BUSINESS_STAGES: Choice[] = [
  { value: "just-starting", label: "Just starting", description: "Not open yet or opening soon." },
  { value: "new", label: "New business", description: "Open less than two years." },
  { value: "established", label: "Established", description: "Steady, well-known locally." },
  { value: "growing", label: "Growing", description: "Adding staff, services or capacity." },
  { value: "rebranding", label: "Rebranding", description: "Changing name, look or positioning." },
  { value: "expanding", label: "Expanding to new markets", description: "New cities, regions or segments." },
];

export const CUSTOMER_TYPES: Choice[] = [
  { value: "consumers", label: "Consumers" },
  { value: "businesses", label: "Businesses" },
  { value: "both", label: "Both" },
];

export const GEOGRAPHIC_REACH: Choice[] = [
  { value: "local", label: "Local", description: "One city and nearby areas." },
  { value: "regional", label: "Regional", description: "Multiple cities, a state or region." },
  { value: "national", label: "National" },
  { value: "international", label: "International" },
];

export const DECISION_FACTORS: Choice[] = [
  { value: "price", label: "Price" },
  { value: "speed", label: "Speed" },
  { value: "availability", label: "Availability" },
  { value: "quality", label: "Quality" },
  { value: "experience", label: "Experience" },
  { value: "reputation", label: "Reputation" },
  { value: "trust", label: "Trust" },
  { value: "location", label: "Location" },
  { value: "convenience", label: "Convenience" },
  { value: "premium-service", label: "Premium service" },
  { value: "expertise", label: "Expertise" },
  { value: "warranty", label: "Warranty" },
  { value: "support", label: "Customer support" },
];

export const WEBSITE_GOALS: Choice[] = [
  { value: "generate-leads", label: "Generate leads" },
  { value: "phone-calls", label: "Receive phone calls" },
  { value: "whatsapp", label: "Receive WhatsApp messages" },
  { value: "bookings", label: "Get appointment bookings" },
  { value: "sell-products", label: "Sell products" },
  { value: "show-services", label: "Show services" },
  { value: "display-menu", label: "Display a menu" },
  { value: "showcase-portfolio", label: "Showcase portfolio" },
  { value: "build-credibility", label: "Build credibility" },
  { value: "explain-business", label: "Explain the business" },
  { value: "local-visibility", label: "Improve local visibility" },
  { value: "quote-requests", label: "Collect quote requests" },
  { value: "job-applications", label: "Receive job applications" },
  { value: "show-locations", label: "Show locations" },
  { value: "email-list", label: "Build an email list" },
  { value: "customer-support", label: "Provide customer support" },
  { value: "promotions", label: "Promote special offers" },
];

export interface CTAChoice extends Choice {
  /** Label used for the actual button on the generated site. */
  buttonLabel: string;
  destinationLabel?: string;
  destinationPlaceholder?: string;
  destinationField?: "phone" | "whatsapp" | "email" | "url" | "text";
}

export const CTA_OPTIONS: CTAChoice[] = [
  {
    value: "call",
    label: "Call us",
    buttonLabel: "Call Now",
    destinationLabel: "Primary phone number",
    destinationPlaceholder: "(305) 555-0142",
    destinationField: "phone",
  },
  {
    value: "quote",
    label: "Request a quote",
    buttonLabel: "Request a Quote",
    destinationLabel: "Where should quote requests go?",
    destinationPlaceholder: "quotes@yourbusiness.com",
    destinationField: "email",
  },
  {
    value: "book",
    label: "Book an appointment",
    buttonLabel: "Book Appointment",
    destinationLabel: "Booking link or tool (optional)",
    destinationPlaceholder: "https://calendly.com/your-business",
    destinationField: "url",
  },
  {
    value: "contact",
    label: "Contact us",
    buttonLabel: "Contact Us",
    destinationLabel: "Where should messages go?",
    destinationPlaceholder: "hello@yourbusiness.com",
    destinationField: "email",
  },
  {
    value: "get-started",
    label: "Get started",
    buttonLabel: "Get Started",
    destinationLabel: "What happens when they click? (optional)",
    destinationPlaceholder: "Opens the intake form",
    destinationField: "text",
  },
  {
    value: "visit",
    label: "Visit our location",
    buttonLabel: "Visit Us",
    destinationLabel: "Which location should we feature? (optional)",
    destinationPlaceholder: "Main store, downtown",
    destinationField: "text",
  },
  {
    value: "order",
    label: "Order online",
    buttonLabel: "Order Online",
    destinationLabel: "Ordering link (optional)",
    destinationPlaceholder: "https://order.yourbusiness.com",
    destinationField: "url",
  },
  {
    value: "shop",
    label: "Shop now",
    buttonLabel: "Shop Now",
    destinationLabel: "Store link (optional)",
    destinationPlaceholder: "https://shop.yourbusiness.com",
    destinationField: "url",
  },
  { value: "view-services", label: "View services", buttonLabel: "View Services" },
  {
    value: "directions",
    label: "Get directions",
    buttonLabel: "Get Directions",
    destinationLabel: "Map link (optional)",
    destinationPlaceholder: "https://maps.google.com/...",
    destinationField: "url",
  },
  {
    value: "whatsapp",
    label: "Send a WhatsApp message",
    buttonLabel: "Message on WhatsApp",
    destinationLabel: "WhatsApp number",
    destinationPlaceholder: "+1 305 555 0142",
    destinationField: "whatsapp",
  },
  {
    value: "consultation",
    label: "Schedule a consultation",
    buttonLabel: "Schedule a Consultation",
    destinationLabel: "Booking link or phone (optional)",
    destinationPlaceholder: "https://calendly.com/your-business",
    destinationField: "text",
  },
];

export const CTA_BY_VALUE = new Map(CTA_OPTIONS.map((c) => [c.value, c]));

export const BRAND_PERSONALITY: Choice[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "premium", label: "Premium" },
  { value: "modern", label: "Modern" },
  { value: "traditional", label: "Traditional" },
  { value: "bold", label: "Bold" },
  { value: "minimal", label: "Minimal" },
  { value: "playful", label: "Playful" },
  { value: "elegant", label: "Elegant" },
  { value: "luxury", label: "Luxury" },
  { value: "energetic", label: "Energetic" },
  { value: "trustworthy", label: "Trustworthy" },
  { value: "technical", label: "Technical" },
  { value: "local", label: "Local" },
  { value: "family-friendly", label: "Family-friendly" },
  { value: "innovative", label: "Innovative" },
  { value: "relaxed", label: "Relaxed" },
  { value: "sophisticated", label: "Sophisticated" },
];

export const THEME_OPTIONS: Choice[] = [
  { value: "light", label: "Light", description: "Bright backgrounds, dark text." },
  { value: "dark", label: "Dark", description: "Dark backgrounds, light text." },
  { value: "mixed", label: "Mixed", description: "Light pages with dark feature sections." },
  { value: "no-preference", label: "No preference", description: "Pick whatever suits the brand." },
];

export const DENSITY_OPTIONS: Choice[] = [
  { value: "minimal", label: "Minimal", description: "Few elements, lots of white space." },
  { value: "balanced", label: "Balanced", description: "A healthy mix of content and space." },
  { value: "information-rich", label: "Information-rich", description: "Show a lot on every screen." },
];

export const CORNER_OPTIONS: Choice[] = [
  { value: "square", label: "Square" },
  { value: "slightly-rounded", label: "Slightly rounded" },
  { value: "rounded", label: "Rounded" },
  { value: "no-preference", label: "No preference" },
];

export const CONTENT_TYPES: Choice[] = [
  { value: "business-overview", label: "Business overview" },
  { value: "services", label: "Services" },
  { value: "products", label: "Products" },
  { value: "pricing", label: "Pricing" },
  { value: "menu", label: "Menu" },
  { value: "portfolio", label: "Portfolio" },
  { value: "gallery", label: "Gallery" },
  { value: "testimonials", label: "Testimonials" },
  { value: "reviews", label: "Reviews" },
  { value: "team", label: "Team" },
  { value: "about", label: "About us" },
  { value: "faq", label: "FAQs" },
  { value: "blog", label: "Blog" },
  { value: "locations", label: "Locations" },
  { value: "contact", label: "Contact" },
  { value: "careers", label: "Careers" },
  { value: "promotions", label: "Promotions" },
  { value: "case-studies", label: "Case studies" },
  { value: "before-after", label: "Before and after" },
  { value: "certifications", label: "Certifications" },
  { value: "partners", label: "Partners" },
  { value: "financing", label: "Financing information" },
  { value: "policies", label: "Policies" },
];

export const TRUST_FACTORS: Choice[] = [
  { value: "years-in-business", label: "Years in business" },
  { value: "licensed", label: "Licensed" },
  { value: "insured", label: "Insured" },
  { value: "certified", label: "Certified" },
  { value: "awards", label: "Awards" },
  { value: "reviews", label: "Online reviews" },
  { value: "testimonials", label: "Customer testimonials" },
  { value: "guarantees", label: "Guarantees / warranty" },
  { value: "associations", label: "Professional associations" },
  { value: "known-clients", label: "Well-known clients" },
  { value: "customers-served", label: "Number of customers served" },
  { value: "family-owned", label: "Family-owned" },
  { value: "locally-owned", label: "Locally owned" },
  { value: "background-checked", label: "Background-checked staff" },
];

export const AVAILABLE_ASSETS: Choice[] = [
  { value: "logo", label: "Logo" },
  { value: "professional-photography", label: "Professional photography" },
  { value: "team-photos", label: "Team photos" },
  { value: "location-photos", label: "Location photos" },
  { value: "product-photos", label: "Product photos" },
  { value: "service-photos", label: "Service photos" },
  { value: "before-after-photos", label: "Before-and-after photos" },
  { value: "videos", label: "Videos" },
  { value: "none", label: "None yet" },
];

export const DISCOVERY_CHANNELS: Choice[] = [
  { value: "google-search", label: "Google search" },
  { value: "google-maps", label: "Google Maps" },
  { value: "social-media", label: "Social media" },
  { value: "referrals", label: "Referrals" },
  { value: "direct", label: "Direct traffic" },
  { value: "advertising", label: "Advertising" },
  { value: "not-sure", label: "Not sure" },
];

export const WEEK_DAYS: Array<{ value: string; label: string; short: string }> = [
  { value: "monday", label: "Monday", short: "Mon" },
  { value: "tuesday", label: "Tuesday", short: "Tue" },
  { value: "wednesday", label: "Wednesday", short: "Wed" },
  { value: "thursday", label: "Thursday", short: "Thu" },
  { value: "friday", label: "Friday", short: "Fri" },
  { value: "saturday", label: "Saturday", short: "Sat" },
  { value: "sunday", label: "Sunday", short: "Sun" },
];

export const SOCIAL_NETWORKS: Array<{
  key: "facebook" | "instagram" | "linkedin" | "tiktok" | "x" | "youtube" | "pinterest" | "other";
  label: string;
  placeholder: string;
}> = [
  { key: "facebook", label: "Facebook", placeholder: "facebook.com/yourbusiness" },
  { key: "instagram", label: "Instagram", placeholder: "instagram.com/yourbusiness" },
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/company/yourbusiness" },
  { key: "tiktok", label: "TikTok", placeholder: "tiktok.com/@yourbusiness" },
  { key: "x", label: "X", placeholder: "x.com/yourbusiness" },
  { key: "youtube", label: "YouTube", placeholder: "youtube.com/@yourbusiness" },
  { key: "pinterest", label: "Pinterest", placeholder: "pinterest.com/yourbusiness" },
  { key: "other", label: "Other", placeholder: "https://..." },
];

const ALL_CHOICES: Choice[] = [
  ...EXISTING_SITE_PROBLEMS,
  ...BUSINESS_STAGES,
  ...CUSTOMER_TYPES,
  ...GEOGRAPHIC_REACH,
  ...DECISION_FACTORS,
  ...WEBSITE_GOALS,
  ...CTA_OPTIONS,
  ...BRAND_PERSONALITY,
  ...THEME_OPTIONS,
  ...DENSITY_OPTIONS,
  ...CORNER_OPTIONS,
  ...CONTENT_TYPES,
  ...TRUST_FACTORS,
  ...AVAILABLE_ASSETS,
  ...DISCOVERY_CHANNELS,
];

const LABELS = new Map<string, string>();
for (const choice of ALL_CHOICES) {
  if (!LABELS.has(choice.value)) LABELS.set(choice.value, choice.label);
}

/** Resolve a stored option value to its human label. Handles free-text "other:" values. */
export function labelFor(value: string): string {
  if (value.startsWith("other:")) return value.slice("other:".length);
  if (value.startsWith("custom:")) return value.slice("custom:".length);
  return LABELS.get(value) ?? value;
}

export function labelsFor(values: string[]): string[] {
  return values.map(labelFor);
}
