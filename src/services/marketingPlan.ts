import type { MerchantWebsiteProject, WebsiteReport } from "@/types/project";
import type { ProjectFacts } from "@/services/reportGenerator";
import { impliedFeatures } from "@/services/recommendations";
import { labelFor, labelsFor } from "@/data/options";
import { bullets, joinList, numbered, promptSection as section } from "@/utils/formatting";

/**
 * The marketing plan that ships with the website.
 *
 * Nothing here is generic advice: the business model is inferred from the answers the
 * merchant already gave - industry traits, services, goals, call to action, audience,
 * discovery channels and features - and every channel, offer and metric below is chosen
 * from that model. The prompt sections it produces are appended to the generation prompt
 * so the site and the back office are built to execute the plan, not just to describe it.
 *
 * Free of React and of browser APIs, like the other services in this folder.
 */

/* ------------------------------------------------------------------ *
 * Business model
 * ------------------------------------------------------------------ */

export type BusinessModelKey =
  | "emergency"
  | "quote"
  | "appointment"
  | "hospitality"
  | "retail"
  | "professional"
  | "project"
  | "local-service"
  | "general";

export interface BusinessModel {
  key: BusinessModelKey;
  /** How the business makes money, in one line. */
  label: string;
  /** How demand actually arises for this kind of business. */
  demand: string;
  buyingCycle: string;
  unitOfSale: string;
  /** The one thing marketing has to do for this model to work. */
  emphasis: string;
  /** Offers that fit the model, ranked. */
  offers: string[];
  /** The operating rhythm the owner should keep after launch. */
  cadence: string[];
}

/** The opening sentence of a two-sentence description, for use inside a longer line. */
function firstSentence(value: string): string {
  const [first] = value.split(/(?<=\.)\s+/);
  return (first ?? value).replace(/\.$/, "");
}

function activeFeatures(project: MerchantWebsiteProject): Set<string> {
  return new Set([...project.features, ...impliedFeatures(project)]);
}

