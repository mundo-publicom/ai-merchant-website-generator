import type {
  HomepageSectionPlan,
  MerchantWebsiteProject,
  WebsitePage,
  WebsiteReport,
} from "@/types/project";
import { industryLabel, industryTraits } from "@/data/industries";
import { CTA_BY_VALUE, labelFor, labelsFor } from "@/data/options";
import { DESIGN_STYLE_BY_VALUE, designStyleLabel } from "@/data/designStyles";
import { featureLabel } from "@/data/features";
import { impliedFeatures, recommendHomepageSections, recommendPages } from "@/services/recommendations";
import {
  bullets,
  formatAddress,
  formatBusinessHours,
  hasAnyHours,
  joinList,
  sentence,
} from "@/utils/formatting";

/** Values derived once and reused across every section of the report. */
export interface ProjectFacts {
  name: string;
  industry: string;
  traits: string[];
  isLocalService: boolean;
  isEmergency: boolean;
  cityLabel: string;
  areaLabel: string;
  address: string;
  primaryService?: string;
  primaryServiceDescription?: string;
  serviceNames: string[];
  primaryGoal: string;
  goals: string[];
  primaryCTA: string;
  primaryCTAValue: string;
  secondaryCTA: string;
  audience: string;
  decisionFactors: string[];
  personality: string[];
  styleLabel: string;
  hasTestimonials: boolean;
  mobileFirst: boolean;
  isRedesign: boolean;
}

export function deriveFacts(project: MerchantWebsiteProject): ProjectFacts {
  const traits = industryTraits(project.business.industry);
  const primary =
    project.services.find((s) => s.id === project.primaryServiceId) ??
    project.services.find((s) => s.priority === "primary") ??
    project.services[0];

  const cta = project.goals.primaryCTA ? CTA_BY_VALUE.get(project.goals.primaryCTA) : undefined;
  const secondary = project.goals.secondaryCTA
    ? CTA_BY_VALUE.get(project.goals.secondaryCTA)
    : undefined;

  const areas = project.location.serviceAreas;
  const city = project.location.city?.trim() ?? "";
  const areaLabel = areas.length
    ? joinList(areas.slice(0, 6))
    : city
      ? `${city}${project.location.state ? `, ${project.location.state}` : ""}`
      : "";

  const isEmergency = traits.includes("emergency");
  const isLocalService =
    traits.includes("local-service") ||
    isEmergency ||
    project.location.servesCustomerLocations === true;

  return {
    name: project.business.name.trim() || "This business",
    industry: industryLabel(project.business.industry) || "Local business",
    traits,
    isLocalService,
    isEmergency,
    cityLabel: city,
    areaLabel,
    address: formatAddress(project.location),
    primaryService: primary?.name,
    primaryServiceDescription: primary?.description,
    serviceNames: project.services.map((s) => s.name).filter(Boolean),
    primaryGoal: project.goals.primaryGoal ? labelFor(project.goals.primaryGoal) : "",
    goals: labelsFor(project.goals.goals),
    primaryCTA: cta?.buttonLabel ?? "Contact Us",
    primaryCTAValue: project.goals.primaryCTA ?? "contact",
    secondaryCTA: resolveSecondaryCTA(
      cta?.buttonLabel ?? "Contact Us",
      secondary?.buttonLabel ?? defaultSecondaryCTA(project),
    ),
    audience: project.audience.description?.trim() ?? "",
    decisionFactors: labelsFor(project.audience.decisionFactors),
    personality: labelsFor(project.branding.personality),
    styleLabel: designStyleLabel(project.design.primaryStyle),
    hasTestimonials: project.trust.testimonials.length > 0,
    mobileFirst:
      isEmergency ||
      isLocalService ||
      project.goals.primaryCTA === "call" ||
      project.goals.primaryCTA === "whatsapp" ||
      project.goals.primaryCTA === "directions",
    isRedesign: project.websiteProjectType === "redesign",
  };
}

function defaultSecondaryCTA(project: MerchantWebsiteProject): string {
  const primary = project.goals.primaryCTA;
  if (!primary) return "";
  if (primary === "call") return "Request a Quote";
  if (primary === "quote" || primary === "contact") return "Call Now";
  if (primary === "book") return "Call Now";
  if (primary === "shop" || primary === "order") return "View Menu";
  return "Contact Us";
}

