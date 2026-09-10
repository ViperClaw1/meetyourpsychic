import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { SupportWidget, TICKETS } from "@/components/support-widget";

export const Route = createFileRoute("/admin/support")({
  head: () => ({
    meta: [
      { title: "Support desk — MYP admin" },
      { name: "description", content: "Zendesk tickets with customer value and session history in context." },
      { property: "og:title", content: "Support desk — MYP admin" },
      { property: "og:description", content: "Zendesk tickets with customer value and session history in context." },
    ],
  }),
  component: Support,
});

function Support() {
  const open = TICKETS.filter((t) => t.status === "open").length;
  const urgent = TICKETS.filter((t) => t.priority === "urgent").length;
  const ltv = TICKETS.reduce((s, t) => s + t.ltv, 0);

  return (
    <AdminShell title="Support desk" subtitle="Zendesk queue enriched with MYP account data.">
      <div className="mb-4 grid gap-4 sm:grid-cols-4">
        <Metric label="Open tickets" value={String(open)} />
        <Metric label="Urgent" value={String(urgent)} />
        <Metric label="Median first reply" value="41m" />
        <Metric label="Requester LTV" value={`$${ltv.toFixed(2)}`} />
      </div>
      <SupportWidget />
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-soft">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  );
}
