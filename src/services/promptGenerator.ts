import type { MerchantWebsiteProject, WebsitePage, WebsiteReport } from "@/types/project";
import { deriveFacts, type ProjectFacts } from "@/services/reportGenerator";
import { CTA_BY_VALUE, labelFor, labelsFor, SOCIAL_NETWORKS } from "@/data/options";
import { DESIGN_STYLE_BY_VALUE } from "@/data/designStyles";
import { backOfficeModules, buildBackOfficeSections } from "@/services/backOffice";
import {
  bullets,
  displayUrl,
  formatAddress,
  formatBusinessHours,
  hasAnyHours,
  joinList,
  numbered,
  promptSection as section,
} from "@/utils/formatting";

interface Ctx {
  project: MerchantWebsiteProject;
  report: WebsiteReport;
  facts: ProjectFacts;
}

/* ------------------------------------------------------------------ */

function buildProjectTypeSection({ project, facts }: Ctx): string {
  if (!facts.isRedesign) {
    return section(
      "PROJECT TYPE",
      [
        "Create a completely new website for this business. There is no existing site to migrate content from.",
        "Write all copy from scratch using the business information in this brief.",
      ].join("\n\n"),
    );
  }

  const existing = project.existingWebsite;
  const lines: string[] = [
    `Redesign the existing website: ${displayUrl(existing.url) || "(URL not supplied)"}`,
    "",
    "Do not simply reproduce the existing design. Rebuild the structure, the copy and the visual system around the goals in this brief.",
  ];

  if (existing.preserve?.trim()) {
    lines.push("", "Preserve the following elements:", existing.preserve.trim());
  }
  if (existing.likes?.trim()) {
    lines.push("", "What the owner likes about the current site:", existing.likes.trim());
  }
  if (existing.dislikes?.trim()) {
    lines.push("", "What the owner dislikes about the current site:", existing.dislikes.trim());
  }
  if (existing.problems.length) {
    lines.push(
      "",
      "Known issues with the current website that must be fixed:",
      bullets(labelsFor(existing.problems)),
    );
  }

  return section("PROJECT TYPE", lines.join("\n"));
}

function buildBusinessSection({ project, facts }: Ctx): string {
  const lines: string[] = [
    `Name: ${facts.name}`,
    `Industry: ${facts.industry}`,
  ];

  const address = formatAddress(project.location);
  if (address) lines.push(`Address: ${address}`);
  else if (facts.cityLabel) lines.push(`Based in: ${facts.cityLabel}`);

  lines.push(
    `Business type: ${
      facts.isLocalService
        ? "Local service business"
        : project.location.customersVisitLocation
          ? "Location-based business customers visit"
          : "Service business"
    }`,
  );

  if (project.business.yearEstablished) lines.push(`Established: ${project.business.yearEstablished}`);
  if (project.business.locationCount) lines.push(`Locations: ${project.business.locationCount}`);
  if (project.business.businessStage)
    lines.push(`Business stage: ${labelFor(project.business.businessStage)}`);
  if (project.location.serviceAreas.length)
    lines.push(`Service area: ${joinList(project.location.serviceAreas)}`);
  lines.push(
    `Customers visit a physical location: ${project.location.customersVisitLocation ? "Yes" : "No"}`,
  );
  lines.push(
    `Business travels to the customer: ${project.location.servesCustomerLocations ? "Yes" : "No"}`,
  );

  if (project.business.description.trim()) {
    lines.push("", "In the owner's words:", project.business.description.trim());
  }

  return section("BUSINESS", lines.join("\n"));
}

function buildObjectivesSection({ project, facts }: Ctx): string {
  const lines: string[] = [];

  lines.push(
    `Build a ${facts.styleLabel ? `${facts.styleLabel.toLowerCase()}, ` : ""}conversion-focused website whose single most important job is: ${
      facts.primaryGoal || "generating enquiries"
    }.`,
  );

  if (facts.goals.length) {
    lines.push("", "All goals the website must serve:", bullets(facts.goals));
  }

  lines.push("", `PRIMARY CTA: "${facts.primaryCTA}"`);
  const cta = project.goals.primaryCTA ? CTA_BY_VALUE.get(project.goals.primaryCTA) : undefined;
  if (project.goals.primaryCTADestination?.trim() && cta?.destinationField) {
    const destinationLabels: Record<string, string> = {
      phone: "Dials",
      whatsapp: "Opens WhatsApp chat with",
      email: "Sends to",
      url: "Links to",
      text: "Behaviour",
    };
    lines.push(
      `${destinationLabels[cta.destinationField] ?? "Destination"}: ${project.goals.primaryCTADestination.trim()}`,
    );
  }
  if (facts.secondaryCTA) lines.push(`SECONDARY CTA: "${facts.secondaryCTA}"`);
  lines.push(
    "",
    `The primary CTA must appear in the site header, in the hero, after the services section, and in a final full-width closing block. On mobile it must also be available from a persistent bar fixed to the bottom of the viewport.`,
  );

  return section("OBJECTIVE", lines.join("\n"));
}

