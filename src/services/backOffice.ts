import type { MerchantWebsiteProject, WebsiteReport } from "@/types/project";
import type { ProjectFacts } from "@/services/reportGenerator";
import { impliedFeatures } from "@/services/recommendations";
import { bullets, hasAnyHours, joinList, promptSection as section } from "@/utils/formatting";

/**
 * The admin application that ships with the website. Every module here is derived from the
 * merchant's answers, so a business that never asked for a blog never gets a posts editor.
 *
 * Nothing in this file imports React. Phase 2 sends the text it produces as part of the
 * generation prompt.
 */

export interface BackOfficeModule {
  /** Appears verbatim as the admin navigation label. */
  title: string;
  purpose: string;
  capabilities: string[];
}

/** Everything the merchant asked for, plus what their other answers imply. */
function activeFeatures(project: MerchantWebsiteProject): Set<string> {
  return new Set([...project.features, ...impliedFeatures(project)]);
}

/* ------------------------------------------------------------------ *
 * Modules
 * ------------------------------------------------------------------ */

/** The day-to-day modules, in the order the owner will use them. */
function operationalModules(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
): BackOfficeModule[] {
  const leadSources = ["Contact form"];
  const has = (feature: string) => activeFeatures(project).has(feature);
  if (has("quote-form")) leadSources.push("Quote request form");
  if (has("booking")) leadSources.push("Booking request");
  if (has("newsletter")) leadSources.push("Newsletter signup");
  if (has("job-applications")) leadSources.push("Job application");
  if (has("live-chat")) leadSources.push("Chat transcript");
  if (project.contact.phone) leadSources.push("Click-to-call tap");
  if (project.contact.whatsapp) leadSources.push("WhatsApp tap");

  return [
    {
      title: "Dashboard",
      purpose: `The first screen after login. Answers "what needs me today?" in under five seconds.`,
      capabilities: [
        "New enquiries since last login, as a count and a list, each one clickable.",
        "Enquiries waiting on a reply, oldest first, with how long they have been waiting.",
        `Counters for the last 7 and 30 days against the primary goal: ${facts.primaryGoal || "enquiries generated"}.`,
        "Quick actions: add a service, publish an update, reply to the newest enquiry.",
        "A setup checklist on first run that disappears once every item is done.",
      ],
    },
    {
      title: "Enquiries",
      purpose:
        "The inbox. Every lead the website captures lands here and is worked to a conclusion - nothing is only emailed and then lost.",
      capabilities: [
        `One record per submission, tagged by source: ${joinList(leadSources)}.`,
        "Fields: name, contact details, message, service of interest, submitted at, page it came from, referrer and campaign parameters, device.",
        "Status pipeline: New → Contacted → Quoted → Won → Lost, with a reason on Lost.",
        "Assign to a user, add internal notes, log a call, set a follow-up reminder.",
        "Filter and search by status, source, service, assignee and date range; save a filter as a view.",
        "Bulk actions and CSV export of the current filter.",
        "Time-to-first-response shown per enquiry and averaged on the dashboard.",
        "Spam quarantine that is reviewable, not silently deleted.",
      ],
    },
    {
      title: "Pages & content",
      purpose:
        "Edit the words on every page of the public website without touching code or calling a developer.",
      capabilities: [
        "One editable record per page in the WEBSITE STRUCTURE section, each with its own sections in the order they render.",
        "Per-section fields typed to what that section actually holds - heading, body, image, button label, button destination - never a raw HTML box.",
        "Reorder, hide and show homepage sections; hidden sections keep their content.",
        "Per-page SEO: title tag, meta description, URL slug, social share image, noindex toggle, with live character counters and a search-result preview.",
        "Draft, preview on a private link, publish, and schedule publishing for a future time.",
        "Revision history with a diff and one-click restore of any earlier version.",
        "Navigation editor for the header and footer menus, and a site-wide announcement bar with an optional end date.",
      ],
    },
    {
      title: "Services",
      purpose: `The source of every service listed on the site${facts.serviceNames.length ? ` - seeded with ${joinList(facts.serviceNames.slice(0, 6))}` : ""}.`,
      capabilities: [
        "Create, edit, reorder, duplicate, archive and delete services.",
        "Fields: name, short description, full description, price or price range, image, icon, FAQs, and its own call to action.",
        "Mark one service as primary; the homepage hierarchy and navigation follow that flag.",
        "Publishing a service creates its detail page, adds it to the services grid, the navigation and the sitemap automatically.",
        "Archived services keep their URL and return a redirect rather than a 404.",
      ],
    },
    {
      title: "Business profile",
      purpose:
        "The single source of truth for the details that appear in dozens of places on the site.",
      capabilities: [
        "Business name, tagline, description, year established, registration or licence numbers.",
        "Address, phone, secondary phone, WhatsApp, email, and every social profile link.",
        "Service areas as an editable list, which drives the areas served block and the location pages.",
        "Editing any of these updates the header, footer, contact page, structured data and email signatures at once. These values are never hard-coded in a component.",
      ],
    },
    {
      title: "Hours & availability",
      purpose: "Keep opening hours honest, including the days they change.",
      capabilities: [
        hasAnyHours(project.businessHours)
          ? "Regular weekly hours, seeded from the hours in this brief."
          : "Regular weekly hours, plus a 24/7 toggle.",
        "Holiday and exception dates that override the weekly hours for a single day.",
        "A temporary closure notice that shows a banner on the site and pauses booking where booking exists.",
        "The site's open/closed indicator and structured data both read from here, in the business's timezone.",
      ],
    },
    {
      title: "Testimonials & trust",
      purpose: "Manage social proof without ever inventing it.",
      capabilities: [
        "Testimonial records: quote, author, rating, source, date, publish toggle, display order.",
        "Trust signals - certifications, licences, insurance, guarantees, memberships - with an optional badge image and an expiry date that flags them for review.",
        "Editing is limited to spelling and punctuation, with a warning that the wording of a real customer's review must not be changed.",
      ],
    },
    {
      title: "Media library",
      purpose: "One place for every image and file the site uses.",
      capabilities: [
        "Drag-and-drop upload with type and size validation and a clear progress state.",
        "Alt text is a required field before an image can be used on the site.",
        "Automatic resizing to the sizes the site requests, in a modern format, with the original kept.",
        "Replace an image in place so every page using it updates at once.",
        "Shows which pages use a file, and blocks deletion of a file that is still in use.",
      ],
    },
    {
      title: "Insights",
      purpose: "Plain-language numbers, not an analytics console.",
      capabilities: [
        "Enquiries over time, by source and by service.",
        `Calls to action tracked as events: ${joinList([facts.primaryCTA, facts.secondaryCTA].filter(Boolean).map((c) => `"${c}"`))}.`,
        "Most-visited pages and the pages that produce the most enquiries.",
        "Where visitors came from: search, social, direct, referral.",
        "Every chart states its date range and is exportable as CSV.",
      ],
    },
  ];
}

