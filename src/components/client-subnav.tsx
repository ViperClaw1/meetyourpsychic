import { Link } from "@tanstack/react-router";

const links = [
  { to: "/client-dashboard", label: "Overview" },
  { to: "/billing", label: "Billing & Top-Up" },
  { to: "/rewards", label: "Rewards" },
  { to: "/promos", label: "Promos & Offers" },
  { to: "/refer", label: "Refer & Earn" },
  { to: "/horoscopes", label: "Horoscopes" },
] as const;

export function ClientSubnav() {
  return (
    <nav className="no-scrollbar -mx-1 mb-8 flex gap-2 overflow-x-auto px-1">
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          activeProps={{ className: "border-primary bg-primary-soft text-primary" }}
          inactiveProps={{ className: "border-border bg-card text-muted-foreground hover:text-foreground" }}
          className="shrink-0 rounded-md border px-3.5 py-2 text-sm font-semibold transition-colors"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
