import { z } from "zod";
import type { MerchantWebsiteProject } from "@/types/project";
import type { StepId } from "@/store/wizardSteps";
import { CTA_BY_VALUE, type CTAChoice } from "@/data/options";

const optionalString = z.string().trim().optional();

/** Accepts "example.com" as well as a fully qualified URL. */
export const looseUrl = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (!value) return true;
      const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
      try {
        const url = new URL(candidate);
        return url.hostname.includes(".") && !url.hostname.endsWith(".");
      } catch {
        return false;
      }
    },
    { message: "Enter a valid website address, for example example.com" },
  );

export const emailSchema = z
  .string()
  .trim()
  .refine((value) => !value || z.string().email().safeParse(value).success, {
    message: "Enter a valid email address",
  });

export const phoneSchema = z
  .string()
  .trim()
  .refine((value) => !value || /^[+()\d][\d\s().+-]{5,}$/.test(value), {
    message: "Enter a valid phone number",
  });

export const businessSchema = z.object({
  name: z.string().trim().min(2, "Please enter your business name"),
  industry: z.string().trim().min(1, "Choose the closest category"),
  description: z
    .string()
    .trim()
    .min(20, "A sentence or two helps us write much better content"),
  yearEstablished: optionalString,
  locationCount: optionalString,
  businessStage: optionalString,
});

export const existingWebsiteSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "We need your current website address")
    .superRefine((value, ctx) => {
      const result = looseUrl.safeParse(value);
      if (!result.success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: result.error.issues[0].message });
      }
    }),
  likes: optionalString,
  dislikes: optionalString,
  preserve: optionalString,
});

export const serviceSchema = z.object({
  name: z.string().trim().min(2, "Give this service a name"),
  description: optionalString,
  price: optionalString,
});

export const testimonialSchema = z.object({
  author: z.string().trim().min(1, "Who said it?"),
  quote: z.string().trim().min(10, "Add the testimonial text"),
});

export type StepErrors = Partial<Record<string, string>>;

/** Copies a failed parse onto the step's error map, one message per field. */
function collect(errors: StepErrors, result: z.SafeParseReturnType<unknown, unknown>): void {
  if (result.success) return;
  for (const issue of result.error.issues) {
    const key = String(issue.path[0]);
    errors[key] ??= issue.message;
  }
}

type DestinationField = CTAChoice["destinationField"];

function validateCtaDestination(
  field: DestinationField,
  destination: string,
): string | undefined {
  switch (field) {
    case "phone":
      if (!destination) return "We need the number the button should dial";
      return phoneSchema.safeParse(destination).success ? undefined : "Enter a valid phone number";
    case "whatsapp":
      if (!destination) return "We need the WhatsApp number";
      return phoneSchema.safeParse(destination).success ? undefined : "Enter a valid phone number";
    case "email":
      if (!destination) return undefined;
      return emailSchema.safeParse(destination).success ? undefined : "Enter a valid email address";
    case "url":
      if (!destination) return undefined;
      return looseUrl.safeParse(destination).success ? undefined : "Enter a valid link";
    default:
      return undefined;
  }
}

/**
 * Validates one wizard step. Only genuinely required information blocks progress -
 * everything optional stays optional so merchants are never stuck.
 */
export function validateStep(
  stepId: StepId,
  project: MerchantWebsiteProject,
): StepErrors {
  const errors: StepErrors = {};

  switch (stepId) {
    case "basics": {
      if (!project.websiteProjectType) {
        errors.websiteProjectType = "Choose one to continue";
      }
      if (project.websiteProjectType === "redesign") {
        collect(
          errors,
          existingWebsiteSchema.safeParse({
            ...project.existingWebsite,
            url: project.existingWebsite.url ?? "",
          }),
        );
      }
      collect(errors, businessSchema.safeParse(project.business));
      break;
    }

    case "market": {
      if (project.location.customersVisitLocation === null) {
        errors.customersVisitLocation = "Let us know so we can plan the right pages";
      }
      if (project.location.servesCustomerLocations === null) {
        errors.servesCustomerLocations = "Let us know so we can plan the right pages";
      }
      if (
        project.location.servesCustomerLocations === true &&
        project.location.serviceAreas.length === 0
      ) {
        errors.serviceAreas = "Add at least one city or area you serve";
      }
      if (project.location.customersVisitLocation === true && !project.location.city?.trim()) {
        errors.city = "Add the city so we can build your location page";
      }
      break;
    }

    case "services": {
      if (project.services.length === 0) {
        errors.services = "Add at least one product or service";
        break;
      }
      if (project.services.some((service) => service.name.trim().length < 2)) {
        errors.services = "Every item needs a name";
      }
      break;
    }

    case "goals": {
      if (project.goals.goals.length === 0) {
        errors.goals = "Choose at least one goal";
      }
      if (!project.goals.primaryGoal) {
        errors.primaryGoal = "Pick the single most important goal";
      }

      if (!project.goals.primaryCTA) {
        errors.primaryCTA = "Choose the main action for visitors";
        break;
      }

      const cta = CTA_BY_VALUE.get(project.goals.primaryCTA);
      const destination = project.goals.primaryCTADestination?.trim() ?? "";
      const destinationError = validateCtaDestination(cta?.destinationField, destination);
      if (destinationError) errors.primaryCTADestination = destinationError;
      break;
    }

    case "design": {
      const badReference = project.inspirationSites.find(
        (site) => site.url.trim() && !looseUrl.safeParse(site.url).success,
      );
      if (badReference) {
        errors.inspirationSites = "One of the links is not a valid website address";
      }
      const badCompetitor = project.competitors.find(
        (competitor) => competitor.url?.trim() && !looseUrl.safeParse(competitor.url).success,
      );
      if (badCompetitor) errors.competitors = "One of the competitor links is not valid";
      break;
    }

    case "contact": {
      const { phone, email, whatsapp, secondaryPhone } = project.contact;
      if (!phone?.trim() && !email?.trim() && !whatsapp?.trim()) {
        errors.contact = "Add at least one way for customers to reach you";
      }
      if (phone && !phoneSchema.safeParse(phone).success) {
        errors.phone = "Enter a valid phone number";
      }
      if (secondaryPhone && !phoneSchema.safeParse(secondaryPhone).success) {
        errors.secondaryPhone = "Enter a valid phone number";
      }
      if (email && !emailSchema.safeParse(email).success) {
        errors.email = "Enter a valid email address";
      }

      const incomplete = project.trust.testimonials.find(
        (testimonial) =>
          (testimonial.author.trim() || testimonial.quote.trim()) &&
          !testimonialSchema.safeParse(testimonial).success,
      );
      if (incomplete) errors.testimonials = "Finish or remove the incomplete testimonial";
      break;
    }

    // brand, features, structure and review hold nothing that can be answered
    // wrongly, so they never block progress.
    default:
      break;
  }

  return errors;
}

export function hasErrors(errors: StepErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Everything the report generator needs before it can produce a useful plan. */
export function isProjectReadyForReport(project: MerchantWebsiteProject): boolean {
  return (
    Boolean(project.websiteProjectType) &&
    businessSchema.safeParse(project.business).success &&
    project.services.length > 0 &&
    project.goals.goals.length > 0
  );
}
