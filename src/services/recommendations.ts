import type {
  HomepageSection,
  MerchantWebsiteProject,
  WebsitePage,
} from "@/types/project";
import { industryTraits } from "@/data/industries";
import { createId } from "@/utils/id";

interface PageSeed {
  key: string;
  title: string;
  purpose: string;
  when: (p: MerchantWebsiteProject, traits: string[]) => boolean;
  /** Lower sorts earlier. */
  order: number;
  children?: (p: MerchantWebsiteProject) => WebsitePage[];
}

const has = (list: string[], value: string) => list.includes(value);

const PAGE_SEEDS: PageSeed[] = [
  {
    key: "home",
    title: "Home",
    purpose: "Explain what the business does, for whom, and drive the primary action.",
    when: () => true,
    order: 0,
  },
  {
    key: "services",
    title: "Services",
    purpose: "Present every service with enough detail for a visitor to self-qualify.",
    order: 10,
    when: (p, traits) =>
      p.services.length > 0 ||
      has(p.content.requiredContent, "services") ||
      has(p.goals.goals, "show-services") ||
      traits.includes("local-service"),
    children: (p) =>
      p.services.slice(0, 8).map((service) => ({
        id: createId("page"),
        title: service.name,
        purpose: `Dedicated page for ${service.name}, targeting people searching for it specifically.`,
        recommended: true,
      })),
  },
  {
    key: "products",
    title: "Products",
    purpose: "Show the product range with images, descriptions and prices.",
    order: 12,
    when: (p, traits) =>
      has(p.content.requiredContent, "products") ||
      has(p.goals.goals, "sell-products") ||
      has(p.features, "ecommerce") ||
      traits.includes("ecommerce"),
  },
  {
    key: "menu",
    title: "Menu",
    purpose: "A readable, mobile-friendly menu that is easy to keep current.",
    order: 14,
    when: (p, traits) =>
      has(p.content.requiredContent, "menu") ||
      has(p.goals.goals, "display-menu") ||
      has(p.features, "menu-display") ||
      traits.includes("menu"),
  },
  {
    key: "portfolio",
    title: "Portfolio",
    purpose: "Prove the quality of the work with real project examples.",
    order: 20,
    when: (p, traits) =>
      has(p.content.requiredContent, "portfolio") ||
      has(p.content.requiredContent, "case-studies") ||
      has(p.goals.goals, "showcase-portfolio") ||
      traits.includes("portfolio"),
  },
  {
    key: "gallery",
    title: "Gallery",
    purpose: "Photography of the space, the team and completed work.",
    order: 22,
    when: (p) =>
      has(p.content.requiredContent, "gallery") ||
      (has(p.features, "gallery") && !has(p.content.requiredContent, "portfolio")),
  },
  {
    key: "service-areas",
    title: "Service Areas",
    purpose: "Name every city and area served so local searches can find the business.",
    order: 30,
    when: (p) => p.location.serviceAreas.length > 0,
    children: (p) =>
      p.location.serviceAreas.slice(0, 8).map((area) => ({
        id: createId("page"),
        title: area,
        purpose: `Local landing page for ${area}.`,
        recommended: true,
      })),
  },
  {
    key: "locations",
    title: "Locations",
    purpose: "Address, hours, map and contact details for each location.",
    order: 32,
    when: (p) =>
      has(p.content.requiredContent, "locations") ||
      has(p.features, "multiple-locations") ||
      has(p.goals.goals, "show-locations") ||
      Number(p.business.locationCount ?? "1") > 1,
  },
  {
    key: "about",
    title: "About",
    purpose: "Tell the story of the business and the people behind it.",
    order: 40,
    when: () => true,
  },
  {
    key: "team",
    title: "Team",
    purpose: "Introduce staff with photos, roles and credentials.",
    order: 42,
    when: (p) => has(p.content.requiredContent, "team") || has(p.features, "team-profiles"),
  },
  {
    key: "pricing",
    title: "Pricing",
    purpose: "Set expectations on cost and remove a common objection before contact.",
    order: 44,
    when: (p) =>
      has(p.content.requiredContent, "pricing") || has(p.features, "pricing-tables"),
  },
  {
    key: "reviews",
    title: "Reviews",
    purpose: "Collect social proof in one place for visitors who need reassurance.",
    order: 50,
    when: (p) =>
      has(p.content.requiredContent, "testimonials") ||
      has(p.content.requiredContent, "reviews") ||
      p.trust.testimonials.length > 0 ||
      has(p.trust.trustFactors, "reviews"),
  },
  {
    key: "faq",
    title: "FAQ",
    purpose: "Answer the questions that would otherwise become phone calls.",
    order: 55,
    when: (p) => has(p.content.requiredContent, "faq") || has(p.features, "faq"),
  },
  {
    key: "blog",
    title: "Blog",
    purpose: "Publish helpful articles that bring in search traffic over time.",
    order: 60,
    when: (p) => has(p.content.requiredContent, "blog") || has(p.features, "blog"),
  },
  {
    key: "careers",
    title: "Careers",
    purpose: "List openings and accept applications.",
    order: 65,
    when: (p) =>
      has(p.content.requiredContent, "careers") ||
      has(p.goals.goals, "job-applications") ||
      has(p.features, "job-applications"),
  },
  {
    key: "promotions",
    title: "Offers",
    purpose: "Feature current promotions and seasonal offers.",
    order: 68,
    when: (p) =>
      has(p.content.requiredContent, "promotions") || has(p.goals.goals, "promotions"),
  },
  {
    key: "contact",
    title: "Contact",
    purpose: "Every way to reach the business, plus a form, map and hours.",
    order: 90,
    when: () => true,
  },
];

