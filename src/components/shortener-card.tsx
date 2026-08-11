import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EXPIRATION_OPTIONS } from "@/lib/mock-data";
import { formatShortUrl, getShortUrl } from "@/config/constants";
import { useStore } from "@/lib/store";
import { Check, Copy, Link2 } from "lucide-react";

export function ShortenerCard() {
  const { createLink } = useStore();
  const [inputUrl, setInputUrl] = useState("");
  const [aliasInput, setAliasInput] = useState("");
  const [expiration, setExpiration] = useState("never");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const link = await createLink({ original: inputUrl.trim(), alias: aliasInput, expiration });
      const rawCodeOrUrl = (link as any).shortUrl || (link as any).shortCode || link.slug || aliasInput?.trim() || "";
      const generatedShortUrl = formatShortUrl(rawCodeOrUrl);
      setResult(generatedShortUrl);
    } catch (err: any) {
      if (err.response && (err.response.status === 400 || err.response.status === 409)) {
        setError("Custom alias is already in use. Try another.");
      } else {
        setError("Failed to create short link. Please try again.");
      }
    } finally {
      setLoading(false);
      setCopied(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(formatShortUrl(result));
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="panel p-6 shadow-2xl transition-all duration-300 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/20 sm:p-8">
      <form onSubmit={submit} className="w-full relative z-30 flex flex-col gap-3 sm:flex-row pointer-events-auto">
        <div className="relative flex-1 pointer-events-auto">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground z-10" />
          <input
            type="url"
            required
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste long URL here (e.g. https://example.com)..."
            className="relative z-20 h-12 w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-9 pr-4 text-base text-white shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 pointer-events-auto md:text-sm"
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button
          type="submit"
          className="relative z-20 h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg cursor-pointer transition-all duration-200 pointer-events-auto disabled:opacity-50 sm:w-40"
          disabled={loading}
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      <Accordion type="single" collapsible className="mt-2">
        <AccordionItem value="customize" className="border-b-0">
          <AccordionTrigger className="text-sm text-muted-foreground outline-none hover:text-foreground">
            Customize your link
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 pt-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="alias">Custom alias</Label>
                <Input
                  id="alias"
                  value={aliasInput}
                  onChange={(e) => setAliasInput(e.target.value)}
                  placeholder="my-campaign"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiration">Expiration</Label>
                <Select value={expiration} onValueChange={setExpiration}>
                  <SelectTrigger id="expiration" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPIRATION_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 flex animate-fade-in flex-col gap-3 rounded-xl border border-border bg-secondary/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Your short link</p>
            <p className="mt-1 font-mono text-base text-foreground">{result}</p>
          </div>
          <Button
            variant="outline"
            onClick={copy}
            className={`gap-2 transition-all duration-200 active:scale-[0.98] sm:w-32 ${
              copied
                ? "scale-105 border-success/30 bg-success/10 text-success"
                : "hover:shadow-[0_0_25px_color-mix(in_oklab,var(--color-primary)_25%,transparent)]"
            }`}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      )}
    </div>
  );
}