/** Administration, kept at the end of the navigation because it is touched least. */
function adminModules(): BackOfficeModule[] {
  return [
    {
      title: "Users & roles",
      purpose: "Give staff access to their work and nothing else.",
      capabilities: [
        "Invite by email, resend and revoke invitations, deactivate a user without deleting their history.",
        "Assign one of the roles defined in the roles section below.",
        "Force password reset, optional two-factor authentication, visible last-login time.",
      ],
    },
    {
      title: "Settings",
      purpose: "Everything that configures the site rather than fills it.",
      capabilities: [
        "Branding: logo, favicon, brand colours, typography choices - applied to the site as design tokens, not scattered overrides.",
        "Notification recipients per event type.",
        "Analytics and tracking IDs, and the cookie or consent banner text.",
        "Legal pages: privacy policy, terms, cookie policy.",
        "Domain, redirects, and a 404-page editor.",
        "Integration credentials, stored encrypted and never displayed again after saving.",
      ],
    },
    {
      title: "Activity log",
      purpose: "Answer 'who changed this, and when?' without guesswork.",
      capabilities: [
        "Append-only record of every create, update, delete, publish and login, with user, timestamp and what changed.",
        "Filterable by user, record type and date; exportable; not editable by anyone, including the owner.",
      ],
    },
  ];
}