export function recommendPages(project: MerchantWebsiteProject): WebsitePage[] {
  const traits = industryTraits(project.business.industry);
  return PAGE_SEEDS.filter((seed) => seed.when(project, traits))
    .sort((a, b) => a.order - b.order)
    .map((seed) => {
      const children = seed.children?.(project) ?? [];
      return {
        id: createId("page"),
        title: seed.title,
        purpose: seed.purpose,
        recommended: true,
        ...(children.length > 0 ? { children } : {}),
      };
    });
}

interface SectionSeed {
  key: string;
  title: string;
  purpose: string;
  order: number;
  when: (p: MerchantWebsiteProject, traits: string[]) => boolean;
}

const SECTION_SEEDS: SectionSeed[] = [
  {
    key: "hero",
    title: "Hero",
    purpose: "State what the business does, where it operates, and show the primary call to action.",
    order: 0,
    when: () => true,
  },
  {
    key: "trust-bar",
    title: "Trust Indicators",
    purpose: "A compact strip of credibility signals directly under the hero.",
    order: 10,
    when: (p) => p.trust.trustFactors.length > 0,
  },
  {
    key: "services",
    title: "Primary Services",
    purpose: "Lead with the highest-value services, each linking to its own page.",
    order: 20,
    when: (p) => p.services.length > 0,
  },
  {
    key: "products",
    title: "Featured Products",
    purpose: "Highlight best-selling or seasonal products.",
    order: 22,
    when: (p, traits) => has(p.goals.goals, "sell-products") || traits.includes("ecommerce"),
  },
  {
    key: "menu-preview",
    title: "Menu Highlights",
    purpose: "Show a taste of the menu and link to the full version.",
    order: 24,
    when: (p, traits) => traits.includes("menu") || has(p.goals.goals, "display-menu"),
  },
  {
    key: "why-us",
    title: "Why Choose Us",
    purpose: "Turn the reasons customers pick this business into three or four clear points.",
    order: 30,
    when: () => true,
  },
  {
    key: "how-it-works",
    title: "How It Works",
    purpose: "Remove uncertainty by showing the process in three or four steps.",
    order: 40,
    when: (p) => p.services.length > 0 || has(p.goals.goals, "quote-requests"),
  },
  {
    key: "portfolio",
    title: "Recent Work",
    purpose: "Visual proof of quality, pulled from the portfolio or gallery.",
    order: 50,
    when: (p, traits) =>
      traits.includes("portfolio") ||
      has(p.content.requiredContent, "portfolio") ||
      has(p.content.requiredContent, "before-after"),
  },
  {
    key: "reviews",
    title: "Customer Reviews",
    purpose: "Real quotes with names and ratings, placed before the final ask.",
    order: 60,
    when: (p) =>
      p.trust.testimonials.length > 0 ||
      has(p.content.requiredContent, "testimonials") ||
      has(p.content.requiredContent, "reviews"),
  },
  {
    key: "service-area",
    title: "Service Area",
    purpose: "List the areas covered, with a map, so visitors confirm they are in range.",
    order: 70,
    when: (p) => p.location.serviceAreas.length > 0,
  },
  {
    key: "location",
    title: "Visit Us",
    purpose: "Address, map, parking and hours for customers who come in person.",
    order: 72,
    when: (p) => p.location.customersVisitLocation === true,
  },
  {
    key: "team",
    title: "Meet the Team",
    purpose: "Put faces to the business to build familiarity.",
    order: 75,
    when: (p) => has(p.content.requiredContent, "team") || has(p.features, "team-profiles"),
  },
  {
    key: "faq",
    title: "FAQ",
    purpose: "Handle the last few objections before the closing call to action.",
    order: 80,
    when: (p) => has(p.content.requiredContent, "faq") || has(p.features, "faq"),
  },
  {
    key: "newsletter",
    title: "Newsletter Signup",
    purpose: "Capture visitors who are not ready to buy yet.",
    order: 85,
    when: (p) => has(p.features, "newsletter") || has(p.goals.goals, "email-list"),
  },
  {
    key: "final-cta",
    title: "Final Call To Action",
    purpose: "A full-width closing block repeating the primary action.",
    order: 90,
    when: () => true,
  },
  {
    key: "footer",
    title: "Footer",
    purpose: "Navigation, contact details, hours, service areas and social links.",
    order: 100,
    when: () => true,
  },
];

