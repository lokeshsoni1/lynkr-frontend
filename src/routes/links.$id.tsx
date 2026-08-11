import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BreakdownBars, ClicksChart, StatCard, StatusPill } from "@/components/analytics-widgets";
import { useStore, transformLink } from "@/lib/store";
import { apiClient } from "@/api/client";
import {
  BROWSERS,
  CLICKS_30D,
  CLICKS_7D,
  DEVICES,
  RECENT_ACTIVITY,
  REFERRERS,
  formatDate,
  isExpired,
  type LinkRecord,
} from "@/lib/mock-data";
import { getShortUrl } from "@/config/constants";

export const Route = createFileRoute("/links/$id")({
  head: () => ({
    meta: [
      { title: "Link analytics — Lynkr" },
      { name: "description", content: "Clicks, devices, browsers and referrers for a single Lynkr short link." },
      { property: "og:title", content: "Link analytics — Lynkr" },
      { property: "og:description", content: "Detailed performance for one short link." },
    ],
  }),
  component: LinkDetail,
});

function LinkDetail() {
  const { id } = Route.useParams();
  const { links } = useStore();
  const [apiLink, setApiLink] = useState<LinkRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<"7" | "30">("7");

  useEffect(() => {
    const existing = links.find((l) => l.id === id);
    if (existing) {
      setApiLink(existing);
      return;
    }
    setLoading(true);
    apiClient
      .get(`/api/links/${id}`)
      .then((res) => {
        setApiLink(transformLink(res.data));
      })
      .catch((err) => {
        console.warn(`Failed to fetch link ${id} details from API`, err);
      })
      .finally(() => setLoading(false));
  }, [id, links]);

  const link = apiLink || links.find((l) => l.id === id);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-sm text-muted-foreground">Loading link details...</p>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-2xl font-semibold tracking-tight">Link not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This link may have been deleted.
        </p>
        <Button asChild className="mt-6">
          <Link to="/links">Back to My Links</Link>
        </Button>
      </div>
    );
  }

  const expired = isExpired(link);
  const displayUrl = getShortUrl(link.slug);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <Link to="/links" className="text-sm text-muted-foreground hover:text-foreground">
        ← My Links
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-2xl font-semibold tracking-tight">
          {displayUrl}
        </h1>
        <StatusPill expired={expired} />
      </div>
      <p className="mt-2 max-w-2xl truncate text-sm text-muted-foreground">{link.original}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Created {formatDate(link.createdAt)} · Expires {formatDate(link.expiresAt)}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="TOTAL CLICKS" value={link.clicks.toLocaleString()} />
        <StatCard label="UNIQUE VISITORS" value={Math.round(link.clicks * 0.69).toLocaleString()} />
        <StatCard label="AVG. CLICKS / DAY" value={Math.max(0, Math.round(link.clicks / 14)).toString()} />
        <StatCard label="STATUS" value={expired ? "Expired" : "Active"} />
      </div>

      <div className="panel mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="eyebrow">CLICKS OVER TIME</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={range === "7" ? "default" : "outline"}
              onClick={() => setRange("7")}
            >
              7 Days
            </Button>
            <Button
              size="sm"
              variant={range === "30" ? "default" : "outline"}
              onClick={() => setRange("30")}
            >
              30 Days
            </Button>
          </div>
        </div>
        <div className="mt-6">
          {(range === "7" ? CLICKS_7D : CLICKS_30D).length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No click activity recorded yet for this link.</p>
          ) : (
            <ClicksChart data={range === "7" ? CLICKS_7D : CLICKS_30D} />
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="panel p-6">
          <p className="eyebrow">DEVICES</p>
          <div className="mt-5">
            {DEVICES.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No data available</p>
            ) : (
              <BreakdownBars items={DEVICES} />
            )}
          </div>
        </div>
        <div className="panel p-6">
          <p className="eyebrow">BROWSERS</p>
          <div className="mt-5">
            {BROWSERS.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No data available</p>
            ) : (
              <BreakdownBars items={BROWSERS} />
            )}
          </div>
        </div>
        <div className="panel p-6">
          <p className="eyebrow">TRAFFIC SOURCES</p>
          <div className="mt-5">
            {REFERRERS.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No data available</p>
            ) : (
              <BreakdownBars items={REFERRERS} />
            )}
          </div>
        </div>
      </div>

      <div className="panel mt-6 p-6">
        <p className="eyebrow">RECENT ACTIVITY</p>
        {RECENT_ACTIVITY.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No recent click activity recorded.</p>
        ) : (
          <ul className="mt-5 divide-y divide-border">
            {RECENT_ACTIVITY.map((a, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="font-mono text-muted-foreground">{displayUrl}</span>
                <span className="text-muted-foreground">
                  {a.device} · {a.source}
                </span>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