/** Modules that exist only because the merchant asked for the matching website feature. */
function featureModules(project: MerchantWebsiteProject): BackOfficeModule[] {
  const features = activeFeatures(project);
  const modules: BackOfficeModule[] = [];
  const when = (feature: string, module: BackOfficeModule) => {
    if (features.has(feature)) modules.push(module);
  };

  when("blog", {
    title: "Posts",
    purpose: "Publish articles and updates that keep the site earning search traffic.",
    capabilities: [
      "Rich editor with headings, lists, links, images, quotes and embeds - no raw HTML required.",
      "Fields: title, slug, excerpt, cover image, author, categories, tags, published date.",
      "Draft, schedule, publish and unpublish; per-post SEO fields and a share preview.",
      "Publishing regenerates the blog index, the category pages, the sitemap and the RSS feed.",
    ],
  });

  when("gallery", {
    title: "Gallery",
    purpose: "Show the work, organised the way customers think about it.",
    capabilities: [
      "Albums or projects, each with a title, description, cover image and ordered photos.",
      "Optional before/after pairs and per-photo captions.",
      "Tag an album with the service it belongs to so it can appear on that service's page.",
      "Bulk upload, drag-to-reorder, and per-album publish toggle.",
    ],
  });

  when("faq", {
    title: "FAQs",
    purpose: "Answer the questions that would otherwise become phone calls.",
    capabilities: [
      "Question and answer records, grouped into categories, drag-to-reorder.",
      "Attach an FAQ to a specific service or page, or mark it site-wide.",
      "Published FAQs generate FAQPage structured data automatically.",
    ],
  });

  when("team-profiles", {
    title: "Team",
    purpose: "Keep the people on the site current.",
    capabilities: [
      "Profiles: name, role, photo, bio, qualifications, contact details, display order, publish toggle.",
      "Link a team member to the services they deliver, and to their bookings where booking exists.",
    ],
  });

  when("downloads", {
    title: "Documents",
    purpose: "Manage the brochures, price lists and forms visitors download.",
    capabilities: [
      "Upload and version files; replacing a file keeps the same public URL.",
      "Optional email capture before download, with the captured address landing in Enquiries.",
      "Download counts per file.",
    ],
  });

  when("booking", {
    title: "Bookings",
    purpose: "Run the appointment book that the website writes into.",
    capabilities: [
      "Day, week and month calendar plus a list view; create, reschedule and cancel from any of them.",
      "Bookable services with duration, buffer time, price, capacity and how far ahead they can be booked.",
      "Staff availability, working hours, breaks, holidays and blackout dates; the public booking form only ever offers real availability.",
      "Double-booking is prevented at the database level, not only in the interface.",
      "Automatic confirmation on booking, a reminder before the appointment, and a notice on cancellation, on the channels configured in settings.",
      "Customer-facing reschedule and cancel links that respect a configurable notice period.",
      "No-show and completed statuses, and deposit handling if payments are enabled.",
    ],
  });

  when("ecommerce", {
    title: "Products & orders",
    purpose: "The catalogue behind the storefront and the queue behind the checkout.",
    capabilities: [
      "Products: title, description, images, price, sale price, SKU, variants, stock level, category, publish toggle.",
      "Stock decremented on payment, with a low-stock threshold and an out-of-stock behaviour per product.",
      "Orders list with status pipeline: Paid → Preparing → Shipped/Ready → Completed, plus Cancelled and Refunded.",
      "Order detail: items, customer, delivery details, payment reference, internal notes, printable packing slip.",
      "Refunds through the payment provider, recorded against the order.",
      "Discount codes with a value, expiry date and usage limit.",
      "Tax, shipping and delivery-area rules configurable without code.",
    ],
  });

  when("online-ordering", {
    title: "Orders",
    purpose: "Take and fulfil orders placed on the website.",
    capabilities: [
      "Live order queue with an audible alert for new orders and an accept/reject decision with a prep time.",
      "Order statuses through to completion, with the customer notified at each step.",
      "Order-ahead and scheduled-time slots, plus a pause-ordering switch for when the business is at capacity.",
      "Printable or kitchen-view ticket for each order.",
    ],
  });

  when("menu-display", {
    title: "Menu",
    purpose: "Change prices and availability without a redesign.",
    capabilities: [
      "Menu sections and items with name, description, price or price sizes, photo and display order.",
      "Dietary and allergen tags, and per-item availability that greys the item out on the site rather than hiding it silently.",
      "Multiple menus with time windows - for example breakfast, lunch, seasonal.",
      "Export the current menu as a print-ready PDF.",
    ],
  });

  when("pricing-tables", {
    title: "Packages",
    purpose: "Own the pricing shown on the site.",
    capabilities: [
      "Package records: name, price, billing note, feature list, highlight flag, call to action, display order.",
      "Editing a package updates every pricing table it appears in.",
    ],
  });

  when("reviews", {
    title: "Reviews",
    purpose: "Collect and display ratings from the places customers already look.",
    capabilities: [
      "Pull ratings from the connected review platforms on a schedule, with a manual refresh and a clear last-synced time.",
      "Choose which reviews appear on the site; never edit their wording.",
      "Send a review request to a customer after a completed job or booking, and see who has been asked.",
      "Alert the owner when a review below a chosen rating arrives.",
    ],
  });

  when("newsletter", {
    title: "Subscribers",
    purpose: "Own the mailing list the site collects.",
    capabilities: [
      "Subscriber records with the source page, subscribe date and consent record.",
      "Working unsubscribe link, and unsubscribed contacts kept out of every export.",
      "Segments and CSV export, or a one-way sync to the connected email platform.",
    ],
  });

  when("live-chat", {
    title: "Chat",
    purpose: "Handle conversations that start on the website.",
    capabilities: [
      "Agent console with open, assigned and closed conversations, and canned replies.",
      "Away mode outside business hours that captures a name, contact detail and message as an enquiry instead.",
      "Transcripts attached to the matching enquiry record.",
    ],
  });

  when("job-applications", {
    title: "Recruitment",
    purpose: "Post openings and process the people who apply.",
    capabilities: [
      "Job postings: title, location, type, description, requirements, salary range, open/closed status.",
      "Applicants with their answers and CV file, and a status pipeline from New to Hired or Rejected.",
      "CV files stored separately from public media, reachable only through a signed, expiring link.",
    ],
  });

  when("customer-portal", {
    title: "Customers",
    purpose: "The records behind the logged-in area of the website.",
    capabilities: [
      "Customer accounts with contact details, job or order history, documents and invoices.",
      "Invite a customer, reset their access, or suspend an account.",
      "Control what the portal exposes per customer; staff can view the portal as that customer, read-only, for support.",
    ],
  });

  when("multiple-locations", {
    title: "Locations",
    purpose: "Run every branch from one place.",
    capabilities: [
      "A record per location: name, address, phone, email, hours, map coordinates, photos, staff and services offered.",
      "Each published location gets its own page, its own structured data and a row in the location switcher.",
      "Scope users, enquiries and bookings to a location so a branch manager sees only their branch.",
    ],
  });

  when("multilingual", {
    title: "Languages",
    purpose: "Keep every language version in step.",
    capabilities: [
      "A locale list with one default; every content record gets a field per locale.",
      "Translation status per page - missing, outdated when the source changed, complete - so nothing silently falls behind.",
      "Untranslated pages fall back to the default language rather than showing an empty page.",
    ],
  });

  when("integrations", {
    title: "Integrations",
    purpose: "Connect the systems the business already runs on.",
    capabilities: [
      "Connect, test and disconnect each integration, with the last sync time and the last error visible.",
      "Outbound webhooks for new enquiries, bookings and orders, with a delivery log and manual retry.",
      "Read-only API keys with scopes, revocable individually.",
    ],
  });

  when("search", {
    title: "Site search",
    purpose: "Keep search results useful.",
    capabilities: [
      "Reindex on publish, and on demand.",
      "A report of searches that returned nothing, which is a content to-do list.",
      "Pin a page to the top for a chosen term.",
    ],
  });

  return modules;
}