function buildAudienceSection({ project, facts }: Ctx): string {
  const lines: string[] = [];
  if (facts.audience) lines.push(facts.audience);
  if (project.audience.customerType.length)
    lines.push(`Sells to: ${joinList(labelsFor(project.audience.customerType))}`);
  if (project.audience.geographicReach)
    lines.push(`Customer reach: ${labelFor(project.audience.geographicReach)}`);
  if (project.audience.customerProblems?.trim()) {
    lines.push(
      "",
      "The problem customers are trying to solve when they get in touch:",
      project.audience.customerProblems.trim(),
    );
  }
  if (facts.decisionFactors.length) {
    lines.push(
      "",
      "What matters most to these customers when choosing a provider:",
      bullets(facts.decisionFactors),
      "",
      "Address each of these explicitly in the copy, with concrete detail rather than adjectives.",
    );
  }
  return section("TARGET AUDIENCE", lines.join("\n"));
}

function buildServicesSection({ project, facts }: Ctx): string {
  if (!project.services.length) return "";

  const entries = project.services.map((service) => {
    const bits = [service.name];
    if (service.id === project.primaryServiceId) bits.push("[PRIMARY SERVICE - give the most prominence]");
    else if (service.priority === "primary") bits.push("[featured]");
    let line = bits.join(" ");
    if (service.description?.trim()) line += `\n   ${service.description.trim()}`;
    if (service.price?.trim()) line += `\n   Price: ${service.price.trim()}`;
    return line;
  });

  const lines = [numbered(entries)];
  if (facts.primaryService) {
    lines.push(
      "",
      `Homepage hierarchy must lead with ${facts.primaryService}. Every service listed above needs its own page with its own call to action.`,
    );
  }

  return section("SERVICES", lines.join("\n"));
}

function pageTree(pages: WebsitePage[], depth = 0): string[] {
  return pages.flatMap((page) => [
    `${"    ".repeat(depth)}${page.title}`,
    ...(page.children?.length ? pageTree(page.children, depth + 1) : []),
  ]);
}

function buildSitemapSection({ report }: Ctx): string {
  return section(
    "WEBSITE STRUCTURE",
    [
      pageTree(report.sitemap).join("\n"),
      "",
      "Every page above must be built. Pages nested under a parent are child routes of that parent.",
    ].join("\n"),
  );
}

function buildHomepageSection({ report }: Ctx): string {
  const blocks = report.homepagePlan.map((plan, index) => {
    const lines = [`${index + 1}. ${plan.title.toUpperCase()}`, `   Purpose: ${plan.purpose}`];
    lines.push(bullets(plan.includes, "   - "));
    return lines.join("\n");
  });

  return section(
    "HOMEPAGE",
    ["Build the homepage using exactly this structure, in this order:", "", blocks.join("\n\n")].join("\n"),
  );
}

function buildBrandSection({ project, facts }: Ctx): string {
  const lines: string[] = [];

  lines.push(
    project.branding.hasLogo
      ? "The business has an existing logo. Design the header, footer and favicon around it and leave a clearly defined logo slot."
      : "The business has no logo. Create a clean wordmark from the business name and use it consistently in the header, footer and favicon.",
  );

  if (facts.personality.length) {
    lines.push("", "Brand personality:", bullets(facts.personality));
  }

  if (project.branding.colors.length) {
    lines.push(
      "",
      `Brand colours: ${project.branding.colors.join(", ")}`,
      "Use the darkest colour for primary surfaces such as the header and closing block. Reserve the brightest colour exclusively for calls to action so it always signals an action.",
    );
  } else {
    lines.push(
      "",
      "No brand colours exist. Choose a deep neutral base plus one high-contrast accent, and use the accent only for calls to action.",
    );
  }

  const assets = project.assets.availableAssets.filter((a) => a !== "none");
  lines.push(
    "",
    assets.length
      ? `Available visual assets: ${joinList(labelsFor(assets))}. Prefer real imagery over stock wherever these exist.`
      : "No photography exists yet. Design layouts that work with typography, colour and iconography, and mark clear slots for real photos to be dropped in later.",
  );

  return section("BRAND", lines.join("\n"));
}