/** A secondary action identical to the primary one is noise, so it is dropped. */
function resolveSecondaryCTA(primary: string, secondary: string): string {
  return secondary && secondary !== primary ? secondary : "";
}

/* ------------------------------------------------------------------ *
 * Business summary
 * ------------------------------------------------------------------ */

/** How each business stage should be framed in the plan. */
const STAGE_NOTES: Record<string, string> = {
  "just-starting":
    "The business has not opened yet, so the website carries the whole first impression.",
  new: "It is a new business still building recognition, so credibility signals matter more than usual.",
  established: "It is an established business with a reputation the website should lean on.",
  growing: "The business is growing, so the site needs room for new services and locations.",
  rebranding:
    "The business is rebranding, so the site should signal the change clearly rather than echo the old identity.",
  expanding:
    "The business is expanding into new markets, so the structure must scale to new areas without a rebuild.",
};

function buildBusinessSummary(project: MerchantWebsiteProject, facts: ProjectFacts): string {
  const parts: string[] = [];
  const stage = project.business.businessStage ? labelFor(project.business.businessStage) : "";
  const established = project.business.yearEstablished;

  let opener = `${facts.name} is a ${facts.industry.toLowerCase()} business`;
  if (facts.areaLabel) opener += ` serving ${facts.areaLabel}`;
  if (established) opener += `, operating since ${established}`;
  parts.push(sentence(opener));

  if (facts.serviceNames.length) {
    parts.push(
      sentence(
        `The business offers ${joinList(facts.serviceNames.slice(0, 6))}${
          facts.primaryService ? `, led by ${facts.primaryService}` : ""
        }`,
      ),
    );
  }

  if (facts.audience) {
    parts.push(sentence(`Its customers are ${lowerFirst(facts.audience)}`));
  }

  const stageLine = STAGE_NOTES[project.business.businessStage ?? ""];
  if (stageLine) parts.push(stageLine);
  else if (stage) parts.push(sentence(`The business describes itself as ${stage.toLowerCase()}`));

  return parts.join(" ");
}

function lowerFirst(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

/** Ensures exactly one closing full stop, even when the source text already had one. */
function endSentence(value: string): string {
  return `${value.trim().replace(/[.\s]+$/, "")}.`;
}

function buildBusinessFacts(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
): Array<{ label: string; value: string }> {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Business name", value: facts.name },
    { label: "Industry", value: facts.industry },
    {
      label: "Business type",
      value: facts.isLocalService
        ? "Local service business"
        : project.location.customersVisitLocation
          ? "Location-based business"
          : "Service business",
    },
  ];

  if (facts.areaLabel) rows.push({ label: "Service area", value: facts.areaLabel });
  if (facts.address) rows.push({ label: "Address", value: facts.address });
  if (facts.audience) rows.push({ label: "Primary audience", value: facts.audience });
  if (facts.primaryGoal) rows.push({ label: "Primary goal", value: facts.primaryGoal });
  rows.push({ label: "Primary call to action", value: facts.primaryCTA });
  if (facts.secondaryCTA) {
    rows.push({ label: "Secondary call to action", value: facts.secondaryCTA });
  }
  if (facts.primaryService) rows.push({ label: "Lead service", value: facts.primaryService });
  rows.push({
    label: "Project type",
    value: facts.isRedesign ? "Redesign of an existing website" : "New website",
  });

  return rows;
}

/* ------------------------------------------------------------------ *
 * Website strategy
 * ------------------------------------------------------------------ */