export function backOfficeModules(
  project: MerchantWebsiteProject,
  facts: ProjectFacts,
): BackOfficeModule[] {
  return [...operationalModules(project, facts), ...featureModules(project), ...adminModules()];
}

/* ------------------------------------------------------------------ *
 * Prompt sections
 * ------------------------------------------------------------------ */

function overviewSection(facts: ProjectFacts): string {
  return section(
    "BACK OFFICE - OVERVIEW",
    [
      `Alongside the public website, build a back office: a password-protected admin application that ${facts.name} runs the website and the enquiries it produces from.`,
      "",
      "The two are one product, not two projects:",
      bullets([
        "One codebase, one deployment, one database. The back office lives at /admin in the same application.",
        "Everything the website displays that could plausibly change - copy, services, hours, prices, photos, testimonials, contact details, SEO fields - is stored in the database and edited in the back office. Content that would need a developer and a deployment to change is a defect.",
        "Everything the website collects - enquiries, bookings, orders, signups - is written to the same database and worked on in the back office.",
        "Seed the database with all of the content in this brief, so the back office is fully populated on first launch and the site is complete before anyone logs in. Do not ship an empty admin with placeholder content on the site.",
      ]),
      "",
      "The owner is not technical and will often be using a phone. The admin must be as carefully designed as the public site.",
    ].join("\n"),
  );
}