function buildDesignSection({ project, report }: Ctx): string {
  const style = project.design.primaryStyle
    ? DESIGN_STYLE_BY_VALUE.get(project.design.primaryStyle)
    : undefined;
  const secondary = project.design.secondaryStyle
    ? DESIGN_STYLE_BY_VALUE.get(project.design.secondaryStyle)
    : undefined;

  const lines: string[] = [];
  if (style) {
    lines.push(`Primary style: ${style.label} - ${style.description}`);
    lines.push(style.direction);
    lines.push(`Typography: ${style.typography}`);
  }
  if (secondary) {
    lines.push("", `Secondary influence: ${secondary.label} - ${secondary.direction}`);
  }

  lines.push("", bullets(report.designFacts.map((f) => `${f.label}: ${f.value}`)));

  lines.push(
    "",
    "Layout rules:",
    bullets([
      "Mobile-first. Design the small screen first, then scale up.",
      "One idea per section, with clear separation between sections.",
      "Strong visual hierarchy: headline, supporting line, action.",
      "Buttons at least 44px tall with generous horizontal padding.",
      "Restrained shadows and subtle borders rather than heavy decoration.",
      "Avoid unnecessary animation. Use motion only to confirm an interaction.",
    ]),
  );

  return section("DESIGN DIRECTION", lines.join("\n"));
}

function buildFeatureSection({ report }: Ctx): string {
  const lines = [
    "Required functionality:",
    bullets(report.functionality.required),
  ];
  if (report.functionality.optional.length) {
    lines.push(
      "",
      "Optional, build only if it does not compromise the required scope:",
      bullets(report.functionality.optional),
    );
  }
  return section("FUNCTIONAL REQUIREMENTS", lines.join("\n"));
}

function buildContentSection({ project, report, facts }: Ctx): string {
  const lines: string[] = [
    "Write clear, specific, customer-focused copy. No filler, no generic corporate language, no invented claims.",
    "",
    bullets(report.contentRecommendations),
  ];

  if (project.content.requiredContent.length) {
    lines.push(
      "",
      "Content the owner explicitly asked for:",
      bullets(labelsFor(project.content.requiredContent)),
    );
  }

  lines.push(
    "",
    `Messaging focus: ${
      facts.decisionFactors.length
        ? joinList(facts.decisionFactors.map((f) => f.toLowerCase()))
        : "reliability, expertise and ease of getting started"
    }.`,
  );

  return section("CONTENT REQUIREMENTS", lines.join("\n"));
}

function buildTrustSection({ project }: Ctx): string {
  const lines: string[] = [];
  if (project.trust.trustFactors.length) {
    lines.push("Trust signals to surface throughout the site:", bullets(labelsFor(project.trust.trustFactors)));
  }
  if (project.trust.details?.trim()) {
    lines.push("", "Supporting detail supplied by the owner (use verbatim where credibility matters):", project.trust.details.trim());
  }
  if (project.trust.testimonials.length) {
    lines.push("", "Real testimonials to publish:");
    for (const testimonial of project.trust.testimonials) {
      if (!testimonial.quote.trim()) continue;
      const meta = [testimonial.author, testimonial.source].filter(Boolean).join(", ");
      const stars = testimonial.rating ? ` (${testimonial.rating}/5)` : "";
      lines.push(`- "${testimonial.quote.trim()}" - ${meta}${stars}`);
    }
  }
  return section("TRUST AND SOCIAL PROOF", lines.join("\n"));
}

