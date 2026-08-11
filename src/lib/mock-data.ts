export type LinkRecord = {
  id: string;
  slug: string;
  original: string;
  clicks: number;
  createdAt: string;
  expiresAt: string | null;
};

export const SHORT_DOMAIN = "https://lynkr.ly";

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

const day = 86400e3;
const ago = (d: number) => new Date(Date.now() - d * day).toISOString();
const ahead = (d: number) => new Date(Date.now() + d * day).toISOString();

export const SEED_LINKS: LinkRecord[] = [
  {
    id: "1",
    slug: "aB12xZ",
    original: "https://example.com/blog/2026/how-we-scaled-our-edge-network",
    clicks: 1284,
    createdAt: ago(12),
    expiresAt: null,
  },
  {
    id: "2",
    slug: "launch",
    original: "https://example.com/product/launch-announcement?utm_source=twitter",
    clicks: 642,
    createdAt: ago(8),
    expiresAt: ahead(21),
  },
  {
    id: "3",
    slug: "hire9k",
    original: "https://careers.example.com/openings/senior-frontend-engineer",
    clicks: 318,
    createdAt: ago(5),
    expiresAt: ahead(3),
  },
  {
    id: "4",
    slug: "beta24",
    original: "https://example.com/beta/invite/early-access-program",
    clicks: 174,
    createdAt: ago(30),
    expiresAt: ago(2),
  },
  {
    id: "5",
    slug: "docsQ7",
    original: "https://docs.example.com/getting-started/installation",
    clicks: 63,
    createdAt: ago(2),
    expiresAt: null,
  },
];

export const CLICKS_7D = [
  { label: "Mon", clicks: 182 },
  { label: "Tue", clicks: 254 },
  { label: "Wed", clicks: 221 },
  { label: "Thu", clicks: 318 },
  { label: "Fri", clicks: 402 },
  { label: "Sat", clicks: 287 },
  { label: "Sun", clicks: 341 },
];

export const CLICKS_30D = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  clicks: 120 + Math.round(180 * Math.abs(Math.sin(i / 3.2))) + (i % 5) * 14,
}));

export const DEVICES = [
  { label: "Mobile", value: 68 },
  { label: "Desktop", value: 28 },
  { label: "Tablet", value: 4 },
];

export const BROWSERS = [
  { label: "Chrome", value: 61 },
  { label: "Safari", value: 24 },
  { label: "Firefox", value: 9 },
  { label: "Edge", value: 6 },
];

export const REFERRERS = [
  { label: "Direct", value: 44 },
  { label: "Twitter / X", value: 26 },
  { label: "LinkedIn", value: 18 },
  { label: "Newsletter", value: 12 },
];

export const RECENT_ACTIVITY = [
  { slug: "aB12xZ", device: "Mobile", source: "Twitter / X", time: "2 minutes ago" },
  { slug: "launch", device: "Desktop", source: "Direct", time: "14 minutes ago" },
  { slug: "docsQ7", device: "Mobile", source: "LinkedIn", time: "38 minutes ago" },
  { slug: "aB12xZ", device: "Desktop", source: "Newsletter", time: "1 hour ago" },
  { slug: "hire9k", device: "Tablet", source: "Direct", time: "3 hours ago" },
  { slug: "launch", device: "Mobile", source: "Twitter / X", time: "5 hours ago" },
];