function modulesSection(project: MerchantWebsiteProject, facts: ProjectFacts): string {
  const blocks = backOfficeModules(project, facts).map((module, index) => {
    const lines = [
      `${index + 1}. ${module.title.toUpperCase()}`,
      `   Purpose: ${module.purpose}`,
      bullets(module.capabilities, "   - "),
    ];
    return lines.join("\n");
  });

  return section(
    "BACK OFFICE - MODULES",
    [
      "Build exactly these modules, as the top-level navigation of the admin, in this order:",
      "",
      blocks.join("\n\n"),
    ].join("\n"),
  );
}

function dataModelSection(project: MerchantWebsiteProject): string {
  const features = activeFeatures(project);
  const entities: string[] = [
    "BusinessProfile (singleton) - name, tagline, description, address, phones, whatsapp, email, socials, serviceAreas, timezone",
    "OpeningHours + HoursException - weekly hours and dated overrides",
    "Page - slug, title, seo{title, description, image, noindex}, status, publishedAt, sections[]",
    "PageSection - type, order, visible, typed content fields",
    "Service - name, slug, shortDescription, description, price, image, isPrimary, order, status",
    "Enquiry - type, name, email, phone, message, serviceId, status, assignedUserId, sourcePage, referrer, utm, notes[], createdAt, firstRespondedAt",
    "Testimonial - quote, author, rating, source, date, published, order",
    "TrustSignal - label, description, badgeImage, expiresAt",
    "MediaAsset - file, mimeType, width, height, altText, derivatives[], usage[]",
    "User - name, email, passwordHash, role, status, lastLoginAt, twoFactor",
    "Setting - key/value store for branding, notification recipients, tracking IDs, integration credentials (encrypted)",
    "AuditLog - userId, action, entityType, entityId, changes, createdAt",
    "Revision - entityType, entityId, snapshot, userId, createdAt",
  ];

  const conditional: Array<[string, string]> = [
    ["blog", "Post + Category + Tag - title, slug, excerpt, body, coverImage, authorId, publishedAt, seo"],
    ["gallery", "Album + Photo - title, description, cover, serviceId, order; photo caption and altText"],
    ["faq", "Faq - question, answer, category, serviceId, order, published"],
    ["team-profiles", "TeamMember - name, role, photo, bio, qualifications, order, published"],
    ["downloads", "Document - title, file, version, requiresEmail, downloadCount"],
    [
      "booking",
      "BookableService + StaffAvailability + Booking - booking holds customer, serviceId, staffId, startAt, endAt, status, notes, with a uniqueness constraint on staff and time",
    ],
    ["ecommerce", "Product + Variant + Order + OrderItem + DiscountCode - stock, price, status, payment reference"],
    ["online-ordering", "Order + OrderItem - items, fulfilment type, requested time, status, payment reference"],
    ["menu-display", "Menu + MenuSection + MenuItem - price, availability, dietary tags, order"],
    ["pricing-tables", "Package - name, price, features[], highlighted, order"],
    ["reviews", "Review - platform, author, rating, text, publishedOnSite, fetchedAt"],
    ["newsletter", "Subscriber - email, source, consentAt, unsubscribedAt"],
    ["live-chat", "Conversation + Message - visitor, assignedUserId, status, transcript, enquiryId"],
    ["job-applications", "JobPosting + Application - applicant details, cvFile, status"],
    ["customer-portal", "Customer + PortalDocument + Invoice - account, history, access status"],
    ["multiple-locations", "Location - name, address, phone, hours, coordinates, staff[], services[]"],
    ["multilingual", "Locale + per-entity translation rows with a translationStatus field"],
    ["integrations", "Integration + WebhookDelivery + ApiKey - credentials, lastSyncAt, lastError, delivery log"],
  ];

  for (const [feature, entity] of conditional) {
    if (features.has(feature)) entities.push(entity);
  }

  return section(
    "BACK OFFICE - DATA MODEL",
    [
      "Model at least these records. Use a real schema with migrations and typed models, not loose JSON blobs:",
      "",
      bullets(entities),
      "",
      bullets([
        "Every record carries createdAt, updatedAt and, where a person made the change, updatedBy.",
        "Deletes are soft where the record has public URLs or customer data, so nothing breaks and nothing is lost.",
        "Slugs are unique and stable; changing one records a redirect from the old URL automatically.",
      ]),
    ].join("\n"),
  );
}