function buildWebsiteStrategy(project: MerchantWebsiteProject, facts: ProjectFacts): string {
  const paragraphs: string[] = [];

  const positioning = facts.personality.length
    ? `a ${joinList(facts.personality.slice(0, 3).map((p) => p.toLowerCase()))} ${facts.industry.toLowerCase()} business`
    : `a credible ${facts.industry.toLowerCase()} business`;

  paragraphs.push(
    sentence(
      `The website should position ${facts.name} as ${positioning}${
        facts.areaLabel ? ` serving ${facts.areaLabel}` : ""
      }`,
    ) +
      (facts.primaryGoal
        ? ` Every page should work toward one outcome: ${facts.primaryGoal.toLowerCase()}.`
        : ""),
  );

  if (facts.mobileFirst) {
    paragraphs.push(
      facts.isEmergency
        ? `Design mobile-first. People searching for ${facts.industry.toLowerCase()} help are usually on a phone, often under pressure, and will not read a long homepage. The phone number must be visible without scrolling and reachable from a sticky bar on every screen.`
        : `Design mobile-first. Most visitors will arrive on a phone from a local search, so the primary action needs to sit above the fold and repeat as a sticky control while they scroll.`,
    );
  } else {
    paragraphs.push(
      `Most visitors will arrive with a specific question in mind. Lead each page with a direct answer, then present the "${facts.primaryCTA}" action while the answer is still on screen.`,
    );
  }

  paragraphs.push(
    `The primary conversion action is "${facts.primaryCTA}". It should appear in the header, in the hero, after the services section, and in a final full-width closing block.` +
      (facts.secondaryCTA
        ? ` "${facts.secondaryCTA}" is the fallback for visitors who are not ready to commit.`
        : ""),
  );

  if (facts.decisionFactors.length) {
    paragraphs.push(
      `Customers choose this business on ${joinList(
        facts.decisionFactors.slice(0, 5).map((f) => f.toLowerCase()),
      )}. Those are the exact points the homepage copy should make - in the hero subheading, the "Why choose us" section, and the proof elements - rather than generic claims about quality and service.`,
    );
  }

  const trustLabels = labelsFor(project.trust.trustFactors);
  if (trustLabels.length) {
    paragraphs.push(
      `Trust is carried by ${joinList(trustLabels.slice(0, 6).map((t) => t.toLowerCase()))}. Put a compact strip of these directly beneath the hero so credibility registers before a visitor decides whether to keep reading.`,
    );
  }

  if (project.location.serviceAreas.length > 1) {
    paragraphs.push(
      `Because the business covers ${project.location.serviceAreas.length} areas, the site needs a service-area section on the homepage and a dedicated page per major area. This is the single largest source of local search traffic for businesses of this type.`,
    );
  }

  if (facts.isRedesign) {
    const problems = labelsFor(project.existingWebsite.problems);
    const redesign: string[] = [];
    if (problems.length) {
      redesign.push(`The current site fails on: ${joinList(problems.slice(0, 5))}.`);
    }
    if (project.existingWebsite.preserve?.trim()) {
      redesign.push(endSentence(`Carry over: ${lowerFirst(project.existingWebsite.preserve.trim())}`));
    }
    if (project.existingWebsite.likes?.trim()) {
      redesign.push(
        endSentence(`Keep what already works: ${lowerFirst(project.existingWebsite.likes.trim())}`),
      );
    }
    if (redesign.length) paragraphs.push(redesign.join(" "));
  }

  if (project.competitors.length) {
    const named = project.competitors.map((c) => c.name).filter(Boolean) as string[];
    if (named.length) {
      paragraphs.push(
        `Competitors named by the merchant: ${joinList(named)}. The site should make the difference obvious within the first screen rather than leaving visitors to compare on price alone.`,
      );
    }
  }

  return paragraphs.join("\n\n");
}

/* ------------------------------------------------------------------ *
 * Homepage plan
 * ------------------------------------------------------------------ */

