import type { MerchantWebsiteProject } from "@/types/project";
import type { StepId } from "@/store/wizardSteps";
import { industryLabel } from "@/data/industries";
import { CTA_BY_VALUE, labelFor, labelsFor, SOCIAL_NETWORKS } from "@/data/options";
import { designStyleLabel } from "@/data/designStyles";
import { featureLabel } from "@/data/features";
import {
  displayUrl,
  formatAddress,
  formatBusinessHours,
  hasAnyHours,
  joinList,
} from "@/utils/formatting";

export interface ReviewRow {
  label: string;
  value: string;
}

export interface ReviewSection {
  title: string;
  step: StepId;
  rows: ReviewRow[];
}

const NOT_SET = "Not provided";

function row(label: string, value: string | undefined | null): ReviewRow | null {
  const trimmed = value?.trim();
  return trimmed ? { label, value: trimmed } : null;
}

function list(label: string, values: string[]): ReviewRow | null {
  return values.length ? { label, value: joinList(values) } : null;
}

function compact(rows: Array<ReviewRow | null>): ReviewRow[] {
  return rows.filter((r): r is ReviewRow => r !== null);
}

export function buildReviewSections(project: MerchantWebsiteProject): ReviewSection[] {
  const sections: ReviewSection[] = [];

  sections.push({
    title: "Website",
    step: "basics",
    rows: compact([
      row(
        "Project",
        project.websiteProjectType === "redesign"
          ? "Redesign an existing website"
          : project.websiteProjectType === "new"
            ? "Build a new website"
            : NOT_SET,
      ),
    ]),
  });

  if (project.websiteProjectType === "redesign") {
    sections.push({
      title: "Current website",
      step: "basics",
      rows: compact([
        row("Address", displayUrl(project.existingWebsite.url)),
        row("Likes", project.existingWebsite.likes),
        row("Dislikes", project.existingWebsite.dislikes),
        list("Problems", labelsFor(project.existingWebsite.problems)),
        row("Preserve", project.existingWebsite.preserve),
      ]),
    });
  }

  sections.push({
    title: "Business",
    step: "basics",
    rows: compact([
      row("Name", project.business.name),
      row("Category", industryLabel(project.business.industry)),
      row("Description", project.business.description),
      row("Established", project.business.yearEstablished),
      row("Locations", project.business.locationCount),
      row(
        "Stage",
        project.business.businessStage ? labelFor(project.business.businessStage) : undefined,
      ),
    ]),
  });

  sections.push({
    title: "Location & service area",
    step: "market",
    rows: compact([
      row("Address", formatAddress(project.location)),
      row(
        "Customers visit",
        project.location.customersVisitLocation === null
          ? undefined
          : project.location.customersVisitLocation
            ? "Yes"
            : "No",
      ),
      row(
        "Travels to customers",
        project.location.servesCustomerLocations === null
          ? undefined
          : project.location.servesCustomerLocations
            ? "Yes"
            : "No",
      ),
      list("Service areas", project.location.serviceAreas),
    ]),
  });

  sections.push({
    title: "Products & services",
    step: "services",
    rows: project.services.length
      ? project.services.map((service) => ({
          label: service.id === project.primaryServiceId ? `${service.name} ★` : service.name,
          value: [service.description, service.price].filter(Boolean).join(" · ") || "-",
        }))
      : [{ label: "Services", value: NOT_SET }],
  });

  sections.push({
    title: "Customers",
    step: "market",
    rows: compact([
      row("Ideal customers", project.audience.description),
      list("Sells to", labelsFor(project.audience.customerType)),
      row(
        "Reach",
        project.audience.geographicReach ? labelFor(project.audience.geographicReach) : undefined,
      ),
      row("Problem solved", project.audience.customerProblems),
      list("Decision factors", labelsFor(project.audience.decisionFactors)),
    ]),
  });

  const cta = project.goals.primaryCTA ? CTA_BY_VALUE.get(project.goals.primaryCTA) : undefined;
  const secondaryCta = project.goals.secondaryCTA
    ? CTA_BY_VALUE.get(project.goals.secondaryCTA)
    : undefined;

  sections.push({
    title: "Goals",
    step: "goals",
    rows: compact([
      list("Goals", labelsFor(project.goals.goals)),
      row("Most important", project.goals.primaryGoal ? labelFor(project.goals.primaryGoal) : undefined),
      row("Primary button", cta?.buttonLabel),
      row("Button destination", project.goals.primaryCTADestination),
      row("Secondary button", secondaryCta?.buttonLabel),
    ]),
  });

  sections.push({
    title: "Branding",
    step: "brand",
    rows: compact([
      row(
        "Logo",
        project.branding.hasLogo === null
          ? undefined
          : project.branding.hasLogo
            ? project.branding.logoPreview
              ? "Uploaded"
              : "Has one, not uploaded"
            : "None yet",
      ),
      list("Colours", project.branding.colors),
      list("Personality", labelsFor(project.branding.personality)),
      list("Available assets", labelsFor(project.assets.availableAssets)),
    ]),
  });

  sections.push({
    title: "Design",
    step: "design",
    rows: compact([
      row("Primary style", designStyleLabel(project.design.primaryStyle) || undefined),
      row("Secondary style", designStyleLabel(project.design.secondaryStyle) || undefined),
      row("Theme", project.design.theme ? labelFor(project.design.theme) : undefined),
      row("Density", project.design.density ? labelFor(project.design.density) : undefined),
      row("Corners", project.design.cornerStyle ? labelFor(project.design.cornerStyle) : undefined),
      row("Visual energy", `${project.design.energy} / 100`),
    ]),
  });

  const inspirationRows = project.inspirationSites
    .filter((site) => site.url.trim())
    .map((site) => ({ label: displayUrl(site.url), value: site.notes?.trim() || "-" }));
  const competitorRows = project.competitors
    .filter((c) => c.name?.trim() || c.url?.trim())
    .map((c) => ({
      label: c.name?.trim() || displayUrl(c.url),
      value: [c.url?.trim() ? displayUrl(c.url) : "", c.notes?.trim()].filter(Boolean).join(" · ") || "-",
    }));

  if (inspirationRows.length || competitorRows.length) {
    sections.push({
      title: "Inspiration & competitors",
      step: "design",
      rows: [...inspirationRows, ...competitorRows],
    });
  }

  sections.push({
    title: "Content",
    step: "features",
    rows: compact([list("Content to include", labelsFor(project.content.requiredContent))]),
  });

  sections.push({
    title: "Pages & homepage",
    step: "structure",
    rows: compact([
      list("Pages", project.content.pages.map((page) => page.title)),
      list(
        "Homepage sections",
        project.content.homepageSections.filter((s) => s.enabled).map((s) => s.title),
      ),
    ]),
  });

  sections.push({
    title: "Features",
    step: "features",
    rows: compact([list("Selected", project.features.map(featureLabel))]),
  });

  const social = SOCIAL_NETWORKS.map(({ key, label }) =>
    project.contact.social[key]?.trim() ? `${label}` : "",
  ).filter(Boolean);

  sections.push({
    title: "Contact & hours",
    step: "contact",
    rows: compact([
      row("Phone", project.contact.phone),
      row("Secondary phone", project.contact.secondaryPhone),
      row("Email", project.contact.email),
      row("WhatsApp", project.contact.whatsapp),
      list("Social", social),
      hasAnyHours(project.businessHours)
        ? { label: "Hours", value: formatBusinessHours(project.businessHours).join(" · ") }
        : null,
    ]),
  });

  sections.push({
    title: "Trust & proof",
    step: "contact",
    rows: compact([
      list("Trust signals", labelsFor(project.trust.trustFactors)),
      row("Details", project.trust.details),
      project.trust.testimonials.length
        ? { label: "Testimonials", value: `${project.trust.testimonials.length} added` }
        : null,
    ]),
  });

  sections.push({
    title: "Getting found",
    step: "goals",
    rows: compact([
      list("Channels", labelsFor(project.seo.discoveryChannels)),
      list("Search terms", project.seo.searchTerms),
      list("Key locations", project.seo.importantLocations),
    ]),
  });

  return sections.filter((section) => section.rows.length > 0);
}
