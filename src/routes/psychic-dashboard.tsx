import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, Card, Panel, Row } from "@/components/dashboard-shell";

export const Route = createFileRoute("/psychic-dashboard")({
  head: () => ({
    meta: [
      { title: "Advisor dashboard — MeetYourPsychic" },
      { name: "description", content: "Manage your queue, earnings, and availability." },
      { property: "og:title", content: "Advisor dashboard — MeetYourPsychic" },
      { property: "og:description", content: "Manage your queue, earnings, and availability." },
    ],
  }),
  component: PsychicDashboard,
});

function PsychicDashboard() {
  return (
    <DashboardShell
      role="psychic"
      title="Good evening, Selene"
      subtitle="You are visible to clients and 3 people are waiting."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <Card label="Earnings this week" value="$1,284" hint="+18% vs last week" />
        <Card label="Minutes read" value="412" hint="Avg session 19 min" />
        <Card label="Rating" value="4.9" hint="From 2,318 reviews" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title="Waiting queue">
          <Row primary="Client #8821" secondary="Requested chat · Love & relationships" meta="Waiting 2m" />
          <Row primary="Client #8809" secondary="Requested call · Career" meta="Waiting 6m" />
          <Row primary="Client #8790" secondary="Requested chat · General" meta="Waiting 11m" />
        </Panel>
        <Panel title="Upcoming schedule">
          <Row primary="Tonight, 9:00 PM" secondary="Open availability block" meta="3 hrs" />
          <Row primary="Tomorrow, 11:00 AM" secondary="Booked — Client #8712" meta="30 min" />
          <Row primary="Friday, 6:00 PM" secondary="Open availability block" meta="4 hrs" />
        </Panel>
      </div>
    </DashboardShell>
  );
}
