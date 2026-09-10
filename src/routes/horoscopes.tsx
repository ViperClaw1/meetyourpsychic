import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Droplets, Flame, Gem, Moon, RefreshCw, Sparkles, Sun, Wind } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { ClientSubnav } from "@/components/client-subnav";
import { AdvisorCard } from "@/components/advisor-card";
import { advisors } from "@/data/advisors";

export const Route = createFileRoute("/horoscopes")({
  head: () => ({
    meta: [
      { title: "Daily, Weekly & Monthly Horoscopes — MeetYourPsychic" },
      {
        name: "description",
        content:
          "Cosmic daily, weekly and monthly horoscopes tuned to your zodiac sign, with love, career and energy readings plus sign facts.",
      },
      { property: "og:title", content: "Daily, Weekly & Monthly Horoscopes — MeetYourPsychic" },
      {
        property: "og:description",
        content: "Cosmic horoscopes for your zodiac sign, with sign facts and matching advisors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HoroscopesPage,
});

type Sign = {
  name: string;
  dates: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  ruler: string;
  stone: string;
  lucky: string;
  traits: string;
};

const signs: Sign[] = [
  { name: "Aries", dates: "Mar 21 – Apr 19", element: "Fire", ruler: "Mars", stone: "Bloodstone", lucky: "9", traits: "Bold · Direct · Restless" },
  { name: "Taurus", dates: "Apr 20 – May 20", element: "Earth", ruler: "Venus", stone: "Emerald", lucky: "6", traits: "Steady · Sensual · Loyal" },
  { name: "Gemini", dates: "May 21 – Jun 20", element: "Air", ruler: "Mercury", stone: "Agate", lucky: "5", traits: "Curious · Quick · Social" },
  { name: "Cancer", dates: "Jun 21 – Jul 22", element: "Water", ruler: "Moon", stone: "Moonstone", lucky: "2", traits: "Tender · Guarded · Intuitive" },
  { name: "Leo", dates: "Jul 23 – Aug 22", element: "Fire", ruler: "Sun", stone: "Ruby", lucky: "1", traits: "Warm · Proud · Generous" },
  { name: "Virgo", dates: "Aug 23 – Sep 22", element: "Earth", ruler: "Mercury", stone: "Sapphire", lucky: "5", traits: "Precise · Kind · Analytical" },
  { name: "Libra", dates: "Sep 23 – Oct 22", element: "Air", ruler: "Venus", stone: "Opal", lucky: "7", traits: "Fair · Charming · Weighing" },
  { name: "Scorpio", dates: "Oct 23 – Nov 21", element: "Water", ruler: "Pluto", stone: "Topaz", lucky: "8", traits: "Deep · Private · Magnetic" },
  { name: "Sagittarius", dates: "Nov 22 – Dec 21", element: "Fire", ruler: "Jupiter", stone: "Turquoise", lucky: "3", traits: "Free · Honest · Seeking" },
  { name: "Capricorn", dates: "Dec 22 – Jan 19", element: "Earth", ruler: "Saturn", stone: "Garnet", lucky: "4", traits: "Patient · Driven · Wry" },
  { name: "Aquarius", dates: "Jan 20 – Feb 18", element: "Air", ruler: "Uranus", stone: "Amethyst", lucky: "11", traits: "Original · Cool · Visionary" },
  { name: "Pisces", dates: "Feb 19 – Mar 20", element: "Water", ruler: "Neptune", stone: "Aquamarine", lucky: "12", traits: "Dreamy · Porous · Kind" },
];

const elementIcon = {
  Fire: Flame,
  Earth: Gem,
  Air: Wind,
  Water: Droplets,
} as const;

type View = "today" | "week" | "month";

const narrative: Record<View, string[]> = {
  today: [
    "Momentum returns today, but it arrives quietly. A message you have been half-expecting reframes a decision you thought was already settled. Resist the urge to answer immediately — the strongest position you hold right now is patience.",
    "By late afternoon a small practical win restores your confidence. Someone who has been distant softens; let them come the rest of the way. By evening the picture clarifies and the choice makes itself.",
  ],
  week: [
    "This week asks you to close a loop rather than open a new one. Midweek brings a conversation that has been circling for a while; say the plain version of what you mean and the tension drops.",
    "Money and energy both stabilise after Thursday, and the weekend favours rest over ambition. Something you released last month comes back on better terms — accept it slowly.",
  ],
  month: [
    "The month opens with unfinished business and closes with unexpected freedom. The first ten days reward tidy admin: contracts, apologies, appointments you have been avoiding. None of it is glamorous, and all of it clears the runway.",
    "Mid-month a person from an older chapter reappears with a proposal. Judge it on the terms in front of you, not the history behind it. After the full moon your instincts sharpen — the last week of the month is when you commit.",
  ],
};

const viewLabel: Record<View, string> = {
  today: "Thursday, September 10",
  week: "Week of September 7 – 13",
  month: "September 2026",
};

const facets = [
  { label: "Love", score: 82, text: "Warmth returns after a cool stretch. Reach out first." },
  { label: "Career", score: 68, text: "Steady progress. Avoid renegotiating before Friday." },
  { label: "Energy", score: 74, text: "Good stamina, low patience. Protect your mornings." },
  { label: "Luck", score: 55, text: "Neutral. Favour the safe option over the bold one." },
];

function HoroscopesPage() {
  const [sign, setSign] = useState("Libra");
  const [view, setView] = useState<View>("today");
  const [nonce, setNonce] = useState(0);

  const current = signs.find((s) => s.name === sign)!;
  const ElementIcon = elementIcon[current.element];
  const crossSell = advisors.slice(0, 4);

  return (
    <DashboardShell
      role="client"
      title="Horoscopes"
      subtitle="Cosmic readings tuned to your saved zodiac sign."
    >
      <ClientSubnav />

      {/* Cosmic hero */}
      <section className="relative overflow-hidden rounded-xl border border-border shadow-lg">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#1E1B4B_0%,#4C1D95_45%,#6B46C1_75%,#9333EA_100%)]" />
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="relative px-6 py-10 sm:px-10 sm:py-14">
          <p className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Your saved sign
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {current.name}
          </h2>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
            <span>{current.dates}</span>
            <span className="inline-flex items-center gap-1.5">
              <ElementIcon className="h-4 w-4" />
              {current.element} sign
            </span>
            <span>Ruled by {current.ruler}</span>
          </p>

          {/* Glass toggle */}
          <div className="mt-7 inline-flex rounded-xl border border-white/25 bg-white/10 p-1 backdrop-blur-md">
            {(
              [
                ["today", Sun],
                ["week", CalendarDays],
                ["month", Moon],
              ] as const
            ).map(([v, Icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-all duration-200 ${
                  view === v
                    ? "bg-white text-primary shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {v}
              </button>
            ))}
          </div>

          {/* Sign strip */}
          <div className="no-scrollbar -mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-1">
            {signs.map((s) => (
              <button
                key={s.name}
                onClick={() => setSign(s.name)}
                className={`shrink-0 rounded-lg border px-3.5 py-2 text-sm font-semibold backdrop-blur transition-colors ${
                  sign === s.name
                    ? "border-white bg-white text-primary"
                    : "border-white/25 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        {/* Narrative */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <Sparkles className="h-4 w-4" />
              {viewLabel[view]}
            </p>
            <button
              onClick={() => setNonce((n) => n + 1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-transform hover:scale-105 hover:underline"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </button>
          </div>

          <div key={`${view}-${nonce}-${sign}`} className="animate-fade-in">
            <p className="mt-5 text-lg font-semibold leading-relaxed text-foreground first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-primary">
              {narrative[view][0]}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {narrative[view][1]}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {facets.map((f) => (
              <div key={f.label} className="rounded-xl border border-border bg-secondary/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{f.label}</p>
                  <span className="text-sm font-bold text-primary">{f.score}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-md bg-card">
                  <div
                    style={{ width: `${f.score}%` }}
                    className="h-full rounded-md bg-primary transition-[width] duration-700"
                  />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-lg border border-border bg-secondary/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            Generated for {current.name} using your quiz answers and recent reading history.
            Horoscopes are for reflection and entertainment.
          </p>
        </section>

        {/* Sticky sign facts */}
        <aside className="lg:sticky lg:top-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <ElementIcon className="h-4 w-4" />
              Sign facts
            </p>
            <dl className="mt-4 divide-y divide-border">
              <Fact label="Element" value={current.element} />
              <Fact label="Ruling planet" value={current.ruler} />
              <Fact label="Birth stone" value={current.stone} />
              <Fact label="Lucky number" value={current.lucky} />
              <Fact label="Dates" value={current.dates} />
            </dl>
            <p className="mt-4 rounded-lg bg-primary-soft px-3.5 py-3 text-xs font-semibold leading-relaxed text-primary">
              {current.traits}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-primary p-6 shadow-lg">
            <p className="text-sm font-semibold text-primary-foreground">
              Want the full chart reading?
            </p>
            <p className="mt-1 text-xs leading-relaxed text-primary-foreground/85">
              Book an astrologer to go deeper than the {view === "today" ? "daily" : view} forecast.
            </p>
            <button className="mt-4 w-full rounded-lg bg-card px-4 py-2.5 text-sm font-semibold text-primary transition-opacity hover:opacity-90">
              Find an astrologer
            </button>
          </div>
        </aside>
      </div>

      {/* Cross-sell */}
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Astrologers for {current.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Advisors who work with {current.element.toLowerCase()} signs and natal charts.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {crossSell.map((a) => (
            <AdvisorCard key={a.id} advisor={a} />
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}