function buildContactSection({ project }: Ctx): string {
  const lines: string[] = [];
  const { contact } = project;
  if (contact.phone) lines.push(`Phone: ${contact.phone}`);
  if (contact.secondaryPhone) lines.push(`Secondary phone: ${contact.secondaryPhone}`);
  if (contact.whatsapp) lines.push(`WhatsApp: ${contact.whatsapp}`);
  if (contact.email) lines.push(`Email: ${contact.email}`);

  const address = formatAddress(project.location);
  if (address) lines.push(`Address: ${address}`);

  const social = SOCIAL_NETWORKS.map(({ key, label }) => {
    const value = contact.social[key];
    return value ? `${label}: ${value}` : "";
  }).filter(Boolean);
  if (social.length) lines.push("", "Social profiles:", bullets(social));

  if (hasAnyHours(project.businessHours)) {
    lines.push("", "Business hours:", bullets(formatBusinessHours(project.businessHours)));
    if (project.businessHours.note?.trim()) lines.push(project.businessHours.note.trim());
  }

  lines.push(
    "",
    "These details must be identical everywhere they appear - header, footer, contact page and structured data.",
  );

  return section("CONTACT INFORMATION", lines.join("\n"));
}

function buildSEOSection({ report }: Ctx): string {
  const lines: string[] = [
    "Create a unique title tag and meta description for every page.",
    "Use one H1 per page containing the service and, where relevant, the location.",
    "",
    "Work these search themes into headings and body copy naturally - never as a keyword list:",
    bullets(report.searchThemes),
  ];

  if (report.locationPages.length) {
    lines.push(
      "",
      "Build dedicated service + location pages for:",
      bullets(report.locationPages),
    );
  }

  lines.push(
    "",
    "Add LocalBusiness structured data including name, address, phone, hours, service area and services.",
    "Generate a sitemap and use descriptive, human-readable URLs.",
  );

  return section("SEO", lines.join("\n"));
}

function buildReferencesSection({ project }: Ctx): string {
  const lines: string[] = [];

  if (project.inspirationSites.some((s) => s.url.trim())) {
    lines.push("Websites the owner likes:");
    for (const site of project.inspirationSites) {
      if (!site.url.trim()) continue;
      lines.push(`- ${displayUrl(site.url)}${site.notes?.trim() ? ` - ${site.notes.trim()}` : ""}`);
    }
    lines.push("", "Take direction from these references, do not copy them.");
  }

  if (project.competitors.some((c) => c.name?.trim() || c.url?.trim())) {
    lines.push("", "Competitors:");
    for (const competitor of project.competitors) {
      const name = competitor.name?.trim();
      const url = competitor.url?.trim() ? displayUrl(competitor.url) : "";
      if (!name && !url) continue;
      const notes = competitor.notes?.trim() ? ` - ${competitor.notes.trim()}` : "";
      lines.push(`- ${[name, url].filter(Boolean).join(" / ")}${notes}`);
    }
    lines.push("", "The website must make this business's advantage obvious within the first screen.");
  }

  return section("REFERENCES", lines.join("\n"));
}

function buildTechnicalRequirementsSection({ facts }: Ctx): string {
  return section(
    "TECHNICAL QUALITY",
    bullets([
      "Build reusable components rather than duplicating markup across pages.",
      "Semantic HTML5 with correct landmarks and a single H1 per page.",
      "Fully responsive from 320px upward, with no horizontal scrolling at any width.",
      facts.mobileFirst
        ? "Mobile is the priority device. Verify every page at 375px before anything else."
        : "Verify every page on mobile, tablet and desktop.",
      "WCAG 2.1 AA: sufficient contrast, labelled form fields, keyboard operable controls, visible focus states, accessible error messages.",
      "Images: correct dimensions, modern formats, lazy loading below the fold, no layout shift.",
      "Target a Lighthouse mobile performance score of 90 or better.",
      "Forms: inline validation, clear success and error states, and spam protection.",
      "Avoid unnecessary animation. Use subtle transitions only where they improve usability, and respect prefers-reduced-motion.",
      "No placeholder lorem ipsum anywhere in the delivered site.",
    ]),
  );
}

/* ------------------------------------------------------------------ */

/**
 * Produces the complete plain-text prompt for a downstream AI website generator.
 * Phase 2 will send this string; nothing here depends on the UI.
 */
