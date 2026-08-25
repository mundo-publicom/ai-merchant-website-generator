export interface IndustryOption {
  value: string;
  label: string;
  group: string;
  /** Hints used by the recommendation engine. */
  traits?: Array<
    | "emergency"
    | "menu"
    | "portfolio"
    | "booking"
    | "ecommerce"
    | "local-service"
    | "professional"
    | "health"
    | "hospitality"
  >;
}

export const INDUSTRIES: IndustryOption[] = [
  { value: "restaurant", label: "Restaurant", group: "Food & Hospitality", traits: ["menu", "hospitality", "booking"] },
  { value: "cafe", label: "Café / Coffee Shop", group: "Food & Hospitality", traits: ["menu", "hospitality"] },
  { value: "bakery", label: "Bakery", group: "Food & Hospitality", traits: ["menu", "hospitality"] },
  { value: "bar", label: "Bar / Brewery", group: "Food & Hospitality", traits: ["menu", "hospitality"] },
  { value: "catering", label: "Catering", group: "Food & Hospitality", traits: ["menu", "booking"] },
  { value: "food-truck", label: "Food Truck", group: "Food & Hospitality", traits: ["menu"] },
  { value: "hotel", label: "Hotel / Lodging", group: "Food & Hospitality", traits: ["booking", "hospitality"] },

  { value: "locksmith", label: "Locksmith", group: "Home & Trade Services", traits: ["emergency", "local-service"] },
  { value: "plumber", label: "Plumbing", group: "Home & Trade Services", traits: ["emergency", "local-service"] },
  { value: "electrician", label: "Electrical", group: "Home & Trade Services", traits: ["emergency", "local-service"] },
  { value: "hvac", label: "HVAC / Air Conditioning", group: "Home & Trade Services", traits: ["emergency", "local-service"] },
  { value: "roofing", label: "Roofing", group: "Home & Trade Services", traits: ["local-service", "portfolio"] },
  { value: "general-contractor", label: "General Contractor", group: "Home & Trade Services", traits: ["local-service", "portfolio"] },
  { value: "remodeling", label: "Remodeling / Renovation", group: "Home & Trade Services", traits: ["portfolio", "local-service"] },
  { value: "landscaping", label: "Landscaping / Lawn Care", group: "Home & Trade Services", traits: ["local-service", "portfolio"] },
  { value: "cleaning", label: "Cleaning Services", group: "Home & Trade Services", traits: ["local-service", "booking"] },
  { value: "pest-control", label: "Pest Control", group: "Home & Trade Services", traits: ["local-service"] },
  { value: "moving", label: "Moving & Storage", group: "Home & Trade Services", traits: ["local-service"] },
  { value: "painting", label: "Painting", group: "Home & Trade Services", traits: ["local-service", "portfolio"] },
  { value: "pool-service", label: "Pool Service", group: "Home & Trade Services", traits: ["local-service"] },
  { value: "garage-door", label: "Garage Doors", group: "Home & Trade Services", traits: ["emergency", "local-service"] },
  { value: "towing", label: "Towing / Roadside", group: "Home & Trade Services", traits: ["emergency", "local-service"] },

  { value: "salon", label: "Hair Salon", group: "Beauty & Wellness", traits: ["booking", "portfolio"] },
  { value: "barber", label: "Barbershop", group: "Beauty & Wellness", traits: ["booking"] },
  { value: "spa", label: "Spa", group: "Beauty & Wellness", traits: ["booking"] },
  { value: "nail-salon", label: "Nail Salon", group: "Beauty & Wellness", traits: ["booking", "portfolio"] },
  { value: "tattoo", label: "Tattoo Studio", group: "Beauty & Wellness", traits: ["portfolio", "booking"] },
  { value: "fitness", label: "Gym / Fitness Studio", group: "Beauty & Wellness", traits: ["booking"] },
  { value: "yoga", label: "Yoga / Pilates Studio", group: "Beauty & Wellness", traits: ["booking"] },
  { value: "personal-trainer", label: "Personal Training", group: "Beauty & Wellness", traits: ["booking"] },

  { value: "dentist", label: "Dental Practice", group: "Health & Medical", traits: ["health", "booking"] },
  { value: "doctor", label: "Medical Practice", group: "Health & Medical", traits: ["health", "booking"] },
  { value: "chiropractor", label: "Chiropractic", group: "Health & Medical", traits: ["health", "booking"] },
  { value: "veterinary", label: "Veterinary Clinic", group: "Health & Medical", traits: ["health", "booking"] },
  { value: "therapy", label: "Therapy / Counseling", group: "Health & Medical", traits: ["health", "booking"] },
  { value: "optometry", label: "Optometry", group: "Health & Medical", traits: ["health", "booking"] },
  { value: "home-care", label: "Home Care / Senior Care", group: "Health & Medical", traits: ["health", "local-service"] },

  { value: "law-firm", label: "Law Firm", group: "Professional Services", traits: ["professional"] },
  { value: "accounting", label: "Accounting / Bookkeeping", group: "Professional Services", traits: ["professional"] },
  { value: "insurance", label: "Insurance Agency", group: "Professional Services", traits: ["professional"] },
  { value: "financial-advisor", label: "Financial Advisory", group: "Professional Services", traits: ["professional"] },
  { value: "consulting", label: "Consulting", group: "Professional Services", traits: ["professional"] },
  { value: "marketing-agency", label: "Marketing Agency", group: "Professional Services", traits: ["professional", "portfolio"] },
  { value: "it-services", label: "IT Services / MSP", group: "Professional Services", traits: ["professional"] },
  { value: "staffing", label: "Staffing / Recruiting", group: "Professional Services", traits: ["professional"] },
  { value: "architecture", label: "Architecture", group: "Professional Services", traits: ["portfolio", "professional"] },
  { value: "photography", label: "Photography", group: "Professional Services", traits: ["portfolio", "booking"] },
  { value: "event-planning", label: "Event Planning", group: "Professional Services", traits: ["portfolio", "booking"] },

  { value: "real-estate", label: "Real Estate", group: "Property & Auto", traits: ["portfolio", "local-service"] },
  { value: "property-management", label: "Property Management", group: "Property & Auto", traits: ["local-service"] },
  { value: "auto-repair", label: "Auto Repair", group: "Property & Auto", traits: ["local-service", "booking"] },
  { value: "auto-detailing", label: "Auto Detailing", group: "Property & Auto", traits: ["local-service", "booking"] },
  { value: "car-dealership", label: "Car Dealership", group: "Property & Auto", traits: ["portfolio"] },

  { value: "retail", label: "Retail Store", group: "Retail & Commerce", traits: ["ecommerce"] },
  { value: "ecommerce", label: "Online Store", group: "Retail & Commerce", traits: ["ecommerce"] },
  { value: "florist", label: "Florist", group: "Retail & Commerce", traits: ["ecommerce"] },
  { value: "jewelry", label: "Jewelry", group: "Retail & Commerce", traits: ["ecommerce", "portfolio"] },
  { value: "furniture", label: "Furniture / Home Goods", group: "Retail & Commerce", traits: ["ecommerce", "portfolio"] },

  { value: "travel-agency", label: "Travel Agency", group: "Travel & Education", traits: ["booking"] },
  { value: "tours", label: "Tours & Activities", group: "Travel & Education", traits: ["booking"] },
  { value: "school", label: "School / Education", group: "Travel & Education", traits: [] },
  { value: "tutoring", label: "Tutoring", group: "Travel & Education", traits: ["booking"] },
  { value: "childcare", label: "Childcare / Daycare", group: "Travel & Education", traits: [] },

  { value: "nonprofit", label: "Nonprofit", group: "Other", traits: [] },
  { value: "church", label: "Church / Religious Organization", group: "Other", traits: [] },
  { value: "manufacturing", label: "Manufacturing", group: "Other", traits: ["professional"] },
  { value: "wholesale", label: "Wholesale / Distribution", group: "Other", traits: ["professional"] },
  { value: "construction-supply", label: "Construction Supply", group: "Other", traits: ["professional"] },
];

export const INDUSTRY_BY_VALUE = new Map(INDUSTRIES.map((i) => [i.value, i]));

export function industryLabel(value: string): string {
  if (!value) return "";
  if (value.startsWith("custom:")) return value.slice("custom:".length);
  return INDUSTRY_BY_VALUE.get(value)?.label ?? value;
}

export function industryTraits(value: string): string[] {
  if (!value || value.startsWith("custom:")) return [];
  return INDUSTRY_BY_VALUE.get(value)?.traits ?? [];
}