/** The revenue logic behind each model, written for whoever builds the site. */
const MODELS: Record<BusinessModelKey, Omit<BusinessModel, "key">> = {
  emergency: {
    label: "Urgent, unplanned demand - the customer has a problem right now",
    demand:
      "Nobody plans this purchase. Demand appears the moment something breaks, and the customer picks whoever answers first and looks trustworthy enough to let into their home or business.",
    buyingCycle: "Minutes to hours. The decision is made on a phone, usually on the first or second search result.",
    unitOfSale: "One call-out, priced per job, with repeat and referral value afterwards.",
    emphasis:
      "Be findable and callable in under ten seconds. Speed of response beats every other marketing lever, and marketing spend is wasted if the phone is not answered.",
    offers: [
      "Same-day or emergency response with a stated arrival window",
      "Transparent call-out fee published up front so price is not a reason to hesitate",
      "Free phone diagnosis before any commitment",
    ],
    cadence: [
      "Answer every call within three rings during stated hours, and return every missed call within fifteen minutes.",
      "Ask for a review the same day the job is finished, while the relief is fresh.",
      "Check the Google Business Profile weekly for questions, photos and new reviews.",
    ],
  },
  quote: {
    label: "Considered purchase sold by quote - the customer compares two or three providers",
    demand:
      "The customer researches, shortlists and asks several providers for a price. The provider who makes the enquiry easiest and the quote clearest usually wins, not the cheapest.",
    buyingCycle: "Days to weeks, with two or three providers contacted in the same afternoon.",
    unitOfSale: "One quoted job, won or lost against named competitors.",
    emphasis:
      "Win the shortlist, then win the follow-up. The site must make requesting a quote effortless and the business must respond faster than the competitors on the same shortlist.",
    offers: [
      "Free, no-obligation quote with a stated turnaround time",
      "A published price range or starting price so the enquiry is qualified before it arrives",
      "A written scope and a fixed price rather than an hourly estimate",
    ],
    cadence: [
      "Respond to every quote request the same working day, and log the response time.",
      "Follow up every unanswered quote twice: once after two days, once after a week.",
      "Record why each lost quote was lost, and review the reasons monthly.",
    ],
  },
  appointment: {
    label: "Appointment-led service - revenue is capacity sold by the hour or by the slot",
    demand:
      "Customers choose on convenience, availability and trust in the individual who will serve them. An empty slot is revenue that cannot be recovered later.",
    buyingCycle: "Hours to days for a first booking, then habitual once the customer has been in once.",
    unitOfSale: "One appointment, worth far more than its own price because of repeat visits.",
    emphasis:
      "Fill the calendar and keep it full. Marketing is a matter of removing friction from the first booking and then earning the second one automatically.",
    offers: [
      "First-visit offer for new customers, redeemable only through the website",
      "Book online in under a minute, with real availability shown",
      "A rebooking prompt at the end of every visit",
    ],
    cadence: [
      "Review next week's calendar every Monday and market against the gaps, not against a fixed schedule.",
      "Send a reminder before every appointment and a thank-you with a review request after it.",
      "Contact customers who have not returned within their usual interval.",
    ],
  },
  hospitality: {
    label: "Walk-in and repeat trade - revenue is footfall multiplied by frequency",
    demand:
      "The decision is made close to the moment of consumption, usually on a phone, usually within a few streets. Photography, hours, location and recent activity decide it.",
    buyingCycle: "Minutes. The customer is deciding where to go now or later today.",
    unitOfSale: "One visit at an average spend, repeated as often as the business can earn it.",
    emphasis:
      "Own the local map and the visual feed. Correct hours, current photos and a menu that loads instantly matter more than any long-form content.",
    offers: [
      "A reason to come this week: a special, an event, a new item",
      "A loyalty or returning-customer incentive collected by email",
      "A group, family or corporate option with a clear enquiry route",
    ],
    cadence: [
      "Post to the Google Business Profile and to social weekly, with real photos from the business.",
      "Keep hours, holiday closures and the menu accurate the same day they change.",
      "Reply to every review, good or bad, within 48 hours.",
    ],
  },
  retail: {
    label: "Product sales - revenue is transactions multiplied by average order value",
    demand:
      "Customers arrive with either a specific product in mind or a browsing intent. Most do not buy on the first visit, so the second visit has to be earned deliberately.",
    buyingCycle: "One session for low-value items, several sessions and a saved cart for anything considered.",
    unitOfSale: "One order, with margin improved by basket size and repeat purchase.",
    emphasis:
      "Capture the first visit even when it does not convert - email, saved cart or a follow. Then earn the repeat purchase, which costs a fraction of the first one.",
    offers: [
      "A first-order incentive in exchange for an email address",
      "Free or flat-rate delivery above a stated threshold",
      "Bundles that raise average order value without discounting the lead product",
    ],
    cadence: [
      "Email the list at least twice a month with something genuinely useful, not only discounts.",
      "Review the products that get views but no orders, and fix the copy or the photography.",
      "Recover abandoned carts automatically, and measure how many come back.",
    ],
  },
  professional: {
    label: "Expertise sold on trust - a high-value engagement chosen slowly",
    demand:
      "The customer is buying judgement, and cannot evaluate it directly. They rely on credentials, proof of similar work and personal referral, and they research quietly before making contact.",
    buyingCycle: "Weeks to months, with most of the research done anonymously before the first contact.",
    unitOfSale: "One engagement or retained relationship, worth many times a single transaction.",
    emphasis:
      "Be the most credible option the moment they are ready to talk. Publish proof, make the low-commitment first step obvious, and stay visible in the meantime.",
    offers: [
      "A free consultation or case review with a clearly bounded scope",
      "A downloadable guide, checklist or template that demonstrates competence and captures an email",
      "A named contact, published response time and a straightforward first meeting",
    ],
    cadence: [
      "Publish one substantial piece of expertise a month, written for the client's question rather than for a search engine.",
      "Ask satisfied clients for a referral or a testimonial at the natural end of an engagement.",
      "Keep a monthly touchpoint with past clients and referrers who send work.",
    ],
  },
  project: {
    label: "Project work sold on demonstrated craft - the portfolio does the selling",
    demand:
      "Customers buy what they can see. They compare finished work, judge whether it matches their taste and their budget, and enquire once one example convinces them.",
    buyingCycle: "Weeks, with a long visual comparison phase and a shortlist of two or three.",
    unitOfSale: "One project, priced individually, with a long referral tail.",
    emphasis:
      "Turn finished work into marketing assets on the day it is finished. A project that is never photographed and published has half its value.",
    offers: [
      "A free consultation or site visit before any commitment",
      "Published project ranges so enquiries arrive pre-qualified on budget",
      "A process walkthrough that removes the fear of a long, disruptive job",
    ],
    cadence: [
      "Photograph every completed project, publish it as a case study, and post it to the channels below.",
      "Ask for the review and the referral while the customer is still delighted with the finished work.",
      "Keep the portfolio pruned to the work the business wants more of.",
    ],
  },
  "local-service": {
    label: "Local service business - revenue comes from a defined geographic area",
    demand:
      "Customers search for the service plus their area, choose from the first handful of credible results, and value reliability over novelty.",
    buyingCycle: "Hours to days, usually resolved with a single phone call or form.",
    unitOfSale: "One job, with strong repeat and neighbourhood referral value.",
    emphasis:
      "Dominate the area the business actually serves rather than competing everywhere. Depth in a few places beats a thin presence across many.",
    offers: [
      "A free quote or assessment with a stated response time",
      "A first-time customer offer valid in the service area",
      "A maintenance or seasonal plan that converts one job into a recurring relationship",
    ],
    cadence: [
      "Keep the Google Business Profile current: photos, hours, services and posts.",
      "Ask every satisfied customer for a review, by text or email, the day the job closes.",
      "Review which areas produce enquiries each month and concentrate effort there.",
    ],
  },
  general: {
    label: "Enquiry-led business - revenue starts with a conversation",
    demand:
      "Customers arrive with a need, weigh up whether this business is credible and easy to deal with, and get in touch when the answer is obvious.",
    buyingCycle: "Days, with a short comparison against one or two alternatives.",
    unitOfSale: "One customer relationship, beginning with a single enquiry.",
    emphasis:
      "Make the offer specific and the next step unmistakable. Vagueness, not competition, is what loses most enquiries.",
    offers: [
      "A clear, low-commitment first step with a stated response time",
      "A published starting price or price range",
      "Something useful given away in exchange for an email address",
    ],
    cadence: [
      "Reply to every enquiry the same working day.",
      "Publish one update a month so the site is visibly alive.",
      "Ask every happy customer for a review or a referral.",
    ],
  },
};

