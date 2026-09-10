import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, CreditCard, Gift, LogOut, Settings, Sparkles } from "lucide-react";
import { useAuth, roleHome, roleLabel } from "@/lib/auth";
import { DiscoveryTrigger } from "@/components/filter-sidebar";

function AccountMenu() {
  const { role, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const item =
    "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary-soft";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3.5 py-2 text-sm font-medium text-foreground shadow-soft transition-colors hover:bg-secondary"
      >
        Account
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card py-1.5 shadow-lg">
          <Link to="/settings" className={item} onClick={() => setOpen(false)}>
            <Settings className="h-4 w-4 text-muted-foreground" />
            Profile settings
          </Link>
          {role === "client" ? (
            <>
              <Link to="/billing" className={item} onClick={() => setOpen(false)}>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Billing
              </Link>
              <Link to="/rewards" className={item} onClick={() => setOpen(false)}>
                <Gift className="h-4 w-4 text-muted-foreground" />
                Rewards
              </Link>
              <Link to="/horoscopes" className={item} onClick={() => setOpen(false)}>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                Horoscopes
              </Link>
            </>
          ) : null}
          <div className="my-1.5 h-px bg-border" />
          <button
            type="button"
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            onClick={() => {
              setOpen(false);
              signOut();
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function SiteNav() {
  const { role } = useAuth();


  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            M
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            MeetYour<span className="text-primary">Psychic</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          {role === "psychic" ? (
            <>
              <Link to="/psychic/queue" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Queue
              </Link>
              <Link to="/psychic/earnings" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Earnings
              </Link>
            </>
          ) : null}
          {role === "admin" ? (
            <>
              <Link to="/admin/transactions" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Transactions
              </Link>
              <Link to="/admin/support" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Support
              </Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          <DiscoveryTrigger className="hidden items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium text-muted-foreground shadow-soft transition-colors hover:border-primary hover:text-foreground sm:inline-flex" />
          {role ? (
            <>
              <Link
                to={roleHome[role]}
                className="rounded-md border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {roleLabel[role]} dashboard
              </Link>
              <AccountMenu />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} MeetYourPsychic. Prototype — for demonstration only.</p>
        <p>Readings are for entertainment purposes. 18+.</p>
      </div>
    </footer>
  );
}
