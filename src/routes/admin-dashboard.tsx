import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, Card, Panel, Row } from "@/components/dashboard-shell";

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

function AdminDashboard() {
  return (
    <DashboardShell
      role="admin"
      title="Marketplace overview"
      subtitle="Platform health, vetting pipeline, and payout controls."
    >
      <div className="grid gap-5 sm:grid-cols-4">
        <Card label="GMV (30d)" value="$412K" hint="+9.4%" />
        <Card label="Active advisors" value="1,240" hint="86 pending review" />
        <Card label="Active clients" value="38,902" hint="+1,204 this week" />
        <Card label="Open disputes" value="14" hint="3 escalated" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title="Advisor applications">
          <Row primary="Rowan Fitzgerald" secondary="Tarot · Test reading submitted" meta="Review" />
          <Row primary="Amara Diallo" secondary="Astrology · Background check clear" meta="Approve" />
          <Row primary="Tobias Lund" secondary="Medium · Missing ID document" meta="Blocked" />
        </Panel>
        <Panel title="Flagged activity">
          <Row primary="Dispute #4471" secondary="Refund request · 42 min session" meta="Escalated" />
          <Row primary="Advisor #221" secondary="Rating dropped below 4.0" meta="Warning" />
          <Row primary="Payout batch 08-14" secondary="$62,400 across 318 advisors" meta="Pending" />
        </Panel>
      </div>
    </DashboardShell>
  );
}