/** Reads the business model out of the answers the merchant already gave. */
export function deriveBusinessModel(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
): BusinessModel {
  const key = modelKey(project, facts);
  return { key, ...MODELS[key] };
}

/** Precedence matters: the earlier tests describe how the money actually arrives. */
function modelKey(project: MerchantWebsiteProject, facts: ProjectFacts): BusinessModelKey {
  const features = activeFeatures(project);
  const cta = facts.primaryCTAValue;
  const traits = facts.traits;

  if (facts.isEmergency) return "emergency";
  if (traits.includes("menu") || traits.includes("hospitality")) return "hospitality";
  if (traits.includes("ecommerce") || features.has("ecommerce") || features.has("online-ordering"))
    return "retail";
  if (traits.includes("professional")) return "professional";
  if (cta === "quote") return "quote";
  if (traits.includes("booking") || features.has("booking") || cta === "book") return "appointment";
  if (features.has("quote-form")) return "quote";
  if (traits.includes("portfolio")) return "project";
  if (facts.isLocalService) return "local-service";
  return "general";
}

/* ------------------------------------------------------------------ *
 * Channels
 * ------------------------------------------------------------------ */

export interface MarketingChannel {
  name: string;
  /** Why this channel, for this business, ahead of the others. */
  role: string;
  actions: string[];
  /** Where the traffic must land on the new site. */
  destination: string;
}

interface ScoredChannel extends MarketingChannel {
  score: number;
}

