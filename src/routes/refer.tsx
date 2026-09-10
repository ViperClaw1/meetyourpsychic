import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Mail, RefreshCw, Share2, Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { ClientSubnav } from "@/components/client-subnav";

export const Route = createFileRoute("/refer")({
  head: () => ({
    meta: [
      { title: "Refer & Earn — MeetYourPsychic" },
      {
        name: "description",
        content:
          "Share your referral link and earn Clarity Credits when friends complete their first reading and clear the 30-day verification window.",
      },
      { property: "og:title", content: "Refer & Earn — MeetYourPsychic" },
      {
        property: "og:description",
        content: "Share your link and earn credits when referred friends complete a reading.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReferPage,
});

type Referral = {
  name: string;
  joined: string;
  firstReading: string;
  reward: number;
  status: "Pending" | "Available" | "Paid";
  daysLeft?: number;
};

const referrals: Referral[] = [
  { name: "Maya T.", joined: "Sep 2, 2026", firstReading: "Sep 3, 2026", reward: 25, status: "Pending", daysLeft: 22 },
  { name: "Chris D.", joined: "Aug 28, 2026", firstReading: "Aug 29, 2026", reward: 25, status: "Pending", daysLeft: 17 },
  { name: "Rina P.", joined: "Jul 30, 2026", firstReading: "Jul 31, 2026", reward: 25, status: "Available" },
  { name: "Owen B.", joined: "Jul 14, 2026", firstReading: "Jul 15, 2026", reward: 25, status: "Available" },
  { name: "Sasha L.", joined: "Jun 3, 2026", firstReading: "Jun 4, 2026", reward: 25, status: "Paid" },
];

const statusStyles: Record<Referral["status"], string> = {
  Pending: "border-badge-rising/25 bg-badge-rising-soft text-badge-rising",
  Available: "border-online/30 bg-online/10 text-online",
  Paid: "border-border bg-secondary text-secondary-foreground",
};

function ReferPage() {
  const [code, setCode] = useState("ALEX-7T2K");
  const [copied, setCopied] = useState(false);
  const link = `https://meetyourpsychic.com/join?ref=${code}`;

  const available = referrals
    .filter((r) => r.status === "Available")
    .reduce((s, r) => s + r.reward, 0);
  const pending = referrals
    .filter((r) => r.status === "Pending")
    .reduce((s, r) => s + r.reward, 0);

  const regenerate = () => {
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    setCode(`ALEX-${rand}`);
    setCopied(false);
  };

  return (
    <DashboardShell
      role="client"
      title="Refer & Earn"
      subtitle="Give friends $15 off their first reading and earn $25 in Clarity Credits each."
    >
      <ClientSubnav />

      <div className="grid gap-6 lg:grid-cols-3">
        <Stat label="Available to claim" value={`$${available.toFixed(2)}`} hint="Cleared verification" />
        <Stat label="Pending verification" value={`$${pending.toFixed(2)}`} hint="30-day holding period" />
        <Stat label="Friends referred" value={`${referrals.length}`} hint="Lifetime" />
      </div>

      {/* Link generator */}
      <section className="mt-6 rounded-lg border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
            <Share2 className="h-4 w-4 text-primary" />
            Your referral link
          </h2>
          <button
            onClick={regenerate}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Generate new link
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            readOnly
            value={link}
            className="flex-1 rounded-md border border-input bg-secondary/50 px-3.5 py-2.5 font-mono text-sm text-foreground outline-none"
          />
          <button
            onClick={() => {
              navigator.clipboard?.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy link"}
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
            <Mail className="h-4 w-4" />
            Invite by email
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Step n={1} title="Share your link" text="Send it to friends by message, email or social." />
          <Step n={2} title="They read" text="Your friend gets $15 off their first paid reading." />
          <Step
            n={3}
            title="You earn"
            text="$25 lands in your wallet after a 30-day verification window."
          />
        </div>
      </section>

      {/* Table */}
      <section className="mt-8 overflow-hidden rounded-lg border border-border bg-card shadow-soft">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
            <Users className="h-4 w-4 text-primary" />
            Referred friends
          </h2>
          <button
            disabled={available === 0}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            Claim ${available.toFixed(2)}
          </button>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Friend</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">First reading</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {referrals.map((r) => (
                <tr key={r.name} className="transition-colors hover:bg-secondary/40">
                  <td className="px-6 py-4 font-medium text-foreground">{r.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{r.joined}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                    {r.firstReading}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] ${statusStyles[r.status]}`}
                    >
                      {r.status}
                    </span>
                    {r.daysLeft ? (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {r.daysLeft} days left
                      </span>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-foreground">
                    ${r.reward.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-border px-6 py-4 text-xs leading-relaxed text-muted-foreground">
          Rewards stay pending for 30 days after your friend's first paid reading to allow for
          refunds and chargebacks. Once verified they move to Available and can be claimed to your
          Clarity Credits wallet.
        </p>
      </section>
    </DashboardShell>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="rounded-md border border-border p-4">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
        {n}
      </span>
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