function sectionIncludes(
  title: string,
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
): string[] {
  const key = title.toLowerCase();

  if (key.includes("hero")) {
    const items = [
      `Headline naming the service and the area: e.g. "${heroHeadline(facts)}"`,
      "One supporting sentence covering what makes this business the right choice",
      `Primary button: ${facts.primaryCTA}`,
    ];
    if (facts.secondaryCTA) items.push(`Secondary button: ${facts.secondaryCTA}`);
    if (project.trust.trustFactors.length) {
      items.push(
        `Inline trust line: ${joinList(labelsFor(project.trust.trustFactors).slice(0, 3))}`,
      );
    }
    items.push(
      project.assets.availableAssets.includes("service-photos") ||
        project.assets.availableAssets.includes("professional-photography")
        ? "Real photography of the team or the work, not stock imagery"
        : "A strong background image or brand-coloured panel until real photography exists",
    );
    return items;
  }

  if (key.includes("trust")) {
    const labels = labelsFor(project.trust.trustFactors);
    return labels.length
      ? [
          `A single row of ${Math.min(labels.length, 4)} signals: ${joinList(labels.slice(0, 4))}`,
          "Icons plus short text, no paragraphs",
          "Sticky-free, full width, quiet background so it reads as fact rather than marketing",
        ]
      : ["Years in business, licensing, response time or review rating once available"];
  }

  if (key.includes("service") && !key.includes("area")) {
    return [
      `Cards for each service: ${joinList(facts.serviceNames.slice(0, 6)) || "each service offered"}`,
      "Each card: name, one-line description, starting price if known, link to its page",
      facts.primaryService ? `Give ${facts.primaryService} visual priority` : "Lead with the highest-value service",
    ];
  }

  if (key.includes("product")) {
    return [
      "Four to eight featured products with image, name and price",
      "Link through to the full catalogue",
    ];
  }

  if (key.includes("menu")) {
    return [
      "A handful of signature items with photography",
      "Link to the full menu page",
      "Prices visible without a download",
    ];
  }

  if (key.includes("why")) {
    const factors = facts.decisionFactors.length
      ? facts.decisionFactors.slice(0, 4)
      : ["Experience", "Reliability", "Fair pricing", "Local knowledge"];
    return [
      `Three or four points built from what customers actually care about: ${joinList(factors)}`,
      "Each point stated as a benefit with a concrete detail behind it",
      "No generic claims that any competitor could copy",
    ];
  }

  if (key.includes("how it works")) {
    return [
      `Three or four steps from first contact to finished job (e.g. ${howItWorksSteps(facts).join(" → ")})`,
      "Numbered, short, and reassuring about what happens next",
    ];
  }

  if (key.includes("work") || key.includes("portfolio")) {
    return [
      "Six to nine recent examples with images",
      "Short caption naming the job type and location",
      "Link to the full portfolio",
    ];
  }

  if (key.includes("review") || key.includes("testimonial")) {
    const quotes = project.trust.testimonials
      .filter((t) => t.quote.trim())
      .slice(0, 2)
      .map((t) => `"${t.quote.trim().slice(0, 90)}${t.quote.trim().length > 90 ? "…" : ""}" - ${t.author}`);
    return [
      quotes.length ? `Feature the strongest testimonials: ${quotes.join(" / ")}` : "Three real customer quotes with names",
      "Show star ratings and the source platform",
      "Place immediately before the closing call to action",
    ];
  }

  if (key.includes("area")) {
    return [
      `List every area served: ${joinList(project.location.serviceAreas) || "the areas covered"}`,
      "Link each to its own page",
      "Include a map so visitors confirm coverage at a glance",
    ];
  }

  if (key.includes("visit")) {
    return [
      facts.address ? `Address: ${facts.address}` : "Full address",
      "Embedded map with directions link",
      hasAnyHours(project.businessHours) ? "Opening hours" : "Opening hours once confirmed",
      "Parking or access notes",
    ];
  }

  if (key.includes("team")) {
    return ["Photo, name and role for each team member", "One line of credentials or experience"];
  }

  if (key.includes("faq")) {
    return [
      "Five to eight questions taken from real phone calls",
      "Cover pricing, timing, coverage and what to expect",
      "Accordion layout, expanded first item",
    ];
  }

  if (key.includes("newsletter")) {
    return ["Single email field with a clear reason to subscribe", "No more than one sentence of copy"];
  }

  if (key.includes("final")) {
    return [
      `Full-width block repeating "${facts.primaryCTA}"`,
      "One line restating the main benefit",
      ...(facts.secondaryCTA ? [`Secondary option: ${facts.secondaryCTA}`] : []),
    ];
  }

  if (key.includes("footer")) {
    const items = ["Navigation to every page", "Contact details"];
    if (hasAnyHours(project.businessHours)) items.push("Business hours");
    if (project.location.serviceAreas.length) items.push("Service areas as links");
    if (Object.values(project.contact.social).some(Boolean)) items.push("Social media links");
    items.push("Licensing, copyright and policy links");
    return items;
  }

  return ["Supporting content for this section"];
}

function heroHeadline(facts: ProjectFacts): string {
  const service = facts.primaryService ?? facts.industry;
  if (facts.isEmergency && facts.cityLabel) {
    return `24/7 ${service} in ${facts.cityLabel}`;
  }
  if (facts.cityLabel) return `${service} in ${facts.cityLabel}`;
  return `${service} you can rely on`;
}

function howItWorksSteps(facts: ProjectFacts): string[] {
  if (facts.primaryCTAValue === "call") return ["Call", "We confirm the job", "We arrive", "Job done"];
  if (facts.primaryCTAValue === "book") return ["Choose a time", "Confirm details", "We take care of it"];
  if (facts.primaryCTAValue === "quote") return ["Send details", "Get a quote", "Approve", "We start"];
  if (facts.primaryCTAValue === "order" || facts.primaryCTAValue === "shop")
    return ["Choose", "Checkout", "Delivery or pickup"];
  return ["Get in touch", "We plan the work", "We deliver"];
}

