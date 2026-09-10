import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, Lock, Save, User } from "lucide-react";
import { toast } from "sonner";
import { PromoBanner } from "@/components/promo-banner";
import { SiteNav, SiteFooter } from "@/components/site-nav";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Profile Settings | MeetYourPsychic" },
      { name: "description", content: "Manage your MeetYourPsychic profile, password and notification preferences." },
      { property: "og:title", content: "Profile Settings | MeetYourPsychic" },
      { property: "og:description", content: "Manage your MeetYourPsychic profile, password and notification preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
      />
    </label>
  );
}

function Toggle({ label, hint }: { label: string; hint: string }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-primary" : "bg-border"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

function SettingsPage() {
  const save = () => toast.success("Settings saved");

  return (
    <div className="min-h-screen bg-app-tint">
      <PromoBanner />
      <SiteNav />

      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account details and preferences.</p>

        <section className="mt-8 rounded-xl bg-card p-6 shadow-lg">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
            <User className="h-4 w-4 text-primary" /> Profile
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="First name" defaultValue="Alex" />
            <Field label="Last name" defaultValue="Rivera" />
            <Field label="Email" type="email" defaultValue="alex@example.com" />
            <Field label="Phone" type="tel" defaultValue="+1 (555) 014-2288" />
          </div>
        </section>

        <section className="mt-6 rounded-xl bg-card p-6 shadow-lg">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
            <Lock className="h-4 w-4 text-primary" /> Password
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Current password" type="password" placeholder="••••••••" />
            <Field label="New password" type="password" placeholder="••••••••" />
          </div>
        </section>

        <section className="mt-6 rounded-xl bg-card p-6 shadow-lg">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
            <Bell className="h-4 w-4 text-primary" /> Notifications
          </h2>
          <div className="mt-2 divide-y divide-border">
            <Toggle label="Advisor availability alerts" hint="Email me when a favorite advisor comes online" />
            <Toggle label="Reading reminders" hint="Remind me about upcoming scheduled appointments" />
            <Toggle label="Offers & rewards" hint="Promo codes, bonus credits and loyalty updates" />
          </div>
        </section>

        <button
          type="button"
          onClick={save}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
        >
          <Save className="h-4 w-4" />
          Save changes
        </button>
      </main>

      <SiteFooter />
    </div>
  );
}
