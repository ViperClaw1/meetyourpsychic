import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth, roleHome, roleLabel } from "@/lib/auth";

export function SiteNav() {
  const { role, signOut } = useAuth();
  const navigate = useNavigate();

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

        <nav className="hidden items-center gap-7 md:flex">
          <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <span className="text-sm text-muted-foreground">Advisors</span>
          <span className="text-sm text-muted-foreground">How it works</span>
          <span className="text-sm text-muted-foreground">Pricing</span>
        </nav>

        <div className="flex items-center gap-3">
          {role ? (
            <>
              <button
                onClick={() => navigate({ to: roleHome[role] })}
                className="rounded-md border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {roleLabel[role]} dashboard
              </button>
              <button
                onClick={() => {
                  signOut();
                  navigate({ to: "/login" });
                }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign out
              </button>
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