function channelCatalogue(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
  model: BusinessModel,
): ScoredChannel[] {
  const features = activeFeatures(project);
  const channels = new Set(project.seo.discoveryChannels);
  const b2b =
    project.audience.customerType.includes("businesses") ||
    project.audience.customerType.includes("both");
  const visual =
    facts.traits.includes("portfolio") ||
    facts.traits.includes("hospitality") ||
    project.assets.availableAssets.some((asset) =>
      ["professional-photography", "product-photos", "service-photos", "before-after-photos", "videos"].includes(asset),
    );
  const area = facts.areaLabel || facts.cityLabel;
  const lead = facts.primaryService ?? facts.industry;
  const social = project.contact.social;

  const locationsCovered = project.seo.importantLocations.length
    ? project.seo.importantLocations
    : project.location.serviceAreas;

  return [
    {
      score:
        (facts.isLocalService || project.location.customersVisitLocation ? 6 : 1) +
        (channels.has("google-maps") ? 3 : 0) +
        (area ? 2 : 0) +
        (model.key === "hospitality" || model.key === "emergency" ? 2 : 0),
      name: "Google Business Profile",
      role: `The highest-intent free channel this business has${area ? `: people searching in ${area} with the intent to buy today` : ""}. For most local searches it is seen before the website is.`,
      actions: [
        "Claim and fully complete the profile: categories, services, service area, hours, holiday hours, description and contact details, all identical to the website.",
        facts.serviceNames.length
          ? `List every service as its own entry - ${joinList(facts.serviceNames.slice(0, 6))} - each linking to its own page on the site.`
          : "List every service as its own entry, each linking to its own page on the site.",
        "Add at least ten real photographs and replace or add to them monthly.",
        "Post weekly: an offer, a completed job, an update or an answer to a common question.",
        "Reply to every review within 48 hours, and answer questions in the Q&A section before customers have to ask.",
      ],
      destination: "The service page that matches the search, never the homepage.",
    },
    {
      score:
        (channels.has("google-search") ? 4 : 2) +
        (locationsCovered.length ? 4 : 0) +
        (facts.serviceNames.length > 1 ? 2 : 0) +
        (model.key === "professional" || model.key === "project" ? 1 : 0),
      name: "Local and service search (organic)",
      role: `The website's own compounding channel: one page per service${locationsCovered.length ? ", and one per service and area combination" : ""}, each answering a single search with a single call to action.`,
      actions: [
        "Publish the service and location pages listed in the SEO section, each with genuinely different copy - never one template with the place name swapped.",
        "Answer the questions customers actually ask on the page where they ask them, not only on an FAQ page.",
        "Keep the LocalBusiness structured data, the name, address and phone number and the hours consistent everywhere.",
        "Add a new page only when there is something real to say on it. Three strong pages beat thirty thin ones.",
      ],
      destination: "The matching service or location page, with the primary call to action above the fold.",
    },
    {
      score: 4 + (facts.hasTestimonials ? 1 : 3) + (project.trust.trustFactors.includes("reviews") ? 2 : 0),
      name: "Reviews and reputation",
      role: "The cheapest lever available: review count and recency change conversion on every other channel at once, including paid.",
      actions: [
        "Ask every satisfied customer the day the work is finished, by the channel they already use to talk to the business.",
        "Send one link that goes straight to the review form. Every extra tap loses reviews.",
        "Aim for a steady trickle rather than a burst - recency counts for more than total volume.",
        "Reply to every review. A calm, specific reply to a bad one sells better than a wall of perfect scores.",
        "Publish the best reviews on the site as real page content with names and dates, marked up for rich results.",
      ],
      destination: "The review request goes out from the back office; the published reviews live on the site.",
    },
    {
      score:
        (channels.has("advertising") ? 4 : 0) +
        (model.key === "emergency" ? 5 : model.key === "quote" ? 3 : 1) +
        (project.goals.goals.includes("generate-leads") || project.goals.goals.includes("quote-requests") ? 2 : 0),
      name: "Paid search",
      role:
        model.key === "emergency"
          ? "The only channel that buys the top of the page at the exact minute an emergency happens. Expensive per click, and worth it when the phone is answered."
          : "Buys demand that already exists while the organic pages are still maturing. Turn it off when it stops paying for itself, not when the budget runs out.",
      actions: [
        `Start with one campaign on the highest-intent terms only${area ? `, geo-fenced to ${area}` : ""}. Do not advertise broad category terms.`,
        `Send every ad to the page for that exact service - ${lead} ads go to the ${lead} page - never to the homepage.`,
        "Add call extensions and, where hours are limited, schedule ads to the hours the phone is actually answered.",
        "Track cost per enquiry, not cost per click, and pause anything that has spent the price of two jobs without producing one.",
      ],
      destination: "A dedicated landing page per campaign, with the campaign's offer in the headline.",
    },
    {
      score:
        (visual ? 4 : 0) +
        (channels.has("social-media") ? 3 : 0) +
        (social.instagram || social.tiktok || social.facebook ? 2 : 0) +
        (model.key === "hospitality" || model.key === "project" ? 3 : 0),
      name: "Visual social (Instagram, Facebook, TikTok)",
      role: "Where the work is judged before anyone gets in touch. It rarely produces a same-day enquiry and it consistently produces the shortlist.",
      actions: [
        model.key === "project"
          ? "Post every finished job: before, during and after, with the location and what it cost in time."
          : "Post real photographs from the business - the work, the people, the space - not stock imagery.",
        "Keep a fixed rhythm the business can actually sustain, two or three posts a week beats a burst then silence.",
        "Put the primary call to action and the website link in the profile, and repeat it in the caption of anything that gets traction.",
        "Reply to every comment and message. An unanswered direct message is a lost enquiry.",
      ],
      destination: "The gallery or portfolio page, then straight into the primary call to action.",
    },
    {
      score: (b2b ? 4 : 0) + (model.key === "professional" ? 4 : 0) + (channels.has("referrals") ? 1 : 0),
      name: "LinkedIn and professional visibility",
      role: "Where business buyers check whether a supplier is real before they make contact, and where a referral is verified after it is given.",
      actions: [
        "Complete the company page and the owner's personal profile - the personal profile does most of the work.",
        "Publish the same expertise that goes on the site, as a short post with the substance in the post itself rather than only a link.",
        "Connect with every client, referrer and partner, and stay visible to them without selling.",
      ],
      destination: "The About page or the relevant case study, then the consultation call to action.",
    },
    {
      score:
        3 +
        (channels.has("referrals") ? 4 : 0) +
        (b2b ? 2 : 0) +
        (project.trust.trustFactors.includes("known-clients") ? 1 : 0),
      name: "Referrals and local partnerships",
      role: channels.has("referrals")
        ? "Already the strongest source of customers for this business. It is currently informal, and formalising it is the highest-return work on this list."
        : "The cheapest customers this business will ever acquire, and the easiest channel to leave running by accident rather than by design.",
      actions: [
        "Ask directly at the point of satisfaction. Most referrals are not given because they are never requested.",
        "Give every happy customer something concrete to pass on: a card, a link, a named offer.",
        "Build two or three referral relationships with businesses that serve the same customer without competing, and send work their way first.",
        "Track where every enquiry came from so the referrers who matter can be thanked properly.",
      ],
      destination: "A short, memorable referral page or offer link that can be sent in a text message.",
    },
    {
      score:
        2 +
        (features.has("newsletter") || project.goals.goals.includes("email-list") ? 4 : 0) +
        (model.key === "retail" || model.key === "hospitality" || model.key === "appointment" ? 3 : 0),
      name: "Email and SMS to the existing list",
      role: "The only audience the business owns outright. It costs nothing per send and converts better than any acquisition channel, and it is almost always the most neglected.",
      actions: [
        "Collect an email address at every honest opportunity: enquiry, purchase, booking, download - never buy or scrape a list.",
        "Send on a predictable rhythm with something genuinely useful in it, not only discounts.",
        model.key === "retail"
          ? "Automate the three that pay for themselves: welcome, abandoned cart and post-purchase."
          : "Automate the three that pay for themselves: welcome, follow-up on an unanswered enquiry, and a check-in after the job is done.",
        "Keep consent and unsubscribes clean, and honour an unsubscribe immediately.",
      ],
      destination: "The offer or landing page named in the message, with the same wording as the email.",
    },
    {
      score:
        1 +
        (facts.isLocalService ? 3 : 0) +
        (facts.traits.includes("health") || model.key === "professional" ? 2 : 0),
      name: "Directories and industry listings",
      role: "Low effort, one-off work that supports local search and catches the customers who start from a directory rather than a search engine.",
      actions: [
        "Claim the handful of listings that matter for this industry, and ignore the rest.",
        "Use identical business name, address, phone number and hours everywhere - inconsistency actively hurts local ranking.",
        "Link each listing to the most relevant page on the site rather than to the homepage.",
        "Re-check the details twice a year, and immediately after anything changes.",
      ],
      destination: "The homepage or the relevant location page, with consistent contact details.",
    },
    {
      score:
        (model.key === "retail" || model.key === "professional" || model.key === "project" ? 3 : 0) +
        (channels.has("advertising") ? 2 : 0),
      name: "Retargeting",
      role: "Recovers the visitors who left without acting, which for a considered purchase is the overwhelming majority of them.",
      actions: [
        "Retarget only the people who reached a service, product or pricing page - not everyone who touched the site.",
        "Cap the frequency. Being followed around the internet is a reason not to buy.",
        "Show the specific thing they looked at, with the offer attached.",
        "Exclude anyone who has already converted.",
      ],
      destination: "The exact page the visitor left, with the primary call to action prefilled where possible.",
    },
    {
      score:
        (model.key === "hospitality" ? 3 : 0) +
        (project.location.customersVisitLocation ? 2 : 0) +
        (project.trust.trustFactors.some((f) => f === "locally-owned" || f === "family-owned") ? 2 : 0),
      name: "Local presence and community",
      role: "For a business people walk into, the street, the neighbours and the local network still produce customers that no online channel reaches.",
      actions: [
        "Be present where the local audience already gathers: markets, events, sponsorships, community groups.",
        "Make sure signage, packaging and vehicles carry the website address in a form people can remember.",
        "Partner with neighbouring businesses on a shared offer rather than competing for the same attention.",
      ],
      destination: "A short, spoken-aloud URL or a QR code that lands on the offer page.",
    },
    {
      score:
        (features.has("blog") ? 3 : 0) +
        (model.key === "professional" ? 3 : 0) +
        (model.key === "quote" || model.key === "project" ? 1 : 0),
      name: "Content and expertise",
      role: "Answers the questions asked before anyone is ready to buy, so the business is already familiar by the time they are.",
      actions: [
        project.audience.customerProblems?.trim()
          ? "Write to the problem the customer described in this brief, in their words, one article per question."
          : "Write one article per real customer question, using the words customers use rather than industry terms.",
        "Publish on a rhythm the business can sustain - one good piece a month, not five then nothing.",
        "Put a call to action on every piece. Content without a next step is a hobby.",
        "Update the pieces that work instead of endlessly adding new ones.",
      ],
      destination: "The article, then a contextual call to action to the matching service page.",
    },
  ];
}