function connectionSection(project: MerchantWebsiteProject, facts: ProjectFacts): string {
  const features = activeFeatures(project);
  const mappings: string[] = [
    "Header, footer, contact page and LocalBusiness structured data ← Business profile + Hours",
    "Homepage sections, their order and their copy ← Pages & content",
    "Services grid, service detail pages, navigation and sitemap entries ← Services",
    "Testimonials and trust bars ← Testimonials & trust",
    "Every image and its alt text ← Media library",
    "Page titles, meta descriptions, share images, robots directives and sitemap.xml ← the SEO fields on each record",
    "Colours, logo, favicon and typography ← Settings, exposed to the site as design tokens",
  ];
  const conditionalMappings: Array<[string, string]> = [
    ["blog", "Blog index, article pages, categories and the RSS feed ← Posts"],
    ["gallery", "Gallery and project pages ← Gallery"],
    ["faq", "FAQ sections and FAQPage structured data ← FAQs"],
    ["team-profiles", "Team section and profile pages ← Team"],
    ["downloads", "Download links ← Documents"],
    ["booking", "The booking form's available slots, and the confirmation the customer receives ← Bookings"],
    ["ecommerce", "Product listings, product pages, cart and checkout ← Products & orders"],
    ["online-ordering", "The ordering interface and its availability ← Orders"],
    ["menu-display", "The menu page ← Menu"],
    ["pricing-tables", "Pricing tables ← Packages"],
    ["reviews", "Review sections and aggregate rating ← Reviews"],
    ["multiple-locations", "Location pages and the location switcher ← Locations"],
    ["multilingual", "Every localised page ← Languages"],
  ];
  for (const [feature, mapping] of conditionalMappings) {
    if (features.has(feature)) mappings.push(mapping);
  }

  const inbound: string[] = [
    `Every form on the site posts to a server endpoint that validates the input, writes an Enquiry row, and only then shows the success state. A submission that is not persisted must show an error, never a false confirmation.`,
    "The new record appears in the back office immediately and triggers the configured notifications.",
    "Protect every public endpoint with a honeypot field, a per-IP rate limit and server-side validation. Suspected spam goes to a reviewable quarantine, not to deletion.",
    "Capture the source page, referrer and campaign parameters with the submission so the Insights module can attribute it.",
    `Track every call to action as an event${facts.primaryCTA ? `, including taps on "${facts.primaryCTA}"` : ""}, so the dashboard reflects real conversions rather than page views.`,
  ];
  if (features.has("booking")) {
    inbound.push(
      "Booking requests check live availability server-side before confirming; a slot taken between page load and submission returns a clear, recoverable error.",
    );
  }
  if (features.has("ecommerce") || features.has("online-ordering")) {
    inbound.push(
      "Payments are confirmed by the provider's webhook, not by the browser redirect, and orders are idempotent on retry.",
    );
  }

  return section(
    "BACK OFFICE - HOW IT CONNECTS TO THE WEBSITE",
    [
      "Content flows out of the back office and into the site:",
      "",
      bullets(mappings),
      "",
      "Data flows from the site back into the back office:",
      "",
      bullets(inbound),
      "",
      "Publishing:",
      "",
      bullets([
        "Draft changes are visible only through a private preview link that renders the real site with the draft applied.",
        "Publishing makes the change live within seconds without a rebuild or a redeploy - revalidate or invalidate the affected pages, the sitemap and the navigation.",
        "Scheduled changes publish themselves at the set time.",
        "Every publish is reversible from the revision history.",
        "The public site is read-only against published records and must stay fast: cache aggressively, invalidate precisely on publish.",
      ]),
    ].join("\n"),
  );
}

