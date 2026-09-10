import { createFileRoute, Link } from "@tanstack/react-router";
import { Gift, Plus, Sparkles, Wallet } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { ClientSubnav } from "@/components/client-subnav";
import { AdvisorCard } from "@/components/advisor-card";
import { PreMatchQuiz } from "@/components/prematch-quiz";
import { DiscoveryTrigger } from "@/components/filter-sidebar";
import { categories, favoriteAdvisors, smartMatches } from "@/data/advisors";


export const Route = createFileRoute("/client-dashboard")({
  head: () => ({
    meta: [
      { title: "Client dashboard — MeetYourPsychic" },
      {
        name: "description",
        content: "Your Clarity Credits, rewards points, favourite advisors, and smart matches.",
      },
      { property: "og:title", content: "Client dashboard — MeetYourPsychic" },
      {
        property: "og:description",
        content: "Your Clarity Credits, rewards points, favourite advisors, and smart matches.",
      },
    ],
  }),
  component: ClientDashboard,
});

const categoryMeta: Record<string, string> = {
  Tarot: "312 advisors",
  "Love & Relationships": "480 advisors",
  Career: "265 advisors",
  Astrology: "198 advisors",
  "Dream Analysis": "87 advisors",
  Mediumship: "142 advisors",
  Numerology: "64 advisors",
  "Spiritual Healing": "121 advisors",
};

function ClientDashboard() {
  return (
    <>
      <PreMatchQuiz />
      <DashboardShell
        role="client"
        title="Welcome back, Alex"
        subtitle="Your credits, rewards, and advisors matched to your profile."
      >
        <ClientSubnav />

        {/* Wallets */}

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-primary p-6 shadow-lift">
            <div className="flex items-start justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/80">
                  <Wallet className="h-4 w-4" />
                  Clarity Credits Balance
                </p>
                <p className="mt-4 text-4xl font-extrabold tracking-tight text-primary-foreground">
                  $42.50
                </p>
                <p className="mt-2 text-sm text-primary-foreground/80">
                  ≈ 8 minutes with Selene · Auto top-up off
                </p>
              </div>
              <span className="rounded-md bg-primary-foreground/15 px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                Wallet
              </span>
            </div>
            <Link
              to="/billing"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-card px-4 py-2.5 text-sm font-semibold text-primary shadow-soft transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Top up credits
            </Link>

          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="flex items-start justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  <Gift className="h-4 w-4" />
                  MYP Rewards
                </p>
                <p className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
                  2,480 <span className="text-lg font-bold text-muted-foreground">pts</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  520 points until your next $10 reward
                </p>
              </div>
              <span className="rounded-md bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                Gold tier
              </span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-md bg-secondary">
              <div className="h-full w-[83%] rounded-md bg-primary" />
            </div>
            <Link
              to="/rewards"
              className="mt-5 inline-block rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Redeem points
            </Link>

          </div>
        </section>

        {/* Top categories */}
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-foreground">Top Categories</h2>
            <DiscoveryTrigger />
          </div>
          <div className="no-scrollbar -mx-1 mt-4 flex gap-3 overflow-x-auto px-1 pb-2">
            {categories.map((c) => (
              <button
                key={c}
                className="flex min-w-[190px] shrink-0 flex-col rounded-lg border border-border bg-card p-4 text-left shadow-soft transition-colors hover:border-primary"
              >
                <span className="h-1 w-8 rounded-md bg-primary" />
                <span className="mt-3 text-sm font-semibold text-foreground">{c}</span>
                <span className="mt-1 text-xs text-muted-foreground">{categoryMeta[c]}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Favorites */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-foreground">Favorite Advisors</h2>
          <p className="mt-1 text-sm text-muted-foreground">Readers you've saved for quick access.</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {favoriteAdvisors.map((a) => (
              <AdvisorCard key={a.id} advisor={a} />
            ))}
          </div>
        </section>

        {/* Smart matches */}
        <section className="mt-10">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Smart Matches</h2>
            <span className="rounded-md bg-primary-soft px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
              Recombee
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Ranked from your quiz answers and past readings.
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {smartMatches.map((a) => (
              <AdvisorCard key={a.id} advisor={a} showMatch />
            ))}
          </div>
        </section>
      </DashboardShell>
    </>
  );
}
