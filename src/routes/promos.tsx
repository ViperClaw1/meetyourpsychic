import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BadgePercent, Clock, Layers, Tag, Timer } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { ClientSubnav } from "@/components/client-subnav";

export const Route = createFileRoute("/promos")({
  head: () => ({
    meta: [
      { title: "Promos & Offers — MeetYourPsychic" },
      {
        name: "description",
        content:
          "Stackable coupons, free-minute redemptions and the new-member introductory offer for your next reading.",
      },
      { property: "og:title", content: "Promos & Offers — MeetYourPsychic" },
      {
        property: "og:description",
        content: "Stackable coupons, free minutes, and the new-member introductory offer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PromosPage,
});

type Coupon = {
  code: string;
  title: string;
  detail: string;
  expires: string;
  stackable: boolean;
};

const coupons: Coupon[] = [
  {
    code: "CLARITY20",
    title: "20% off your next top-up",
    detail: "Applies to top-ups of $50 or more.",
    expires: "Sep 30, 2026",
    stackable: true,
  },
  {
    code: "TAROT5",
    title: "$5 off any tarot reading",
    detail: "Valid with Tarot category advisors only.",
    expires: "Oct 12, 2026",
    stackable: true,
  },
  {
    code: "WEEKEND10",
    title: "10% weekend bonus credits",
    detail: "Saturday and Sunday top-ups.",
    expires: "Ongoing",
    stackable: false,
  },
];

const freeMinutes = [
  { minutes: 3, label: "First chat of the week", cost: "Free", note: "Resets every Monday" },
  { minutes: 5, label: "Streak reward", cost: "400 pts", note: "Unlocked at 7-day streak" },
  { minutes: 10, label: "Welcome back bonus", cost: "Free", note: "After 30 days away" },
];

function PromosPage() {
  const [applied, setApplied] = useState<string[]>(["CLARITY20"]);
  const [input, setInput] = useState("");

  const toggle = (c: Coupon) => {
    setApplied((prev) => {
      if (prev.includes(c.code)) return prev.filter((x) => x !== c.code);
      if (!c.stackable) return [c.code];
      const stackableOnly = prev.filter(
        (code) => coupons.find((x) => x.code === code)?.stackable,
      );
      return [...stackableOnly, c.code];
    });
  };

  return (
    <DashboardShell
      role="client"
      title="Promos & Offers"
      subtitle="Stack coupons, claim free minutes, and grab limited-time introductory pricing."
    >
      <ClientSubnav />

      {/* Intro banner */}
      <section className="overflow-hidden rounded-lg border border-border bg-primary p-8 shadow-lift">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-foreground/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-primary-foreground">
              <Timer className="h-3.5 w-3.5" />
              New member offer · ends in 6 days
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-primary-foreground">
              Your first 5 minutes for $1
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-primary-foreground/85">
              Try any advisor rated 4.8 or higher at introductory pricing. If the connection isn't
              right in the first 5 minutes, we refund the session in full.
            </p>
          </div>
          <button className="rounded-md bg-card px-5 py-3 text-sm font-semibold text-primary shadow-soft transition-opacity hover:opacity-90">
            Claim intro offer
          </button>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Coupons */}
        <section>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Stackable coupons</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Stackable coupons combine at checkout. Exclusive coupons replace anything applied.
          </p>

          <div className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="Enter a promo code"
              className="flex-1 rounded-md border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={() => {
                const match = coupons.find((c) => c.code === input.trim());
                if (match) toggle(match);
                setInput("");
              }}
              className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Apply
            </button>
          </div>

          <ul className="mt-5 space-y-3">
            {coupons.map((c) => {
              const on = applied.includes(c.code);
              return (
                <li
                  key={c.code}
                  className={`rounded-lg border p-5 shadow-soft transition-colors ${
                    on ? "border-primary bg-primary-soft" : "border-border bg-card"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-primary/40 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                          <Tag className="h-3.5 w-3.5" />
                          {c.code}
                        </span>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] ${
                            c.stackable
                              ? "border-badge-new/25 bg-badge-new-soft text-badge-new"
                              : "border-badge-rising/25 bg-badge-rising-soft text-badge-rising"
                          }`}
                        >
                          {c.stackable ? "Stackable" : "Exclusive"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-foreground">{c.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{c.detail}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        Expires {c.expires}
                      </p>
                    </div>
                    <button
                      onClick={() => toggle(c)}
                      className={`shrink-0 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                        on
                          ? "border border-primary bg-card text-primary"
                          : "bg-primary text-primary-foreground hover:bg-primary-hover"
                      }`}
                    >
                      {on ? "Applied" : "Apply"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Free minutes + summary */}
        <section className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <BadgePercent className="h-4 w-4" />
              Applied at checkout
            </p>
            {applied.length ? (
              <ul className="mt-4 space-y-2">
                {applied.map((code) => (
                  <li
                    key={code}
                    className="flex items-center justify-between rounded-md border border-border px-3.5 py-2.5 text-sm"
                  >
                    <span className="font-mono text-xs font-bold text-primary">{code}</span>
                    <button
                      onClick={() => setApplied((p) => p.filter((x) => x !== code))}
                      className="text-xs font-semibold text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No coupons applied yet.</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold text-foreground">Free minutes</h2>
            <div className="mt-4 space-y-3">
              {freeMinutes.map((f) => (
                <div
                  key={f.label}
                  className="rounded-lg border border-border bg-card p-5 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-2xl font-extrabold tracking-tight text-foreground">
                        {f.minutes} min
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">{f.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{f.note}</p>
                    </div>
                    <span className="rounded-md bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                      {f.cost}
                    </span>
                  </div>
                  <button className="mt-4 w-full rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                    Redeem minutes
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
