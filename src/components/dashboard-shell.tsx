import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { useAuth, roleLabel, type Role } from "@/lib/auth";

export function DashboardShell({
  role,
  title,
  subtitle,
  children,
}: {
  role: Role;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const { role: current, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && current !== role) navigate({ to: "/login" });
  }, [ready, current, role, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-secondary/40">
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {roleLabel[role]} workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <span className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
            Mock session active
          </span>
        </div>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

export function Card({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-soft">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card shadow-soft">
      <header className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
      </header>
      <div className="divide-y divide-border">{children}</div>
    </section>
  );
}

export function Row({
  primary,
  secondary,
  meta,
}: {
  primary: string;
  secondary: string;
  meta: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div>
        <p className="text-sm font-medium text-foreground">{primary}</p>
        <p className="text-sm text-muted-foreground">{secondary}</p>
      </div>
      <span className="shrink-0 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
        {meta}
      </span>
    </div>
  );
}
