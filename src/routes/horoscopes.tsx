import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Moon, RefreshCw, Sparkles, Sun } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { ClientSubnav } from "@/components/client-subnav";

export const Route = createFileRoute("/horoscopes")({
  head: () => ({
    meta: [
      { title: "Daily & Weekly Horoscopes — MeetYourPsychic" },
      {
        name: "description",
        content:
          "AI-generated daily and weekly horoscopes tailored to your saved zodiac sign, with love, career and energy readings.",
      },
      { property: "og:title", content: "Daily & Weekly Horoscopes — MeetYourPsychic" },
      {
        property: "og:description",
        content: "AI-generated daily and weekly horoscopes for your saved zodiac sign.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HoroscopesPage,
});

const signs = [
  { name: "Aries", dates: "Mar 21 – Apr 19", element: "Fire" },
  { name: "Taurus", dates: "Apr 20 – May 20", element: "Earth" },
  { name: "Gemini", dates: "May 21 – Jun 20", element: "Air" },
  { name: "Cancer", dates: "Jun 21 – Jul 22", element: "Water" },
  { name: "Leo", dates: "Jul 23 – Aug 22", element: "Fire" },
  { name: "Virgo", dates: "Aug 23 – Sep 22", element: "Earth" },
  { name: "Libra", dates: "Sep 23 – Oct 22", element: "Air" },
  { name: "Scorpio", dates: "Oct 23 – Nov 21", element: "Water" },
  { name: "Sagittarius", dates: "Nov 22 – Dec 21", element: "Fire" },
  { name: "Capricorn", dates: "Dec 22 – Jan 19", element: "Earth" },
  { name: "Aquarius", dates: "Jan 20 – Feb 18", element: "Air" },
  { name: "Pisces", dates: "Feb 19 – Mar 20", element: "Water" },
];

const daily: Record<string, string> = {
  default:
    "Momentum returns today, but it arrives quietly. A message you have been half-expecting reframes a decision you thought was already settled. Resist the urge to answer immediately — the strongest position you hold right now is patience. By evening the picture clarifies and the choice makes itself.",
};

const weekly =
  "This week asks you to close a loop rather than open a new one. Midweek brings a conversation that has been circling for a while; say the plain version of what you mean and the tension drops. Money and energy both stabilise after Thursday, and the weekend favours rest over ambition. Something you released last month comes back on better terms.";

const facets = [
  { label: "Love", score: 82, text: "Warmth returns after a cool stretch. Reach out first." },
  { label: "Career", score: 68, text: "Steady progress. Avoid renegotiating before Friday." },
  { label: "Energy", score: 74, text: "Good stamina, low patience. Protect your mornings." },
  { label: "Luck", score: 55, text: "Neutral. Favour the safe option over the bold one." },
];

function HoroscopesPage() {
  const [sign, setSign] = useState("Libra");
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [nonce, setNonce] = useState(0);

  const current = signs.find((s) => s.name === sign)!;

  return (
    <DashboardShell
      role="client"
      title="Horoscopes"
      subtitle="AI-generated readings tuned to your saved zodiac sign."
    >
      <ClientSubnav />

      <section className="rounded-lg border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Your saved sign
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">{current.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {current.dates} · {current.element} sign
            </p>
          </div>
          <div className="flex rounded-md border border-border p-1">
            {(["daily", "weekly"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  view === v
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v === "daily" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="no-scrollbar -mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-1">
          {signs.map((s) => (
            <button
              key={s.name}
              onClick={() => setSign(s.name)}
              className={`shrink-0 rounded-md border px-3.5 py-2 text-sm font-semibold transition-colors ${
                sign === s.name
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-lg border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <Sparkles className="h-4 w-4" />
              {view === "daily" ? "Thursday, September 10" : "Week of September 7 – 13"}
            </p>
            <button
              onClick={() => setNonce((n) => n + 1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </button>
          </div>
          <p key={nonce} className="mt-4 text-base leading-relaxed text-foreground">
            {view === "daily" ? daily["default"] : weekly}
          </p>
          <p className="mt-6 rounded-md border border-border bg-secondary/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            Generated for {current.name} using your quiz answers and recent reading history.
            Horoscopes are for reflection and entertainment.
          </p>
        </section>

        <section className="space-y-4">
          {facets.map((f) => (
            <div key={f.label} className="rounded-lg border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{f.label}</p>
                <span className="text-sm font-bold text-primary">{f.score}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-md bg-secondary">
                <div
                  style={{ width: `${f.score}%` }}
                  className="h-full rounded-md bg-primary transition-[width] duration-500"
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
          <div className="rounded-lg border border-border bg-primary p-5 shadow-lift">
            <p className="text-sm font-semibold text-primary-foreground">
              Want the full chart reading?
            </p>
            <p className="mt-1 text-xs leading-relaxed text-primary-foreground/85">
              Book an astrologer to go deeper than the daily forecast.
            </p>
            <button className="mt-4 w-full rounded-md bg-card px-4 py-2.5 text-sm font-semibold text-primary transition-opacity hover:opacity-90">
              Find an astrologer
            </button>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
