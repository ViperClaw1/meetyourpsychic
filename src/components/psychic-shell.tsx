import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { Modal } from "@/components/modal";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutGrid,
  Users,
  UserCircle2,
  CalendarDays,
  Wallet,
  NotebookPen,
  CalendarClock,
} from "lucide-react";

const NAV = [
  { to: "/psychic-dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/psychic/queue", label: "Queue", icon: Users },
  { to: "/psychic/appointments", label: "Appointments", icon: CalendarClock },
  { to: "/psychic/profile", label: "Profile", icon: UserCircle2 },
  { to: "/psychic/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/psychic/earnings", label: "Earnings", icon: Wallet },
  { to: "/psychic/notes", label: "Client notes", icon: NotebookPen },
] as const;

type Status = "online" | "busy" | "break" | "vacation";

const STATUS_META: Record<Status, { label: string; dot: string; note: string }> = {
  online: { label: "Online", dot: "bg-emerald-500", note: "Visible and accepting new sessions." },
  busy: { label: "Busy", dot: "bg-amber-500", note: "In session — new clients join the waitlist." },
  break: { label: "On a break", dot: "bg-sky-500", note: "Hidden temporarily, auto-return when the timer ends." },
  vacation: { label: "Vacation mode", dot: "bg-slate-400", note: "Profile hidden from search until you return." },
};

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function PsychicShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const { role, ready } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("online");
  const [breakOpen, setBreakOpen] = useState(false);
  const [breakMinutes, setBreakMinutes] = useState(15);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (ready && role !== "psychic") navigate({ to: "/login" });
  }, [ready, role, navigate]);

  useEffect(() => {
    if (status !== "break" || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setStatus("online");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status, remaining]);

  const meta = STATUS_META[status];

  return (
    <div className="flex min-h-screen flex-col bg-secondary/40">
      <SiteNav />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-6 py-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 rounded-lg border border-border bg-card p-2 shadow-soft">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "bg-primary/10 text-primary" }}
                className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="rounded-lg border border-border bg-card p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  Advisor workspace
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-3 py-2">
                <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                <span className="text-xs font-semibold text-foreground">
                  {meta.label}
                  {status === "break" && remaining > 0 ? ` · ${fmt(remaining)}` : ""}
                </span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
              {(Object.keys(STATUS_META) as Status[]).map((key) => {
                const active = status === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (key === "break") {
                        setBreakOpen(true);
                        return;
                      }
                      setRemaining(0);
                      setStatus(key);
                    }}
                    className={`flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${active ? "bg-primary-foreground" : STATUS_META[key].dot}`} />
                    {STATUS_META[key].label}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{meta.note}</p>
          </div>

          <div className="mt-6">{children}</div>
        </main>
      </div>

      <Modal
        open={breakOpen}
        onClose={() => setBreakOpen(false)}
        title="Take a break"
        subtitle="You'll be hidden from search and returned online automatically."
        footer={
          <>
            <button
              onClick={() => setBreakOpen(false)}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setRemaining(breakMinutes * 60);
                setStatus("break");
                setBreakOpen(false);
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
            >
              Start break
            </button>
          </>
        }
      >
        <div className="grid grid-cols-4 gap-2">
          {[5, 15, 30, 60].map((m) => (
            <button
              key={m}
              onClick={() => setBreakMinutes(m)}
              className={`rounded-md border px-3 py-3 text-sm font-semibold transition-colors ${
                breakMinutes === m
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {m}m
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Clients in your queue keep their place and are notified of your return time.
        </p>
      </Modal>
    </div>
  );
}

export function PsychicPanel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card shadow-soft">
      <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
