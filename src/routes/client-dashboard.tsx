import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, Card, Panel, Row } from "@/components/dashboard-shell";

export const Route = createFileRoute("/client-dashboard")({
  head: () => ({
    meta: [
      { title: "Client dashboard — MeetYourPsychic" },
      { name: "description", content: "Your readings, balance, and saved advisors." },
      { property: "og:title", content: "Client dashboard — MeetYourPsychic" },
      { property: "og:description", content: "Your readings, balance, and saved advisors." },
    ],
  }),
  component: ClientDashboard,
});

function ClientDashboard() {
  return (
    <DashboardShell
      role="client"
      title="Welcome back, Alex"
      subtitle="Pick up where you left off or connect with a new advisor."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <Card label="Balance" value="$42.50" hint="≈ 8 minutes with Selene" />
        <Card label="Readings" value="17" hint="3 this month" />
        <Card label="Saved advisors" value="5" hint="2 online now" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title="Recent readings">
          <Row primary="Selene Marlowe" secondary="Tarot · 22 min" meta="Completed" />
          <Row primary="Idris Vale" secondary="Clairvoyant · 11 min" meta="Completed" />
          <Row primary="Nadia Okonkwo" secondary="Astrology · 35 min" meta="Refunded" />
        </Panel>
        <Panel title="Advisors online">
          <Row primary="Selene Marlowe" secondary="$4.99/min · ★ 4.9" meta="Online" />
          <Row primary="Marek Sول" secondary="$5.25/min · ★ 4.7" meta="Busy" />
          <Row primary="Nadia Okonkwo" secondary="$3.75/min · ★ 5.0" meta="Online" />
        </Panel>
      </div>
    </DashboardShell>
  );
}