function rolesSection(project: MerchantWebsiteProject): string {
  const features = activeFeatures(project);
  const staffScope = [
    features.has("booking") ? "their own bookings" : "",
    features.has("ecommerce") || features.has("online-ordering") ? "orders" : "",
    "enquiries assigned to them",
  ].filter(Boolean);

  return section(
    "BACK OFFICE - ROLES AND PERMISSIONS",
    [
      bullets([
        "OWNER - everything, including users, integrations, settings and deletion. There is always at least one owner; the last one cannot be removed or demoted.",
        "MANAGER - all content and all customer records; cannot manage users, integrations or billing.",
        `EDITOR - pages, ${features.has("blog") ? "posts, " : ""}media and SEO; no access to customer data or settings.`,
        `STAFF - ${joinList(staffScope)}; no content, no settings, no exports.`,
      ]),
      "",
      bullets([
        "Permissions are enforced on the server for every request. Hiding a button in the interface is not access control.",
        "The interface hides what a role cannot use rather than showing it disabled.",
        "Exporting customer data and deleting records are separately permissioned and always written to the audit log.",
      ]),
    ].join("\n"),
  );
}

function notificationsSection(project: MerchantWebsiteProject): string {
  const features = activeFeatures(project);
  const channels = ["Email"];
  if (project.contact.phone) channels.push("SMS");
  if (project.contact.whatsapp) channels.push("WhatsApp");
  channels.push("In-app, with an unread badge in the admin");

  const events = ["A new enquiry arrives", "An enquiry has gone unanswered past a chosen threshold"];
  if (features.has("booking"))
    events.push("A booking is made, rescheduled or cancelled", "A reminder before each appointment");
  if (features.has("ecommerce") || features.has("online-ordering"))
    events.push("An order is placed or paid", "Stock falls below its threshold");
  if (features.has("job-applications")) events.push("An application is submitted");
  if (features.has("reviews")) events.push("A review arrives below the chosen rating");
  if (features.has("newsletter")) events.push("Someone subscribes");
  events.push("A form or integration starts failing");

  return section(
    "BACK OFFICE - NOTIFICATIONS",
    [
      "Channels:",
      bullets(channels),
      "",
      "Events:",
      bullets(events),
      "",
      bullets([
        "Recipients are configurable per event and per user, and every notification links straight to the record.",
        "Customer-facing messages - confirmations, reminders, receipts - use templates that are editable in the back office and carry the business's branding and contact details.",
        "Sending is queued and retried on failure, and a failure is visible in the admin rather than silent.",
      ]),
    ].join("\n"),
  );
}