/** The channels worth this business's time, in the order they should be worked. */
export function marketingChannels(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
  model: BusinessModel,
  limit = 6,
): MarketingChannel[] {
  return channelCatalogue(project, facts, model)
    .filter((channel) => channel.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score: _score, ...channel }) => channel);
}

/* ------------------------------------------------------------------ *
 * Positioning
 * ------------------------------------------------------------------ */

/** What each decision factor obliges the copy to prove, rather than claim. */
const PROOF_BY_FACTOR: Record<string, string> = {
  price: "Publish a starting price or a price range. A business that hides its prices loses the customers who chose on price and annoys the ones who did not.",
  speed: "State the actual response and turnaround times as numbers, and hold to them.",
  availability: "Show when the business is available, including evenings, weekends and holidays, and make the next available slot visible.",
  quality: "Show the work itself - photographs, before and after, finished projects - rather than the word quality.",
  experience: "Lead with years in business and the number of jobs or customers completed.",
  reputation: "Put the review count and average rating in the header area, and real named reviews on every service page.",
  trust: "Publish licence and insurance numbers, real names and real faces of the people who will turn up.",
  location: "Make the area served unmistakable in the first screen, and give each area its own page.",
  convenience: "Reduce the number of steps to buy, and say how few there are.",
  "premium-service": "Justify the premium explicitly: what is included that the cheaper option leaves out.",
  expertise: "Show credentials, specialisms and worked examples, not adjectives.",
  warranty: "State the guarantee in plain terms, including what it does not cover.",
  support: "Say who answers, how fast, and through which channel, after the sale as well as before it.",
};

function positioningSection(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
  model: BusinessModel,
): string {
  const described = facts.audience.replace(/\.$/, "").trim();
  // A long audience answer already carries its own qualifiers, so only its first
  // clause goes into the positioning line - the full version lives in TARGET AUDIENCE.
  const audience = described
    ? described.length > 70
      ? described.split(/[,;]/)[0].trim()
      : described
    : project.audience.customerType.includes("businesses")
      ? "businesses"
      : "customers";
  const placeNamed = [facts.cityLabel, project.location.serviceAreas[0]]
    .filter(Boolean)
    .some((place) => audience.toLowerCase().includes(place.toLowerCase()));
  const where = facts.areaLabel && !placeNamed ? ` in ${facts.areaLabel}` : "";
  const need = facts.primaryService ?? facts.industry;
  const competitor = project.competitors.find((c) => c.name?.trim())?.name?.trim();

  const lines: string[] = [
    "Write one positioning line and use it consistently in the hero, the meta description, the Google Business Profile description and every advert. Fill this shape from the facts in this brief - do not invent claims:",
    "",
    `  For ${audience}${where} who need ${need.toLowerCase()}, ${facts.name} is the ${facts.industry.toLowerCase()} that <the specific, provable difference>. Unlike ${competitor ?? "the alternatives"}, <the proof>.`,
    "",
    "The difference must be something a competitor cannot honestly write about themselves. If nothing in this brief supports one, use the strongest verifiable fact available - years in business, response time, guarantee, licence, published prices - rather than an adjective.",
  ];

  const proofs = project.audience.decisionFactors
    .map((factor) => PROOF_BY_FACTOR[factor])
    .filter(Boolean);
  if (proofs.length) {
    lines.push(
      "",
      "These customers decide on the factors below, so the site has to prove each one rather than assert it:",
      bullets(proofs),
    );
  }

  lines.push(
    "",
    "The offer, in priority order:",
    bullets(model.offers),
    "",
    `The primary offer belongs in the hero, attached to the "${facts.primaryCTA}" button. A second, lower-commitment offer belongs further down the page for the visitors who are not ready yet${facts.secondaryCTA ? `, carried by the "${facts.secondaryCTA}" action` : ""}.`,
  );

  const objections: string[] = [];
  if (project.audience.decisionFactors.includes("price") || model.key === "quote")
    objections.push("How much is this going to cost me?");
  objections.push("How quickly can you actually come out or get started?");
  if (!facts.hasTestimonials) objections.push("Has anyone like me used this business before?");
  if (project.location.servesCustomerLocations) objections.push("Do you even cover my area?");
  if (model.key === "professional" || model.key === "project")
    objections.push("What happens after I get in touch - what is the process?");
  objections.push("What if it goes wrong?");

  lines.push(
    "",
    "Every page must answer these questions without the visitor having to ask them:",
    bullets(objections),
  );

  return section("MARKETING PLAN - POSITIONING AND OFFER", lines.join("\n"));
}