function buildHomepagePlan(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
): HomepageSectionPlan[] {
  // Hand-edited structure wins; otherwise recompute so the plan tracks the latest answers.
  const sections =
    project.content.structureTouched && project.content.homepageSections.length
      ? project.content.homepageSections
      : recommendHomepageSections(project);

  return sections
    .filter((section) => section.enabled)
    .map((section) => ({
      title: section.title,
      purpose: section.purpose,
      includes: sectionIncludes(section.title, project, facts),
    }));
}

/* ------------------------------------------------------------------ *
 * Design direction
 * ------------------------------------------------------------------ */

function buildDesignDirection(project: MerchantWebsiteProject, facts: ProjectFacts): string {
  const style = project.design.primaryStyle
    ? DESIGN_STYLE_BY_VALUE.get(project.design.primaryStyle)
    : undefined;
  const secondary = project.design.secondaryStyle
    ? DESIGN_STYLE_BY_VALUE.get(project.design.secondaryStyle)
    : undefined;

  const paragraphs: string[] = [];

  paragraphs.push(
    style
      ? `${style.label} - ${style.direction}${
          secondary ? ` Borrow from ${secondary.label} where it adds energy: ${lowerFirst(secondary.direction)}` : ""
        }`
      : `Clean, professional and unfussy. Prioritise legibility and obvious next steps over decoration.`,
  );

  if (facts.personality.length) {
    paragraphs.push(
      `The brand should read as ${joinList(facts.personality.map((p) => p.toLowerCase()))}. Every design decision - colour, type weight, photography, spacing - should be checked against those words.`,
    );
  }

  if (project.branding.colors.length) {
    paragraphs.push(
      `Build the palette around the brand colours ${project.branding.colors.join(", ")}. Use the darkest as the primary surface for headers and closing blocks, and reserve the brightest exclusively for calls to action so the eye learns where to click.`,
    );
  } else {
    paragraphs.push(
      `No brand colours exist yet. Choose a deep neutral base with a single high-contrast accent, and use the accent only for calls to action.`,
    );
  }

  paragraphs.push(
    style
      ? `Typography: ${style.typography}`
      : `Typography: a single strong sans-serif family, large headings, comfortable body size of at least 17px on mobile.`,
  );

  const themeLabel = project.design.theme ? labelFor(project.design.theme) : "";
  const densityLabel = project.design.density ? labelFor(project.design.density) : "";
  const cornerLabel = project.design.cornerStyle ? labelFor(project.design.cornerStyle) : "";
  const preferences: string[] = [];
  if (themeLabel && project.design.theme !== "no-preference")
    preferences.push(`${themeLabel.toLowerCase()} theme`);
  if (densityLabel) preferences.push(`${densityLabel.toLowerCase()} density`);
  if (cornerLabel && project.design.cornerStyle !== "no-preference")
    preferences.push(`${cornerLabel.toLowerCase()} corners`);
  if (preferences.length) {
    paragraphs.push(`Merchant preferences: ${joinList(preferences)}.`);
  }

  paragraphs.push(
    `Visual energy sits at ${project.design.energy} out of 100 - ${energyDescription(project.design.energy)}`,
  );

  const photography = project.assets.availableAssets.filter((a) => a !== "none");
  paragraphs.push(
    photography.length
      ? `Photography: the merchant has ${joinList(labelsFor(photography).map((p) => p.toLowerCase()))}. Use real imagery wherever it exists; it outperforms stock for this kind of business.`
      : `Photography: no assets yet. Design layouts that hold up with typography, colour and iconography, and leave clearly marked slots for real photos later.`,
  );

  paragraphs.push(
    `Layout: mobile-first, generous spacing, one idea per section, large tap targets (minimum 44px), and calls to action that never require a visitor to hunt.`,
  );

  return paragraphs.join("\n\n");
}

function energyDescription(energy: number): string {
  if (energy <= 25) return "calm and understated, with slow, minimal motion.";
  if (energy <= 50) return "measured and steady, with restrained motion used only for feedback.";
  if (energy <= 75) return "confident and lively, with purposeful motion on key sections.";
  return "high-energy, with bold contrast and visible movement - kept short so it never blocks the content.";
}

