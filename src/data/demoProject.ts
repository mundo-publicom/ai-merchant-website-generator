import type { MerchantWebsiteProject } from "@/types/project";
import { createEmptyProject } from "@/data/emptyProject";
import { recommendHomepageSections, recommendPages } from "@/services/recommendations";

/** Fully populated example used by "Try with an example business" on the landing page. */
export function demoProject(): MerchantWebsiteProject {
  const base = createEmptyProject();

  const project: MerchantWebsiteProject = {
    ...base,
    websiteProjectType: "redesign",
    existingWebsite: {
      url: "https://miamiprolocksmith.com",
      likes: "The logo and our five-star Google reviews are on the homepage.",
      dislikes:
        "It looks like it was built ten years ago and the phone number is hard to find on a phone.",
      problems: [
        "outdated-design",
        "not-mobile",
        "few-leads",
        "hard-to-contact",
        "poor-seo",
      ],
      preserve: "The logo, our review screenshots, and the existing service descriptions.",
    },
    business: {
      name: "Miami Pro Locksmith",
      industry: "locksmith",
      description:
        "We are a family-owned locksmith company serving Miami-Dade since 2009. We handle emergency lockouts, rekeys, lock installation and commercial access control, with technicians on the road 24 hours a day.",
      yearEstablished: "2009",
      locationCount: "1",
      businessStage: "established",
    },
    location: {
      address: "1450 NW 27th Ave",
      city: "Miami",
      state: "FL",
      postalCode: "33125",
      country: "United States",
      customersVisitLocation: false,
      servesCustomerLocations: true,
      serviceAreas: [
        "Miami",
        "Miami Beach",
        "Coral Gables",
        "Hialeah",
        "Doral",
        "Kendall",
      ],
    },
    services: [
      {
        id: "svc_emergency",
        name: "Emergency Lockout Service",
        description:
          "24/7 response for home, car and business lockouts, usually on site within 30 minutes.",
        price: "From $99",
        priority: "primary",
      },
      {
        id: "svc_residential",
        name: "Residential Locksmith",
        description: "Rekeys, deadbolt installation, smart locks and post-move-in security checks.",
        price: "From $79",
        priority: "primary",
      },
      {
        id: "svc_commercial",
        name: "Commercial Locksmith",
        description:
          "Master key systems, access control, panic bars and scheduled maintenance for offices and retail.",
        price: "Quoted per job",
        priority: "secondary",
      },
      {
        id: "svc_automotive",
        name: "Automotive Locksmith",
        description: "Car key replacement, key fob programming and ignition repair on site.",
        price: "From $129",
        priority: "secondary",
      },
    ],
    primaryServiceId: "svc_emergency",
    audience: {
      description:
        "Homeowners and renters in Miami-Dade, drivers locked out of their cars, and property managers who need a locksmith they can call repeatedly.",
      customerType: ["both"],
      geographicReach: "regional",
      customerProblems:
        "They are locked out right now and stressed, or they just moved in and do not trust the existing locks.",
      decisionFactors: ["speed", "availability", "trust", "reputation", "price"],
    },
    goals: {
      goals: [
        "phone-calls",
        "generate-leads",
        "local-visibility",
        "build-credibility",
        "quote-requests",
        "whatsapp",
      ],
      primaryGoal: "phone-calls",
      primaryCTA: "call",
      primaryCTADestination: "(305) 555-0142",
      secondaryCTA: "quote",
    },
    branding: {
      hasLogo: true,
      colors: ["#12224a", "#f5a623", "#ffffff"],
      personality: ["trustworthy", "professional", "local", "bold"],
    },
    design: {
      primaryStyle: "professional-corporate",
      secondaryStyle: "bold-contemporary",
      theme: "mixed",
      density: "balanced",
      cornerStyle: "slightly-rounded",
      energy: 65,
    },
    inspirationSites: [
      {
        id: "insp_1",
        url: "https://www.mrrooter.com",
        notes: "The phone number stays visible the whole time you scroll.",
      },
      {
        id: "insp_2",
        url: "https://www.aptive.com",
        notes: "Clean service cards and the reviews look real rather than stock.",
      },
    ],
    competitors: [
      {
        id: "comp_1",
        name: "Sunshine Lock & Key",
        url: "https://example-sunshine-lock.com",
        notes: "Ranks first for 'locksmith Miami' but their site is slow.",
      },
      {
        id: "comp_2",
        name: "A-1 Locksmith Miami",
        url: "",
        notes: "Cheaper pricing, but no real reviews and no license number shown.",
      },
    ],
    content: {
      requiredContent: [
        "business-overview",
        "services",
        "pricing",
        "testimonials",
        "reviews",
        "faq",
        "about",
        "contact",
        "certifications",
      ],
      pages: [],
      homepageSections: [],
      structureTouched: false,
    },
    features: [
      "click-to-call",
      "quote-form",
      "whatsapp",
      "google-maps",
      "reviews",
      "testimonials",
      "faq",
      "gallery",
      "contact-form",
    ],
    contact: {
      phone: "(305) 555-0142",
      secondaryPhone: "(305) 555-0188",
      email: "dispatch@miamiprolocksmith.com",
      whatsapp: "+1 305 555 0142",
      social: {
        facebook: "facebook.com/miamiprolocksmith",
        instagram: "instagram.com/miamiprolocksmith",
      },
    },
    businessHours: {
      open24: true,
      days: base.businessHours.days,
      note: "Emergency dispatch never closes. Office visits by appointment.",
    },
    trust: {
      trustFactors: [
        "years-in-business",
        "licensed",
        "insured",
        "reviews",
        "guarantees",
        "family-owned",
        "background-checked",
        "customers-served",
      ],
      details:
        "Licensed (FL DABT #B2900123), fully insured, over 14,000 jobs completed since 2009, 4.9 stars across 680+ Google reviews, and every technician is background-checked.",
      testimonials: [
        {
          id: "tst_1",
          author: "Daniela R.",
          quote:
            "Locked out at 1am with my kid in the car. They answered immediately and had me back in the car in 25 minutes.",
          rating: 5,
          source: "Google",
        },
        {
          id: "tst_2",
          author: "Marcus T., property manager",
          quote:
            "We use them across eleven buildings. Fast, fairly priced, and the invoicing is clean.",
          rating: 5,
          source: "Google",
        },
      ],
    },
    assets: {
      availableAssets: ["logo", "team-photos", "service-photos", "before-after-photos"],
      uploads: [],
    },
    seo: {
      discoveryChannels: ["google-search", "google-maps", "referrals"],
      searchTerms: [
        "emergency locksmith Miami",
        "car locksmith near me",
        "24 hour locksmith Miami",
        "rekey locks Miami",
        "commercial locksmith Miami",
        "locked out of house Miami",
      ],
      importantLocations: ["Miami", "Miami Beach", "Coral Gables", "Hialeah", "Doral"],
    },
  };

  return {
    ...project,
    content: {
      ...project.content,
      pages: recommendPages(project),
      homepageSections: recommendHomepageSections(project),
    },
  };
}