/* ------------------------------------------------------------------ *
 * Prompt sections
 * ------------------------------------------------------------------ */

function modelSection(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
  model: BusinessModel,
): string {
  const reach = project.audience.geographicReach ? labelFor(project.audience.geographicReach) : "";
  const sells = project.audience.customerType.length
    ? joinList(labelsFor(project.audience.customerType))
    : "";

  const lines: string[] = [
    "The marketing plan below is derived from the business model in this brief, not bolted on afterwards. Build the website and the back office so this plan can actually be run from day one.",
    "",
    `Business model: ${model.label}`,
    `How demand arises: ${model.demand}`,
    `Buying cycle: ${model.buyingCycle}`,
    `Unit of sale: ${model.unitOfSale}`,
  ];

  if (sells) lines.push(`Sells to: ${sells}`);
  if (reach) lines.push(`Reach: ${reach}`);
  if (facts.areaLabel) lines.push(`Market: ${facts.areaLabel}`);
  if (facts.primaryGoal) lines.push(`The number this plan has to move: ${facts.primaryGoal}`);

  lines.push("", `What marketing must do here: ${model.emphasis}`);

  const stageNote: Record<string, string> = {
    "just-starting":
      "The business has no customer base and no reviews yet, so the first 90 days are about producing the first ten reviews and the first repeatable source of enquiries - not about breadth.",
    new: "Recognition is still being built, so credibility work outranks reach work: reviews, proof and consistency before any new channel.",
    established:
      "There is an existing reputation and customer base. The fastest wins are in reactivating past customers and formalising referrals, not in new channels.",
    growing:
      "Capacity is growing, so the plan must produce a predictable volume of enquiries rather than occasional spikes.",
    rebranding:
      "The plan must carry the existing reputation across to the new identity: redirect, re-announce and re-earn recognition deliberately.",
    expanding:
      "Each new area needs its own page, its own local proof and its own reviews. Do not assume the home market's reputation travels.",
  };
  const note = stageNote[project.business.businessStage ?? ""];
  if (note) lines.push("", note);

  return section("MARKETING PLAN - BUSINESS MODEL", lines.join("\n"));
}

function channelsSection(channels: MarketingChannel[]): string {
  const blocks = channels.map((channel, index) =>
    [
      `${index + 1}. ${channel.name.toUpperCase()}`,
      `   Why: ${channel.role}`,
      bullets(channel.actions, "   - "),
      `   Lands on: ${channel.destination}`,
    ].join("\n"),
  );

  return section(
    "MARKETING PLAN - CHANNELS",
    [
      "Work these in order. A business of this size does two channels well or six channels badly - the ones at the top are the ones to do well.",
      "",
      blocks.join("\n\n"),
      "",
      "Nothing on this list needs an agency to start. Anything that has not produced an enquiry in 90 days gets dropped in favour of the channel above it.",
    ].join("\n"),
  );
}

function launchSection(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
  model: BusinessModel,
  channels: MarketingChannel[],
): string {
  const first = channels[0]?.name ?? "the primary channel";
  const second = channels[1]?.name ?? "the second channel";
  const third = channels[2]?.name ?? "the third channel";

  const first30 = [
    "Launch the site with every page complete - no coming soon, no placeholder text, no dead links.",
    "Verify that every call to action works from a real phone: the number dials, the form arrives, the map opens.",
    `Set up ${first} completely, following the actions listed above.`,
    "Turn on analytics and conversion tracking before the first visitor, not after.",
    project.trust.testimonials.length
      ? "Publish the testimonials already collected, and ask the same customers to repeat them as public reviews."
      : "Ask the last ten customers for a review. This is the single highest-value task of the first month.",
    "Tell the existing customer base the site exists, by whatever channel the business already uses to reach them.",
    facts.isRedesign
      ? "Redirect every old URL to its closest new page, and check for anything left ranking that now 404s."
      : "Submit the sitemap, and confirm the important pages are indexed.",
  ];

  const days60 = [
    `Start ${second} and run it consistently for at least six weeks before judging it.`,
    "Review the first month of enquiries: which pages produced them, which channel they came from, how fast they were answered.",
    "Fix the page with traffic and no enquiries - it is nearly always the copy or the missing price, not the design.",
    "Make the review request automatic rather than remembered, so it happens on every job.",
    model.key === "retail" || model.key === "hospitality" || model.key === "appointment"
      ? "Turn on the automated follow-up messages so repeat business happens without anyone remembering to trigger it."
      : "Set up the two-touch follow-up on unanswered enquiries so no lead goes cold in the inbox.",
  ];

  const days90 = [
    `Add ${third} only if the first two are running without daily effort.`,
    "Compare cost and effort per enquiry across every channel, and move the effort to whichever is winning.",
    "Publish the new proof produced in the first 90 days: reviews, finished work, numbers.",
    "Write down what worked as a repeatable monthly routine, and put it in the back office as a recurring task.",
    "Re-check the site on a phone as a first-time customer would, and cut anything that gets in the way.",
  ];

  return section(
    "MARKETING PLAN - FIRST 90 DAYS",
    [
      "Days 1-30 - launch and foundations:",
      bullets(first30),
      "",
      "Days 31-60 - the second channel and the first corrections:",
      bullets(days60),
      "",
      "Days 61-90 - compound what is working:",
      bullets(days90),
      "",
      "The ongoing rhythm after that:",
      bullets(model.cadence),
    ].join("\n"),
  );
}