function adminUxSection(facts: ProjectFacts): string {
  return section(
    "BACK OFFICE - INTERFACE RULES",
    bullets([
      `Written for ${facts.name}'s owner and staff, not for developers: plain language, no jargon, no database terms, no acronyms in labels.`,
      "Fully responsive and genuinely usable on a phone, including the enquiry inbox and every editor.",
      "Consistent screen pattern: list with search, filter and pagination → detail → edit, with the same controls in the same places.",
      "Autosave drafts, warn before discarding unsaved changes, and confirm destructive actions by naming what will be deleted.",
      "Every form field validates inline with a message that says how to fix it.",
      "Empty states explain what the screen is for and offer the action that fills it.",
      "Show a save state, a last-edited-by line and a link to the live page on every editable record.",
      "Same accessibility standard as the public site: WCAG 2.1 AA, keyboard operable, labelled fields, visible focus, announced errors.",
      "The admin shares the site's design tokens but is visually distinct enough that nobody confuses editing with browsing.",
    ]),
  );
}

function securitySection(project: MerchantWebsiteProject): string {
  const features = activeFeatures(project);
  const privateFiles = [
    features.has("job-applications") ? "CVs" : "",
    features.has("customer-portal") ? "customer documents and invoices" : "",
  ].filter(Boolean);

  return section(
    "BACK OFFICE - SECURITY AND DATA",
    bullets([
      "Authentication with hashed passwords, secure httpOnly session cookies, CSRF protection, session expiry and login rate limiting. Optional two-factor for owners.",
      "Every admin route and API endpoint checks authentication and role on the server. No admin data is reachable without a session.",
      `Uploads validated by type and size, stripped of scripts, and served from a path that cannot execute code. Private files${privateFiles.length ? ` - ${joinList(privateFiles)}` : ""} are served only through signed, expiring links, never from the public media path.`,
      "Secrets and integration credentials live in environment variables or encrypted at rest, and are never sent to the browser or committed.",
      "Customer data can be exported and deleted on request, with a stated retention period for enquiries.",
      "Automated database backups with a documented restore procedure, and a full data export the owner can run themselves.",
      "The admin is excluded from indexing and from the sitemap.",
    ]),
  );
}

function deliverySection(): string {
  return section(
    "BACK OFFICE - DELIVERY",
    bullets([
      "Database schema with migrations, and a seed script that loads every piece of content in this brief.",
      "A documented owner account for first login, with a forced password change.",
      "A .env.example listing every variable needed, with no real secrets in it.",
      "A short README covering how to run it, how to deploy it, and how to add a user.",
      "Automated tests over at least: authentication and role enforcement, a form submission becoming an enquiry, and publishing a content change appearing on the public page.",
    ]),
  );
}

/** The BACK OFFICE blocks of the generation prompt, in order. */
export function buildBackOfficeSections(
  project: MerchantWebsiteProject,
  _report: WebsiteReport,
  facts: ProjectFacts,
): string[] {
  return [
    overviewSection(facts),
    modulesSection(project, facts),
    dataModelSection(project),
    connectionSection(project, facts),
    rolesSection(project),
    notificationsSection(project),
    adminUxSection(facts),
    securitySection(project),
    deliverySection(),
  ];
}