export function generateWebsitePrompt(
  project: MerchantWebsiteProject,
  report: WebsiteReport,
): string {
  const ctx: Ctx = { project, report, facts: deriveFacts(project) };

  const header = [
    `Build a complete, production-quality website for ${ctx.facts.name}, together with the back office system that runs it.`,
    "",
    "This brief covers two halves of one product: the public website, specified first, and the admin application that the business manages it from, specified in the BACK OFFICE sections. They share one codebase, one deployment and one database - the website renders what the back office holds, and everything the website captures is worked on in the back office. Build both.",
    "",
    "You have everything you need below. Do not ask clarifying questions - build what is described here, and make reasonable professional decisions for anything not specified.",
  ].join("\n");

  const strategy = section(
    "STRATEGY",
    report.websiteStrategy,
  );

  const sections = [
    header,
    buildProjectTypeSection(ctx),
    buildBusinessSection(ctx),
    buildObjectivesSection(ctx),
    strategy,
    buildAudienceSection(ctx),
    buildServicesSection(ctx),
    buildSitemapSection(ctx),
    buildHomepageSection(ctx),
    buildBrandSection(ctx),
    buildDesignSection(ctx),
    buildFeatureSection(ctx),
    buildContentSection(ctx),
    buildTrustSection(ctx),
    buildContactSection(ctx),
    buildSEOSection(ctx),
    buildReferencesSection(ctx),
    buildTechnicalRequirementsSection(ctx),
    ...buildBackOfficeSections(project, report, ctx.facts),
    section(
      "DELIVERABLE",
      [
        "The public website:",
        bullets([
          "A complete multi-page website covering every page in the WEBSITE STRUCTURE section.",
          "Real copy for every section, written from the information in this brief.",
          "A consistent component library and design system shared across all pages.",
          "Working forms, navigation and calls to action, each one persisting what it captures.",
          "No content hard-coded in a component that the BACK OFFICE sections say must be editable.",
        ]),
        "",
        "The back office, in the same codebase and deployment:",
        bullets([
          "A password-protected admin at /admin covering every module in the BACK OFFICE - MODULES section.",
          "A database schema with migrations, and a seed script that loads all of the content in this brief so the site is complete and the admin is populated on first launch.",
          "Authentication, roles enforced server-side, and an audit log.",
          "Draft, preview, publish and revision history for content, with published changes appearing on the site without a redeploy.",
          "Setup instructions, a .env.example, and the first owner login.",
        ]),
      ].join("\n"),
    ),
  ];

  return sections.filter(Boolean).join("\n\n---\n\n");
}

/** The human-readable plan, for merchants rather than developers. */
export function generatePlanDocument(
  project: MerchantWebsiteProject,
  report: WebsiteReport,
): string {
  const facts = deriveFacts(project);
  const lines: string[] = [];

  lines.push(`# Website plan - ${facts.name}`);
  lines.push("");
  lines.push(`## Your business`);
  lines.push(report.businessSummary);
  lines.push("");
  lines.push(bullets(report.businessFacts.map((f) => `**${f.label}:** ${f.value}`)));
  lines.push("");
  lines.push(`## Website strategy`);
  lines.push(report.websiteStrategy);
  lines.push("");
  lines.push(`## Recommended pages`);
  lines.push("```");
  lines.push(pageTree(report.sitemap).join("\n"));
  lines.push("```");
  lines.push("");
  lines.push(`## Homepage`);
  report.homepagePlan.forEach((plan, index) => {
    lines.push(`### ${index + 1}. ${plan.title}`);
    lines.push(plan.purpose);
    lines.push(bullets(plan.includes));
    lines.push("");
  });
  lines.push(`## Design direction`);
  lines.push(report.designDirection);
  lines.push("");
  lines.push(`## Features`);
  lines.push(bullets(report.functionality.required));
  if (report.functionality.optional.length) {
    lines.push("");
    lines.push(`### Worth considering later`);
    lines.push(bullets(report.functionality.optional));
  }
  lines.push("");
  lines.push(`## Your back office`);
  lines.push(
    "The website comes with a private admin area you log into, so you can keep the site current without calling a developer. Everything on the site is loaded there and ready to edit from day one, and it works on your phone.",
  );
  lines.push("");
  lines.push("What you will be able to do yourself:");
  lines.push(
    bullets(
      backOfficeModules(project, facts).map((module) => `**${module.title}** - ${module.purpose}`),
    ),
  );
  lines.push("");
  lines.push(`## Getting found`);
  lines.push(report.seoStrategy);
  lines.push("");
  lines.push(bullets(report.searchThemes));
  lines.push("");
  lines.push(`## Content notes`);
  lines.push(bullets(report.contentRecommendations));

  return lines.join("\n");
}