function retentionSection(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
  model: BusinessModel,
): string {
  const features = activeFeatures(project);
  const followUps: string[] = [
    `Respond to every enquiry the same working day. For this business model the response time is a marketing lever rather than an admin detail - ${firstSentence(model.buyingCycle).toLowerCase()}.`,
    "Follow up twice on anything unanswered - once after two days, once after a week - then close it with a reason.",
  ];
  if (features.has("booking")) followUps.push("Confirm and remind every appointment automatically, and follow up on no-shows.");
  if (features.has("ecommerce") || features.has("online-ordering"))
    followUps.push("Confirm every order, and recover abandoned carts automatically.");

  const repeat: string[] = [];
  if (model.key === "appointment" || model.key === "hospitality")
    repeat.push("Prompt the next visit before the customer leaves, and chase anyone who has not come back within their usual interval.");
  if (model.key === "local-service" || model.key === "emergency" || model.key === "quote")
    repeat.push("Contact past customers seasonally with the service they will need next, not with a generic newsletter.");
  if (model.key === "professional" || model.key === "project")
    repeat.push("Keep a monthly touchpoint with past clients and referral sources - they produce the next engagement more often than any advert.");
  if (model.key === "retail")
    repeat.push("Segment the list by what people bought, and send them what goes with it rather than the same email to everyone.");
  repeat.push(
    "Reactivating a past customer costs a fraction of finding a new one. Whatever budget exists, spend it here first.",
    `Every satisfied customer produces two assets: a review and a referral. Ask for both, every time${facts.hasTestimonials ? ", including from the customers already quoted in this brief" : ""}.`,
  );

  return section(
    "MARKETING PLAN - FOLLOW-UP AND REPEAT BUSINESS",
    [
      "Most of the money lost in a business of this kind is lost after the enquiry arrives, not before it.",
      "",
      "Follow-up:",
      bullets(followUps),
      "",
      "Repeat and referral:",
      bullets(repeat),
    ].join("\n"),
  );
}

function measurementSection(project: MerchantWebsiteProject, facts: ProjectFacts): string {
  const goalMetric: Record<string, string> = {
    call: "Calls started from the website, split by page and by device",
    whatsapp: "WhatsApp conversations started from the website",
    quote: "Quote requests submitted, and the share that turn into won work",
    book: "Appointments booked online, and the share of the calendar filled",
    contact: "Contact form submissions, and the share that turn into customers",
    "get-started": "Sign-ups started and completed",
    visit: "Directions requests and location page views",
    directions: "Directions requests, split by location",
    order: "Orders placed, and average order value",
    shop: "Orders placed, and average order value",
    consultation: "Consultations booked, and the share that turn into engagements",
    "view-services": "Service page views that end in an enquiry",
  };

  const kpis = [
    goalMetric[facts.primaryCTAValue] ?? "Enquiries received from the website",
    "Enquiry-to-customer rate, so traffic is never mistaken for revenue",
    "Time to first response on every enquiry",
    "Enquiries by source, so effort can be moved to what works",
    "Review count and average rating, month by month",
  ];
  if (project.goals.goals.includes("email-list")) kpis.push("Email subscribers gained, and how many convert later");
  if (project.goals.goals.includes("local-visibility"))
    kpis.push("Google Business Profile views, calls and directions requests");

  return section(
    "MARKETING PLAN - MEASUREMENT",
    [
      `This website is measured against one number: ${facts.primaryGoal || "enquiries generated"}. Visits are not that number, and traffic that produces nothing is a cost.`,
      "",
      "Track monthly, on one screen in the back office:",
      bullets(kpis),
      "",
      "What must be instrumented in the build for any of that to be measurable:",
      bullets([
        "A conversion event on every call to action: form submitted, call tapped, WhatsApp tapped, directions tapped, booking completed, order placed.",
        "The page and the referrer stored on every enquiry, so the source is known without guessing.",
        "UTM parameters captured on landing and persisted through to the enquiry record, using one convention: utm_source, utm_medium, utm_campaign, lowercase, no spaces.",
        "A privacy-respecting analytics tool with a cookie notice that matches what is actually set.",
        "No tracking that is never looked at - every tag on the site must map to a number in the list above.",
      ]),
      "",
      "Review monthly against the previous month, not against a target invented at launch. Three months of data beats any forecast.",
    ].join("\n"),
  );
}

