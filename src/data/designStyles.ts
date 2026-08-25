export interface DesignStyle {
  value: string;
  label: string;
  description: string;
  /** Short direction sentences injected into the generated design brief. */
  direction: string;
  typography: string;
  swatches: [string, string, string];
}

export const DESIGN_STYLES: DesignStyle[] = [
  {
    value: "modern-minimal",
    label: "Modern Minimal",
    description: "Large typography, generous spacing, clean layouts.",
    direction:
      "Restrained, spacious layouts with very few competing elements. Let type and whitespace do the work.",
    typography: "Large sans-serif headings with tight tracking and calm, readable body text.",
    swatches: ["#0b0d12", "#f4f4f6", "#c8ccd6"],
  },
  {
    value: "professional-corporate",
    label: "Professional Corporate",
    description: "Structured, credible, business-oriented.",
    direction:
      "Clear grid structure, consistent card patterns and a confident, businesslike tone throughout.",
    typography: "Medium-weight sans-serif headings with a disciplined type scale.",
    swatches: ["#16305c", "#f2f5fa", "#3f6fd6"],
  },
  {
    value: "bold-contemporary",
    label: "Bold Contemporary",
    description: "Strong typography, high contrast, modern layouts.",
    direction:
      "High-contrast sections, oversized headlines and decisive color blocking. Nothing timid.",
    typography: "Heavy display headings paired with a plain, highly legible body face.",
    swatches: ["#101014", "#f5ff4d", "#ff4d3d"],
  },
  {
    value: "premium-luxury",
    label: "Premium / Luxury",
    description: "Elegant typography, refined imagery, restrained design.",
    direction:
      "Quiet luxury: deep neutrals, wide margins, slow reveals and photography given room to breathe.",
    typography: "Serif or high-contrast display headings with delicate letter-spaced labels.",
    swatches: ["#1a1713", "#efe9df", "#a4854f"],
  },
  {
    value: "friendly-local",
    label: "Friendly Local Business",
    description: "Warm, approachable, easy to navigate.",
    direction:
      "Warm color, rounded shapes, plain language and obvious next steps on every screen.",
    typography: "Rounded, friendly sans-serif with comfortable line height.",
    swatches: ["#1f4d3d", "#fff6ea", "#f2994a"],
  },
  {
    value: "editorial",
    label: "Editorial",
    description: "Story-driven layout with strong photography.",
    direction:
      "Magazine-style rhythm: full-bleed imagery, pull quotes and asymmetric text columns.",
    typography: "Serif headlines, generous leading, small-caps labels.",
    swatches: ["#161412", "#faf8f4", "#8c4a2f"],
  },
  {
    value: "technology",
    label: "Technology",
    description: "Modern interface patterns and product-focused design.",
    direction:
      "Product-style sections, precise spacing, subtle gradients and interface-like detail.",
    typography: "Geometric sans-serif with a monospaced accent for labels and data.",
    swatches: ["#0d1117", "#e8edf5", "#4250e0"],
  },
  {
    value: "classic",
    label: "Classic",
    description: "Traditional, familiar, trustworthy design.",
    direction:
      "Conventional structure with a clear header, obvious navigation and unsurprising layouts.",
    typography: "Traditional serif or transitional sans headings, conservative sizing.",
    swatches: ["#233252", "#f6f4ef", "#9c1f28"],
  },
];

export const DESIGN_STYLE_BY_VALUE = new Map(DESIGN_STYLES.map((s) => [s.value, s]));

export function designStyleLabel(value?: string): string {
  if (!value) return "";
  return DESIGN_STYLE_BY_VALUE.get(value)?.label ?? value;
}