function buildDesignFacts(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
): Array<{ label: string; value: string }> {
  const rows: Array<{ label: string; value: string }> = [];
  if (facts.styleLabel) rows.push({ label: "Primary style", value: facts.styleLabel });
  if (project.design.secondaryStyle) {
    rows.push({ label: "Secondary style", value: designStyleLabel(project.design.secondaryStyle) });
  }
  if (facts.personality.length) {
    rows.push({ label: "Brand personality", value: joinList(facts.personality) });
  }
  if (project.branding.colors.length) {
    rows.push({ label: "Brand colours", value: project.branding.colors.join(", ") });
  }
  if (project.design.theme) rows.push({ label: "Theme", value: labelFor(project.design.theme) });
  if (project.design.density) rows.push({ label: "Density", value: labelFor(project.design.density) });
  if (project.design.cornerStyle) {
    rows.push({ label: "Corners", value: labelFor(project.design.cornerStyle) });
  }
  rows.push({ label: "Visual energy", value: `${project.design.energy} / 100` });
  rows.push({
    label: "Logo",
    value: project.branding.hasLogo ? "Existing logo supplied" : "No logo yet - wordmark required",
  });
  return rows;
}

/* ------------------------------------------------------------------ *
 * Functionality
 * ------------------------------------------------------------------ */

function buildFunctionality(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
): { required: string[]; optional: string[] } {
  const required = new Set<string>([
    "Fully responsive layout, designed mobile-first",
    "Accessible semantic HTML with visible focus states",
    "Fast-loading pages with optimised images",
  ]);

  for (const feature of project.features) required.add(featureLabel(feature));
  for (const feature of impliedFeatures(project)) required.add(featureLabel(feature));

  if (facts.mobileFirst) required.add("Sticky mobile call-to-action bar");
  if (project.contact.phone) required.add(featureLabel("click-to-call"));
  if (hasAnyHours(project.businessHours)) required.add("Business hours displayed in the footer");

  const optional: string[] = [];
  const suggestions: Array<[boolean, string]> = [
    [!project.features.includes("live-chat"), "Live chat for after-hours enquiries"],
    [!project.features.includes("blog"), "Blog for long-term search visibility"],
    [!project.features.includes("newsletter"), "Newsletter capture for visitors who are not ready yet"],
    [
      !project.features.includes("booking") && facts.primaryCTAValue !== "book",
      "Online appointment scheduling",
    ],
    [
      project.trust.testimonials.length === 0,
      "Automated review collection to build social proof",
    ],
  ];
  for (const [condition, label] of suggestions) {
    if (condition) optional.push(label);
  }

  return { required: [...required], optional };
}

/* ------------------------------------------------------------------ *
 * SEO
 * ------------------------------------------------------------------ */

function buildSearchThemes(project: MerchantWebsiteProject, facts: ProjectFacts): string[] {
  const themes = new Set<string>(project.seo.searchTerms.map((t) => t.trim()).filter(Boolean));

  const locations = project.seo.importantLocations.length
    ? project.seo.importantLocations
    : project.location.serviceAreas.length
      ? project.location.serviceAreas
      : facts.cityLabel
        ? [facts.cityLabel]
        : [];

  const services = facts.serviceNames.length ? facts.serviceNames : [facts.industry];

  for (const service of services.slice(0, 4)) {
    for (const location of locations.slice(0, 3)) {
      themes.add(`${service.toLowerCase()} ${location.toLowerCase()}`);
    }
    if (!locations.length) themes.add(service.toLowerCase());
  }

  if (locations.length) {
    themes.add(`${facts.industry.toLowerCase()} near me`);
    themes.add(`best ${facts.industry.toLowerCase()} in ${locations[0].toLowerCase()}`);
  }
  if (facts.isEmergency && locations.length) {
    themes.add(`24 hour ${facts.industry.toLowerCase()} ${locations[0].toLowerCase()}`);
    themes.add(`emergency ${facts.industry.toLowerCase()} ${locations[0].toLowerCase()}`);
  }

  return [...themes].slice(0, 16);
}

function buildLocationPages(project: MerchantWebsiteProject, facts: ProjectFacts): string[] {
  const locations = project.seo.importantLocations.length
    ? project.seo.importantLocations
    : project.location.serviceAreas;
  if (!locations.length || !facts.serviceNames.length) return [];

  const combos: string[] = [];
  for (const service of facts.serviceNames.slice(0, 3)) {
    for (const location of locations.slice(0, 4)) {
      combos.push(`${service} in ${location}`);
    }
  }
  return combos.slice(0, 12);
}

