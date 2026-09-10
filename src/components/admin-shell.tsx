import { useEffect, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { useAuth } from "@/lib/auth";
import {
  LayoutGrid,
  Users,
  Sparkles,
  Receipt,
  ShieldAlert,
  FileText,
  LifeBuoy,
  Download,
  Search,
} from "lucide-react";

const NAV = [
  { to: "/admin-dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/psychics", label: "Psychics", icon: Sparkles },
  { to: "/admin/transactions", label: "Transactions", icon: Receipt },
  { to: "/admin/moderation", label: "Moderation", icon: ShieldAlert },
  { to: "/admin/content", label: "Content", icon: FileText },
  { to: "/admin/support", label: "Support", icon: LifeBuoy },
] as const;

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { role, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && role !== "admin") navigate({ to: "/login" });
  }, [ready, role, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-secondary/40">
      <SiteNav />
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 gap-6 px-5 py-6">
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="sticky top-24 rounded-lg border border-border bg-card p-2 shadow-soft">
            <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Super admin
            </p>
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "bg-primary/10 text-primary" }}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
              <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p>
            </div>
            {actions}
          </div>
          <div className="mt-5">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function TableToolbar({
  query,
  onQuery,
  placeholder,
  onExport,
  right,
}: {
  query: string;
  onQuery: (v: string) => void;
  placeholder: string;
  onExport: () => void;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
      <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      {right}
      <button
        onClick={onExport}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Download className="h-4 w-4" /> Export CSV
      </button>
    </div>
  );
}

export function DataPanel({ title, meta, children }: { title: string; meta?: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="text-[13px] font-semibold tracking-tight text-foreground">{title}</h2>
        {meta ? <span className="text-xs text-muted-foreground">{meta}</span> : null}
      </header>
      {children}
    </section>
  );
}

export function Th({ children, right }: { children: ReactNode; right?: boolean }) {
  return (
    <th
      className={`whitespace-nowrap px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground ${
        right ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

export function Td({ children, right, strong }: { children: ReactNode; right?: boolean; strong?: boolean }) {
  return (
    <td
      className={`whitespace-nowrap px-4 py-2.5 text-[13px] ${right ? "text-right" : ""} ${
        strong ? "font-semibold text-foreground" : "text-muted-foreground"
      }`}
    >
      {children}
    </td>
  );
}

export function Pill({ tone, children }: { tone: "green" | "amber" | "red" | "gray" | "purple"; children: ReactNode }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    gray: "bg-secondary text-muted-foreground",
    purple: "bg-primary/10 text-primary",
  } as const;
  return (
    <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function exportCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((r) => r.map(esc).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
