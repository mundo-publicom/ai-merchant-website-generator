import type { BusinessHours, WeekDay } from "@/types/project";
import { WEEK_DAYS } from "@/data/options";

export function titleCase(value: string): string {
  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Join a list into readable prose: "a, b and c". */
export function joinList(items: string[], conjunction = "and"): string {
  const clean = items.map((i) => i.trim()).filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0];
  if (clean.length === 2) return `${clean[0]} ${conjunction} ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")} ${conjunction} ${clean[clean.length - 1]}`;
}

export function sentence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const capped = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return /[.!?]$/.test(capped) ? capped : `${capped}.`;
}

export function formatTime(value: string): string {
  const [hoursRaw, minutesRaw] = value.split(":");
  const hours = Number(hoursRaw);
  if (Number.isNaN(hours)) return value;
  const suffix = hours >= 12 ? "PM" : "AM";
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${minutesRaw ?? "00"} ${suffix}`;
}

export function formatBusinessHours(hours: BusinessHours): string[] {
  if (hours.open24) return ["Open 24 hours, 7 days a week"];
  return WEEK_DAYS.map(({ value, label }) => {
    const day = hours.days[value as WeekDay];
    if (!day || day.closed) return `${label}: Closed`;
    return `${label}: ${formatTime(day.open)} – ${formatTime(day.close)}`;
  });
}

export function hasAnyHours(hours: BusinessHours): boolean {
  return hours.open24 || WEEK_DAYS.some(({ value }) => !hours.days[value as WeekDay].closed);
}

export function normalizeUrl(value?: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function displayUrl(value?: string): string {
  const normalized = normalizeUrl(value);
  return normalized.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export function formatAddress(parts: {
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}): string {
  const line1 = [parts.address, parts.address2].filter(Boolean).join(", ");
  const line2 = [parts.city, parts.state].filter(Boolean).join(", ");
  const line3 = [line2, parts.postalCode].filter(Boolean).join(" ");
  return [line1, line3, parts.country].filter(Boolean).join(", ");
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString();
}

export function bullets(items: string[], marker = "- "): string {
  return items.filter(Boolean).map((item) => `${marker}${item}`).join("\n");
}

export function numbered(items: string[]): string {
  return items.filter(Boolean).map((item, index) => `${index + 1}. ${item}`).join("\n");
}

/**
 * A titled block for the generated prompt: `TITLE\n\nbody`.
 * Returns an empty string when the body is empty, so callers can filter blocks out.
 */
export function promptSection(title: string, body: string | string[]): string {
  const content = Array.isArray(body) ? body.filter(Boolean).join("\n") : body;
  if (!content.trim()) return "";
  return `${title}\n\n${content.trim()}`;
}
