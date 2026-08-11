import { SHORT_URL_PREFIX } from "@/config/constants";

export type LinkRecord = {
  id: string;
  slug: string;
  original: string;
  clicks: number;
  createdAt: string;
  expiresAt: string | null;
};

export const SHORT_DOMAIN = SHORT_URL_PREFIX.replace(/\/$/, "");

export const EXPIRATION_OPTIONS = [
  { value: "never", label: "Never" },
  { value: "1h", label: "1 Hour" },
  { value: "24h", label: "24 Hours" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "custom", label: "Custom" },
] as const;

export function expiryFromOption(value: string): string | null {
  const now = Date.now();
  const map: Record<string, number> = {
    "1h": 3600e3,
    "24h": 86400e3,
    "7d": 7 * 86400e3,
    "30d": 30 * 86400e3,
    custom: 90 * 86400e3,
  };
  return map[value] ? new Date(now + map[value]).toISOString() : null;
}

export function randomSlug(len = 6) {
  const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function isExpired(link: LinkRecord) {
  return !!link.expiresAt && new Date(link.expiresAt).getTime() < Date.now();
}

export function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const SEED_LINKS: LinkRecord[] = [];
export const CLICKS_7D: { label: string; clicks: number }[] = [];
export const CLICKS_30D: { label: string; clicks: number }[] = [];
export const DEVICES: { label: string; value: number }[] = [];
export const BROWSERS: { label: string; value: number }[] = [];
export const REFERRERS: { label: string; value: number }[] = [];
export const RECENT_ACTIVITY: { slug: string; device: string; source: string; time: string }[] = [];