function buildSeoStrategy(project: MerchantWebsiteProject, facts: ProjectFacts): string {
  const paragraphs: string[] = [];
  const channels = labelsFor(project.seo.discoveryChannels).filter((c) => c !== "Not sure");

  paragraphs.push(
    channels.length
      ? `The merchant expects customers to arrive through ${joinList(channels.map((c) => c.toLowerCase()))}. The website should be built to support those channels first.`
      : `Assume most visitors arrive from a search engine with a specific need, so each page must answer one clear question.`,
  );

  if (project.seo.discoveryChannels.includes("google-maps") || facts.isLocalService) {
    paragraphs.push(
      `Local search matters most. Keep the business name, address and phone number identical everywhere they appear, publish the service areas as real pages rather than a list of links, and add LocalBusiness structured data with hours, geography and service types.`,
    );
  }

  paragraphs.push(
    `Give every page a unique title tag in the pattern "Service in Location | ${facts.name}" and a meta description that states the offer and the call to action. Use one H1 per page containing the service and the location.`,
  );

  if (facts.serviceNames.length > 1) {
    paragraphs.push(
      `Build a separate page for each service instead of one combined services page. Search engines and customers both reward specificity, and each page gets its own call to action.`,
    );
  }

  if (project.trust.testimonials.length || project.trust.trustFactors.includes("reviews")) {
    paragraphs.push(
      `Publish reviews as real page content with names and dates, and mark them up so ratings can appear in search results.`,
    );
  }

  paragraphs.push(
    `No ranking outcome can be guaranteed. These are the structural foundations that make good rankings possible.`,
  );

  return paragraphs.join("\n\n");
}

/* ------------------------------------------------------------------ *
 * Content recommendations
 * ------------------------------------------------------------------ */

function buildContentRecommendations(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
): string[] {
  const recommendations: string[] = [];

  recommendations.push(
    `Write in plain, customer-facing language. Say what the business does, where, and what it costs to get started - never "we provide world-class solutions".`,
  );

  if (facts.primaryService) {
    recommendations.push(
      `Give ${facts.primaryService} the most detailed copy on the site. It is the service the business most wants to sell.`,
    );
  }

  if (project.audience.customerProblems?.trim()) {
    recommendations.push(
      `Open the homepage and each service page by naming the problem in the customer's own words: "${project.audience.customerProblems.trim()}"`,
    );
  }

  if (facts.decisionFactors.length) {
    recommendations.push(
      `Make ${joinList(facts.decisionFactors.slice(0, 4).map((f) => f.toLowerCase()))} explicit in the copy - with specifics, not adjectives.`,
    );
  }

  if (project.trust.details?.trim()) {
    recommendations.push(`Use these credentials verbatim where credibility matters: ${project.trust.details.trim()}`);
  }

  const contentLabels = labelsFor(project.content.requiredContent);
  if (contentLabels.length) {
    recommendations.push(`Content the merchant wants covered: ${joinList(contentLabels)}.`);
  }

  if (project.services.some((s) => s.price?.trim())) {
    recommendations.push(
      `Show starting prices where the merchant supplied them. Price transparency filters out poor-fit enquiries before they become phone calls.`,
    );
  }

  recommendations.push(
    `Every page ends with the "${facts.primaryCTA}" action. No page should be a dead end.`,
  );

  if (facts.isRedesign && project.existingWebsite.preserve?.trim()) {
    recommendations.push(
      `Migrate rather than rewrite: ${project.existingWebsite.preserve.trim()}`,
    );
  }

  return recommendations;
}

/* ------------------------------------------------------------------ *
 * Developer brief
 * ------------------------------------------------------------------ */

function flattenPages(pages: WebsitePage[], depth = 0): string[] {
  return pages.flatMap((page) => [
    `${"  ".repeat(depth)}${depth === 0 ? "" : "- "}${page.title}`,
    ...(page.children?.length ? flattenPages(page.children, depth + 1) : []),
  ]);
}

