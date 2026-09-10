import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Flame, Sparkles, Trophy } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { ClientSubnav } from "@/components/client-subnav";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Psychic Rewards — MeetYourPsychic" },
      {
        name: "description",
        content:
          "Track your Seek, Illuminate and Enlighten spend tiers, keep your reading streak alive, and redeem points for Clarity Credits.",
      },
      { property: "og:title", content: "Psychic Rewards — MeetYourPsychic" },
      {
        property: "og:description",
        content: "Spend tiers, reading streaks, and point redemption for Clarity Credits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RewardsPage,
});

const tiers = [
  { name: "Seek", min: 0, perk: "1 pt per $1 · Welcome offers" },
  { name: "Illuminate", min: 250, perk: "1.5 pts per $1 · Priority queue" },
  { name: "Enlighten", min: 750, perk: "2 pts per $1 · Free 5 min monthly" },
];

const redemptions = [
  { points: 500, credits: 5 },
  { points: 1000, credits: 11 },
  { points: 2000, credits: 24 },
  { points: 5000, credits: 65 },
];

const streakDays = [
  { label: "Mon", done: true },
  { label: "Tue", done: true },
  { label: "Wed", done: true },
  { label: "Thu", done: true },
  { label: "Fri", done: true },
  { label: "Sat", done: false },
  { label: "Sun", done: false },
];

function RewardsPage() {
  const [points, setPoints] = useState(2480);
  const [redeemed, setRedeemed] = useState<number | null>(null);

  const spend = 612;
  const nextTier = tiers.find((t) => t.min > spend);
  const currentTier = [...tiers].reverse().find((t) => spend >= t.min)!;
  const progress = Math.min(100, (spend / 750) * 100);

  return (
    <DashboardShell
      role="client"
      title="Psychic Rewards"
      subtitle="Earn on every reading, keep your streak, and turn points into Clarity Credits."
    >
      <ClientSubnav />

      {/* Tier progress */}
      <section className="rounded-lg border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <Trophy className="h-4 w-4" />
              Current tier
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">{currentTier.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{currentTier.perk}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {nextTier ? (
              <>
                <span className="font-semibold text-foreground">
                  ${nextTier.min - spend} more spend
                </span>{" "}
                to reach {nextTier.name}
              </>
            ) : (
              "You're at the top tier — enjoy it."
            )}
          </p>
        </div>

        <div className="relative mt-8">
          <div className="h-2.5 overflow-hidden rounded-md bg-secondary">
            <div
              style={{ width: `${progress}%` }}
              className="h-full rounded-md bg-primary transition-[width] duration-500"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {tiers.map((t) => {
              const reached = spend >= t.min;
              return (
                <div
                  key={t.name}
                  className={`rounded-md border p-4 ${
                    reached ? "border-primary bg-primary-soft" : "border-border"
                  }`}
                >
                  <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                    {reached ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
                    {t.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">${t.min}+ lifetime spend</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t.perk}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Streak */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-soft">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-badge-rising">
            <Flame className="h-4 w-4" />
            Reading streak
          </p>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-4xl font-extrabold tracking-tight text-foreground">5</span>
            <span className="pb-1.5 text-sm text-muted-foreground">days in a row</span>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2">
            {streakDays.map((d) => (
              <div key={d.label} className="text-center">
                <div
                  className={`flex aspect-square items-center justify-center rounded-md border ${
                    d.done
                      ? "border-badge-rising/30 bg-badge-rising-soft"
                      : "border-dashed border-border"
                  }`}
                >
                  <Flame
                    className={`h-4 w-4 ${d.done ? "text-badge-rising" : "text-border"}`}
                  />
                </div>
                <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">{d.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2.5">
            <Milestone label="2-day streak" reward="+50 pts" done />
            <Milestone label="5-day streak" reward="+150 pts" done />
            <Milestone label="7-day streak" reward="+400 pts & 5 free minutes" />
          </div>
        </section>

        {/* Redeem */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-4 w-4" />
                Redeem points
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
                {points.toLocaleString()}{" "}
                <span className="text-base font-bold text-muted-foreground">pts</span>
              </p>
            </div>
            <span className="rounded-md bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
              {currentTier.name} tier
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {redemptions.map((r) => {
              const affordable = points >= r.points;
              return (
                <div
                  key={r.points}
                  className={`rounded-md border p-4 ${
                    affordable ? "border-border" : "border-dashed border-border opacity-60"
                  }`}
                >
                  <p className="text-lg font-bold text-foreground">${r.credits} credits</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {r.points.toLocaleString()} points
                  </p>
                  <button
                    disabled={!affordable}
                    onClick={() => {
                      setPoints((p) => p - r.points);
                      setRedeemed(r.credits);
                    }}
                    className="mt-3 w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Redeem
                  </button>
                </div>
              );
            })}
          </div>

          {redeemed ? (
            <p className="mt-5 rounded-md border border-online/30 bg-online/10 px-4 py-3 text-sm font-medium text-foreground">
              ${redeemed} in Clarity Credits added to your wallet.
            </p>
          ) : null}
        </section>
      </div>
    </DashboardShell>
  );
}

function Milestone({
  label,
  reward,
  done = false,
}: {
  label: string;
  reward: string;
  done?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
            done ? "border-primary bg-primary" : "border-border"
          }`}
        >
          {done ? <Check className="h-3 w-3 text-primary-foreground" /> : null}
        </span>
        {label}
      </span>
      <span className="text-xs font-semibold text-muted-foreground">{reward}</span>
    </div>
  );
}
