import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Coins,
  Flame,
  Gift,
  Heart,
  HelpCircle,
  Layers,
  Mail,
  Moon,
  Plus,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { AdvisorCard } from "@/components/advisor-card";
import { PreMatchQuiz } from "@/components/prematch-quiz";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth";
import { advisors, favoriteAdvisors } from "@/data/advisors";

export const Route = createFileRoute("/client-dashboard")({
  head: () => ({
    meta: [
      { title: "Your advisor feed — MeetYourPsychic" },
      {
        name: "description",
        content:
          "Browse favourite advisors, recent readings, top-rated psychics, and your daily horoscope in one feed.",
      },
      { property: "og:title", content: "Your advisor feed — MeetYourPsychic" },
      {
        property: "og:description",
        content:
          "Browse favourite advisors, recent readings, top-rated psychics, and your daily horoscope in one feed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientDashboard,
});

const topCategories = [
  { label: "Psychic Readings", icon: Sparkles },
  { label: "Love & Relationships", icon: Heart },
  { label: "Tarot", icon: Layers },
  { label: "Financial", icon: Coins },
  { label: "Life Questions", icon: HelpCircle },
  { label: "Spiritual", icon: Flame },
  { label: "Astrology", icon: Moon },
  { label: "Mediums", icon: Users },
];

const zodiac = [
  { sign: "Aries", glyph: "♈", range: "Mar 21 – Apr 19" },
  { sign: "Taurus", glyph: "♉", range: "Apr 20 – May 20" },
  { sign: "Gemini", glyph: "♊", range: "May 21 – Jun 20" },
  { sign: "Cancer", glyph: "♋", range: "Jun 21 – Jul 22" },
  { sign: "Leo", glyph: "♌", range: "Jul 23 – Aug 22" },
  { sign: "Virgo", glyph: "♍", range: "Aug 23 – Sep 22" },
  { sign: "Libra", glyph: "♎", range: "Sep 23 – Oct 22" },
  { sign: "Scorpio", glyph: "♏", range: "Oct 23 – Nov 21" },
  { sign: "Sagittarius", glyph: "♐", range: "Nov 22 – Dec 21" },
  { sign: "Capricorn", glyph: "♑", range: "Dec 22 – Jan 19" },
  { sign: "Aquarius", glyph: "♒", range: "Jan 20 – Feb 18" },
  { sign: "Pisces", glyph: "♓", range: "Feb 19 – Mar 20" },
];

const byId = (ids: string[]) => advisors.filter((a) => ids.includes(a.id));

const recentReadings = byId(["a2", "a4", "a6"]);
const topAdvisors = byId(["a1", "a5", "a8"]);
const recentlyViewed = byId(["a3", "a7", "a6", "a2", "a8"]);
const similarToViewed = byId(["a8", "a1", "a4"]);
const underFive = advisors.filter((a) => a.pricePerMin < 5).slice(0, 3);

function SectionHeader({
  title,
  hint,
  viewAllTo,
}: {
  title: string;
  hint?: string;
  viewAllTo?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
        {hint ? <p className="mt-0.5 text-sm text-muted-foreground">{hint}</p> : null}
      </div>
      {viewAllTo ? (
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("myp:open-discovery"))}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

function ClientDashboard() {
  const { role, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (ready && role !== "client") navigate({ to: "/login" });
  }, [ready, role, navigate]);

  return (
    <>
      <PreMatchQuiz />
      <div className="flex min-h-screen flex-col bg-app-tint">
        <SiteNav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
          {/* Balances */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-soft">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Wallet className="h-3.5 w-3.5 text-primary" />
                  Clarity Credits Balance
                </p>
                <p className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">$0.00</p>
              </div>
              <Link
                to="/billing"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <Plus className="h-4 w-4" />
                Add Credits
              </Link>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-soft">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Gift className="h-3.5 w-3.5 text-primary" />
                  MYP Rewards
                </p>
                <p className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
                  0 <span className="text-sm font-bold text-muted-foreground">points</span>
                </p>
              </div>
              <Link
                to="/rewards"
                className="inline-flex shrink-0 items-center rounded-md border border-border bg-secondary px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-primary-soft"
              >
                Learn More
              </Link>
            </div>
          </section>

          {/* 1. Top categories */}
          <section className="mt-8">
            <SectionHeader title="Top Categories" />
            <div className="no-scrollbar -mx-1 mt-4 flex gap-4 overflow-x-auto px-1 pb-1 sm:justify-between">
              {topCategories.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => window.dispatchEvent(new Event("myp:open-discovery"))}
                  className="group flex w-20 shrink-0 flex-col items-center gap-2 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft transition-colors group-hover:bg-primary/15">
                    <Icon className="h-7 w-7 text-primary" />
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-foreground">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 2. Favorites */}
          <section className="mt-10">
            <SectionHeader title="Favorite Advisors" viewAllTo="all" />
            {favoriteAdvisors.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteAdvisors.slice(0, 3).map((a) => (
                  <AdvisorCard key={a.id} advisor={a} />
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState />
              </div>
            )}
          </section>

          {/* 3. History */}
          <section className="mt-10">
            <SectionHeader title="History / Recent Readings" viewAllTo="all" />
            {recentReadings.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentReadings.map((a) => (
                  <AdvisorCard key={a.id} advisor={a} />
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState
                  title="You haven't connected with any advisors yet!"
                  message="Your readings will appear here once you start a session."
                  ctaLabel="Explore advisors"
                />
              </div>
            )}
          </section>

          {/* 4. Top advisors */}
          <section className="mt-10">
            <SectionHeader title="Top Advisors" hint="Highest rated readers on MYP this week." />
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topAdvisors.map((a) => (
                <AdvisorCard key={a.id} advisor={a} />
              ))}
            </div>
          </section>

          {/* 5. Quiz banner */}
          <section className="mt-10 overflow-hidden rounded-lg border border-primary/20 bg-primary-soft p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-lg">
                <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                  Find Your Perfect Advisor in 1 Minute
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Answer five quick questions and we'll match you with readers who fit your
                  situation, budget, and style.
                </p>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event("myp:open-quiz"))}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  <Sparkles className="h-4 w-4" />
                  Start the Quiz
                </button>
              </div>
              <div className="flex -space-x-3">
                {advisors.slice(0, 6).map((a) => (
                  <img
                    key={a.id}
                    src={a.photo}
                    alt={a.name}
                    width={96}
                    height={96}
                    loading="lazy"
                    className="h-14 w-14 rounded-full border-2 border-card object-cover shadow-soft"
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 6. Recently viewed */}
          <section className="mt-10">
            <SectionHeader title="Recently Viewed Advisors" />
            <div className="no-scrollbar -mx-1 mt-4 flex gap-3 overflow-x-auto px-1 pb-1">
              {recentlyViewed.map((a) => (
                <Link
                  key={a.id}
                  to="/advisor/$id"
                  params={{ id: a.id }}
                  className="flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-4 shadow-soft transition-colors hover:border-primary"
                >
                  <span className="relative">
                    <img
                      src={a.photo}
                      alt={a.name}
                      width={64}
                      height={64}
                      loading="lazy"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <span
                      aria-hidden
                      className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card ${
                        a.status === "AVAILABLE"
                          ? "bg-online"
                          : a.status === "ON A BREAK"
                            ? "bg-away"
                            : "bg-offline"
                      }`}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold text-foreground">
                      {a.name}
                    </span>
                    <span className="block text-[11px] text-primary">
                      ${a.pricePerMin.toFixed(2)}/min
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* 7. Similar */}
          <section className="mt-10">
            <SectionHeader title="Similar to Recently Viewed" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similarToViewed.map((a) => (
                <AdvisorCard key={a.id} advisor={a} showMatch />
              ))}
            </div>
          </section>

          {/* 8. Under $5 */}
          <section className="mt-10">
            <SectionHeader title="Advisors Under $5" hint="Great reads that stretch your credits." />
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {underFive.map((a) => (
                <AdvisorCard key={a.id} advisor={a} />
              ))}
            </div>
          </section>

          {/* 9. Horoscope */}
          <section className="mt-10">
            <SectionHeader title="Daily Horoscope" hint="Pick your sign for today's reading." />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {zodiac.map((z) => (
                <Link
                  key={z.sign}
                  to="/horoscopes"
                  className="flex flex-col items-center rounded-lg border border-border bg-card px-3 py-4 text-center shadow-soft transition-colors hover:border-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-lg text-primary">
                    {z.glyph}
                  </span>
                  <span className="mt-2 text-xs font-bold text-foreground">{z.sign}</span>
                  <span className="mt-0.5 text-[10px] text-muted-foreground">{z.range}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* 10. Newsletter */}
          <section className="mt-10 rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  Join our newsletter
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Weekly horoscopes, new advisor spotlights, and members-only credit offers.
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSubscribed(true);
                }}
                className="flex w-full max-w-md items-center gap-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  aria-label="Email address"
                  className="h-11 flex-1 rounded-md border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
                <button
                  type="submit"
                  className="h-11 shrink-0 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  {subscribed ? "Subscribed" : "Subscribe"}
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