function enablementSection(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
  channels: MarketingChannel[],
): string {
  const features = activeFeatures(project);
  const siteRequirements = [
    "A reusable campaign landing page template: one headline, one offer, one call to action, no navigation competing with it. Every paid or emailed campaign gets its own page from this template.",
    `An announcement or offer bar, editable in the back office, with an optional start and end date - this is how the business runs a promotion without a developer.`,
    "UTM parameters captured on first landing, persisted across the session, and written onto whatever the visitor submits.",
    "Conversion events fired on every call to action, named consistently and documented.",
    "Open Graph and Twitter card images and text on every page, so a shared link never looks broken.",
    "Email capture that is honest about what will be sent, with double opt-in and a working unsubscribe.",
    "A short, memorable URL pattern for offers and referrals - one that can be read aloud or printed on a card.",
    "Fast on a mid-range phone on mobile data. Every second of load costs enquiries on every channel above.",
  ];
  if (features.has("newsletter") || project.goals.goals.includes("email-list"))
    siteRequirements.push("A subscribe form in the footer and one contextual placement, both writing to the same list.");
  if (features.has("blog"))
    siteRequirements.push("A contextual call to action at the end of every article, matched to the article's subject.");

  const adminRequirements = [
    "Campaigns - name, channel, offer, landing page, start and end date, and the enquiries attributed to it. This is how the owner sees which channel is paying.",
    "Offers and promotions - create an offer, choose where it appears (announcement bar, hero, a landing page), schedule it, and end it automatically.",
    "Review requests - send the review link by email or SMS from a finished enquiry, track who was asked and who left one, and chase once.",
    "Broadcasts - write and send an email or SMS to a segment of the existing list, with the unsubscribe handled and the results recorded.",
    "Attribution - one screen showing enquiries by source, channel and campaign for the last 30 and 90 days, alongside the review count.",
    "The 90-day plan above, seeded as a checklist of recurring tasks the owner can tick off, with the ongoing rhythm as repeating reminders.",
  ];

  return section(
    "MARKETING PLAN - WHAT THE BUILD MUST PROVIDE",
    [
      "The plan above is only executable if the product supports it. Build all of the following.",
      "",
      "On the public website:",
      bullets(siteRequirements),
      "",
      `In the back office, as a "Marketing" module in the /admin navigation alongside the modules in the BACK OFFICE - MODULES section, using the same permissions, audit log and publishing rules:`,
      bullets(adminRequirements),
      "",
      `Seed the Marketing module with the plan from this brief: ${joinList(channels.slice(0, 3).map((c) => c.name))} as the starting channels, the offers listed above as draft offers, and the first 90 days as the initial task checklist - so ${facts.name} logs in on day one to a plan already in progress rather than an empty screen.`,
    ].join("\n"),
  );
}

/** The MARKETING PLAN blocks of the generation prompt, in order. */
export function buildMarketingSections(
  project: MerchantWebsiteProject,
  _report: WebsiteReport,
  facts: ProjectFacts,
): string[] {
  const model = deriveBusinessModel(project, facts);
  const channels = marketingChannels(project, facts, model);

  return [
    modelSection(project, facts, model),
    positioningSection(project, facts, model),
    channelsSection(channels),
    launchSection(project, facts, model, channels),
    retentionSection(project, facts, model),
    measurementSection(project, facts),
    enablementSection(project, facts, channels),
  ];
}

/* ------------------------------------------------------------------ *
 * Merchant-facing version
 * ------------------------------------------------------------------ */

/** The same plan in the merchant's language, for the shareable website plan document. */
export function buildMarketingPlanDocument(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
): string[] {
  const model = deriveBusinessModel(project, facts);
  const channels = marketingChannels(project, facts, model, 5);
  const lines: string[] = [];

  lines.push(`## Marketing plan`);
  lines.push(
    `Your website is one part of getting customers. This plan is built around how your business actually makes money: ${model.label.toLowerCase()}.`,
  );
  lines.push("");
  lines.push(bullets([
    `**How customers decide:** ${model.demand}`,
    `**How long it takes:** ${model.buyingCycle}`,
    `**What marketing has to do:** ${model.emphasis}`,
  ]));
  lines.push("");
  lines.push(`### Where to spend your effort`);
  lines.push(
    numbered(channels.map((channel) => `**${channel.name}** - ${channel.role}`)),
  );
  lines.push("");
  lines.push(`### Offers worth running`);
  lines.push(bullets(model.offers));
  lines.push("");
  lines.push(`### Your first 90 days`);
  lines.push(
    bullets([
      `**Month 1:** launch the site, set up ${channels[0]?.name ?? "your first channel"}, and ask your last ten customers for a review.`,
      `**Month 2:** start ${channels[1]?.name ?? "your second channel"}, and check which pages are actually producing enquiries.`,
      `**Month 3:** do more of whatever produced enquiries, and drop whatever did not.`,
    ]),
  );
  lines.push("");
  lines.push(`### Every week, from then on`);
  lines.push(bullets(model.cadence));
  lines.push("");
  lines.push(
    `You will run all of this from the Marketing section of your back office - campaigns, offers, review requests and a single screen showing where your enquiries came from.`,
  );

  return lines;
}