export function recommendHomepageSections(
  project: MerchantWebsiteProject,
): HomepageSection[] {
  const traits = industryTraits(project.business.industry);
  return SECTION_SEEDS.filter((seed) => seed.when(project, traits))
    .sort((a, b) => a.order - b.order)
    .map((seed) => ({
      id: createId("section"),
      title: seed.title,
      purpose: seed.purpose,
      enabled: true,
    }));
}

/** Features implied by the merchant's answers even if they were not explicitly ticked. */
export function impliedFeatures(project: MerchantWebsiteProject): string[] {
  const traits = industryTraits(project.business.industry);
  const implied = new Set<string>();

  if (project.contact.phone || project.goals.primaryCTA === "call") implied.add("click-to-call");
  if (project.contact.whatsapp || project.goals.primaryCTA === "whatsapp") implied.add("whatsapp");
  if (project.goals.primaryCTA === "quote" || has(project.goals.goals, "quote-requests"))
    implied.add("quote-form");
  if (project.goals.primaryCTA === "book" || has(project.goals.goals, "bookings"))
    implied.add("booking");
  if (project.goals.primaryCTA === "contact" || has(project.goals.goals, "generate-leads"))
    implied.add("contact-form");
  if (project.location.customersVisitLocation) implied.add("google-maps");
  if (project.trust.testimonials.length > 0) implied.add("testimonials");
  if (has(project.content.requiredContent, "faq")) implied.add("faq");
  if (has(project.content.requiredContent, "gallery")) implied.add("gallery");
  if (has(project.content.requiredContent, "blog")) implied.add("blog");
  if (traits.includes("menu")) implied.add("menu-display");
  if (traits.includes("ecommerce") && has(project.goals.goals, "sell-products"))
    implied.add("ecommerce");
  if (Object.values(project.contact.social).some(Boolean)) implied.add("social-links");

  return [...implied].filter((f) => !project.features.includes(f));
}