function buildDeveloperBrief(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
  report: Omit<WebsiteReport, "developerBrief">,
): string {
  const lines: string[] = [];

  lines.push(`# Developer brief - ${facts.name}`);
  lines.push("");
  lines.push(`## Project`);
  lines.push(
    facts.isRedesign
      ? `Redesign of ${project.existingWebsite.url || "the existing website"}. Do not reproduce the current design.`
      : `New website. No existing site to migrate.`,
  );
  lines.push(`Industry: ${facts.industry}`);
  if (facts.areaLabel) lines.push(`Market: ${facts.areaLabel}`);
  lines.push(`Primary conversion: ${facts.primaryCTA}`);
  if (facts.secondaryCTA) lines.push(`Secondary conversion: ${facts.secondaryCTA}`);
  lines.push("");

  lines.push(`## Information architecture`);
  lines.push("```");
  lines.push(...flattenPages(report.sitemap));
  lines.push("```");
  lines.push("");

  lines.push(`## Homepage composition`);
  report.homepagePlan.forEach((section, index) => {
    lines.push(`${index + 1}. **${section.title}** - ${section.purpose}`);
    lines.push(bullets(section.includes, "   - "));
  });
  lines.push("");

  lines.push(`## Functional requirements`);
  lines.push(bullets(report.functionality.required));
  if (report.functionality.optional.length) {
    lines.push("");
    lines.push(`### Recommended, not requested`);
    lines.push(bullets(report.functionality.optional));
  }
  lines.push("");

  lines.push(`## Design system`);
  lines.push(bullets(report.designFacts.map((f) => `${f.label}: ${f.value}`)));
  lines.push("");
  lines.push(`## Components to build`);
  lines.push(
    bullets([
      "Site header with persistent primary CTA",
      facts.mobileFirst ? "Sticky mobile action bar (call / message)" : "Sticky header CTA on scroll",
      "Hero block with headline, subheading, dual CTA and trust line",
      "Service card grid, linking to service detail pages",
      "Trust bar (icon + label repeater)",
      "Testimonial card with rating and source",
      "FAQ accordion",
      project.features.includes("google-maps") ? "Map embed with directions link" : "Contact block",
      "Lead form with client-side validation and accessible error messaging",
      "Footer with navigation, hours, areas and social links",
    ]),
  );
  lines.push("");

  lines.push(`## Technical requirements`);
  lines.push(
    bullets([
      "Semantic HTML5 landmarks, one H1 per page, logical heading order",
      "WCAG 2.1 AA contrast; keyboard reachable controls; visible focus rings",
      "Responsive images with width/height set to avoid layout shift",
      "Lighthouse performance target 90+ on mobile",
      "Unique title and meta description per page",
      "LocalBusiness structured data including hours and service area",
      "Forms: server-side validation, spam protection, success and error states",
      "No blocking animation; respect prefers-reduced-motion",
    ]),
  );
  lines.push("");

  lines.push(`## SEO targets`);
  lines.push(bullets(report.searchThemes));
  if (report.locationPages.length) {
    lines.push("");
    lines.push(`### Service + location pages`);
    lines.push(bullets(report.locationPages));
  }
  lines.push("");

  lines.push(`## Content notes`);
  lines.push(bullets(report.contentRecommendations));

  if (hasAnyHours(project.businessHours)) {
    lines.push("");
    lines.push(`## Business hours`);
    lines.push(bullets(formatBusinessHours(project.businessHours)));
  }

  return lines.join("\n");
}

/* ------------------------------------------------------------------ *
 * Entry point
 * ------------------------------------------------------------------ */

export function generateReport(project: MerchantWebsiteProject): WebsiteReport {
  const facts = deriveFacts(project);

  const sitemap =
    project.content.structureTouched && project.content.pages.length
      ? project.content.pages
      : recommendPages(project);
  const homepagePlan = buildHomepagePlan(project, facts);
  const functionality = buildFunctionality(project, facts);
  const searchThemes = buildSearchThemes(project, facts);
  const locationPages = buildLocationPages(project, facts);

  const partial: Omit<WebsiteReport, "developerBrief"> = {
    businessSummary: buildBusinessSummary(project, facts),
    businessFacts: buildBusinessFacts(project, facts),
    websiteStrategy: buildWebsiteStrategy(project, facts),
    sitemap,
    homepagePlan,
    designDirection: buildDesignDirection(project, facts),
    designFacts: buildDesignFacts(project, facts),
    functionality,
    seoStrategy: buildSeoStrategy(project, facts),
    searchThemes,
    locationPages,
    contentRecommendations: buildContentRecommendations(project, facts),
  };

  return { ...partial, developerBrief: buildDeveloperBrief(project, facts, partial) };
}
