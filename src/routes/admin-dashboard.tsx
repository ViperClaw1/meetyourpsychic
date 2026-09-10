import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataPanel, Th, Td, Pill } from "@/components/admin-shell";
import { SupportWidget } from "@/components/support-widget";
import { AnalyticsOverview } from "@/components/admin-analytics";

export const Route = createFileRoute("/admin-dashboard")({
  head: () => ({
    meta: [
      { title: "Admin console — MeetYourPsychic" },
      { name: "description", content: "Marketplace health, advisor vetting, and payouts." },
      { property: "og:title", content: "Admin console — MeetYourPsychic" },
      { property: "og:description", content: "Marketplace health, advisor vetting, and payouts." },
    ],
  }),
  component: AdminDashboard,
});

const APPS = [
  ["Rowan Fitzgerald", "Tarot", "Test reading submitted", "review"],
  ["Amara Diallo", "Astrology", "Background check clear", "approve"],
  ["Tobias Lund", "Medium", "Missing ID document", "blocked"],
  ["Neve Halloran", "Dream analysis", "Awaiting audio bio", "review"],
];

const FLAGS = [
  ["Dispute #4471", "Refund request · 42 min session", "escalated"],
  ["Advisor #221", "Rating dropped below 4.0", "warning"],
  ["Payout batch 08-14", "$62,400 across 318 advisors", "pending"],
  ["Chat #91208", "Sightengine: phone number shared", "blocked"],
];

function AdminDashboard() {
  return (
    <AdminShell title="Marketplace overview" subtitle="Platform health, vetting pipeline, and payout controls.">
      <AnalyticsOverview />

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="GMV (30d)" value="$412K" hint="+9.4% vs prior 30d" />
        <Metric label="Active advisors" value="1,240" hint="86 pending review" />
        <Metric label="Active clients" value="38,902" hint="+1,204 this week" />
        <Metric label="Open disputes" value="14" hint="3 escalated" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <DataPanel title="Advisor applications" meta="4 in queue">
          <table className="w-full">
            <thead className="bg-secondary/60">
              <tr>
                <Th>Applicant</Th>
                <Th>Category</Th>
                <Th>Stage</Th>
                <Th right>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {APPS.map((r) => (
                <tr key={r[0]} className="hover:bg-secondary/40">
                  <Td strong>{r[0]}</Td>
                  <Td>{r[1]}</Td>
                  <Td>{r[2]}</Td>
                  <td className="px-4 py-2.5 text-right">
                    <Pill tone={r[3] === "approve" ? "green" : r[3] === "blocked" ? "red" : "amber"}>
                      {r[3]}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataPanel>

        <DataPanel title="Flagged activity" meta="Last 24h">
          <table className="w-full">
            <thead className="bg-secondary/60">
              <tr>
                <Th>Item</Th>
                <Th>Detail</Th>
                <Th right>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {FLAGS.map((r) => (
                <tr key={r[0]} className="hover:bg-secondary/40">
                  <Td strong>{r[0]}</Td>
                  <Td>{r[1]}</Td>
                  <td className="px-4 py-2.5 text-right">
                    <Pill tone={r[2] === "escalated" || r[2] === "blocked" ? "red" : r[2] === "warning" ? "amber" : "gray"}>
                      {r[2]}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataPanel>
      </div>

      <div className="mt-5">
        <SupportWidget compact />
      </div>
    </AdminShell>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-soft">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
