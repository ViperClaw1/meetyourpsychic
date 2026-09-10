import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { OtpModal } from "@/components/otp-modal";
import { useAuth, roleHome, type Role } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — MeetYourPsychic" },
      {
        name: "description",
        content: "Sign in or create your MeetYourPsychic account to connect with a screened advisor.",
      },
      { property: "og:title", content: "Sign in — MeetYourPsychic" },
      {
        property: "og:description",
        content: "Access your readings, saved advisors, and account balance.",
      },
    ],
  }),
  component: LoginPage,
});

type Scan = "idle" | "scanning" | "verified";

const devButtons: { role: Role; label: string; hint: string }[] = [
  { role: "client", label: "Login as Client", hint: "/client-dashboard" },
  { role: "psychic", label: "Login as Psychic", hint: "/psychic-dashboard" },
  { role: "admin", label: "Login as Super Admin", hint: "/admin-dashboard" },
];

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [scan, setScan] = useState<Scan>("idle");
  const [otpOpen, setOtpOpen] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (scan !== "scanning") return;
    const t = setTimeout(() => setScan("verified"), 2000);
    return () => clearTimeout(t);
  }, [scan]);

  const devLogin = (role: Role) => {
    signIn(role);
    navigate({ to: roleHome[role] });
  };

  const finishLogin = () => {
    setOtpOpen(false);
    signIn("client");
    navigate({ to: roleHome.client });
  };

  return (
    <div className="flex min-h-screen flex-col bg-secondary/40">
      <SiteNav />

      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Auth card */}
        <section className="rounded-lg border border-border bg-card p-8 shadow-lift">
          <div className="inline-flex rounded-md border border-border p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
                  mode === m
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <h1 className="mt-6 text-2xl font-bold text-foreground">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to continue your reading history."
              : "It takes under a minute. First 3 minutes free."}
          </p>

          <form
            className="mt-7 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setOtpOpen(true);
            }}
          >
            {mode === "register" && (
              <Field label="Full name" type="text" placeholder="Alex Rivera" />
            )}
            <Field label="Email" type="email" placeholder="you@example.com" />
            <Field label="Password" type="password" placeholder="••••••••" />

            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              or continue with
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <OAuthButton provider="Google" onClick={() => setOtpOpen(true)} />
            <OAuthButton provider="Apple" onClick={() => setOtpOpen(true)} />
          </div>

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            By continuing you agree to the Terms of Service and Privacy Policy. Readings are for
            entertainment purposes; 18+.
          </p>
        </section>

        {/* Right column: fingerprint + dev overrides */}
        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Fingerprint Pro</h2>
              <span className="rounded-md bg-primary-soft px-2 py-1 text-xs font-semibold text-primary">
                Beta
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Biometric sign-in for returning members.
            </p>

            <div className="mt-6 flex flex-col items-center">
              <button
                onClick={() => setScan(scan === "verified" ? "idle" : "scanning")}
                className={`relative grid h-32 w-32 place-items-center overflow-hidden rounded-lg border transition-colors ${
                  scan === "verified"
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-secondary/60 hover:border-primary"
                }`}
                aria-label="Scan fingerprint"
              >
                <FingerprintIcon
                  className={
                    scan === "verified"
                      ? "h-16 w-16 text-primary"
                      : scan === "scanning"
                        ? "h-16 w-16 animate-pulse text-primary"
                        : "h-16 w-16 text-muted-foreground"
                  }
                />
                {scan === "scanning" && (
                  <span className="absolute inset-x-0 h-0.5 animate-[scanline_1.6s_ease-in-out_infinite] bg-primary" />
                )}
              </button>

              <p className="mt-4 text-sm font-medium text-foreground">
                {scan === "idle" && "Touch sensor to scan"}
                {scan === "scanning" && "Scanning biometrics…"}
                {scan === "verified" && "Identity verified"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {scan === "verified" ? "Tap to reset the demo" : "Mock visual — no data captured"}
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-dashed border-primary/50 bg-primary-soft/50 p-6">
            <h2 className="text-sm font-semibold text-foreground">Dev override</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Prototype shortcuts — sets the mock session and routes you in.
            </p>
            <div className="mt-4 space-y-2.5">
              {devButtons.map((b) => (
                <button
                  key={b.role}
                  onClick={() => devLogin(b.role)}
                  className="flex w-full items-center justify-between rounded-md border border-border bg-card px-4 py-2.5 text-left text-sm font-semibold text-foreground shadow-soft transition-colors hover:border-primary hover:text-primary"
                >
                  {b.label}
                  <span className="text-xs font-normal text-muted-foreground">{b.hint}</span>
                </button>
              ))}
            </div>
          </section>

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/" className="font-medium text-primary hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </main>

      <OtpModal open={otpOpen} onClose={() => setOtpOpen(false)} onVerified={finishLogin} />
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
}: {
  label: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function OAuthButton({ provider }: { provider: "Google" | "Apple" }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-soft transition-colors hover:bg-secondary"
    >
      <span aria-hidden className="text-base leading-none">
        {provider === "Google" ? "G" : ""}
      </span>
      {provider}
    </button>
  );
}

function FingerprintIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <path d="M12 10a2 2 0 0 1 2 2c0 3-.3 5-1 7" strokeLinecap="round" />
      <path d="M10 12a2 2 0 0 1 4 0" strokeLinecap="round" />
      <path d="M8.5 12a3.5 3.5 0 0 1 7 0c0 3.5-.4 5.5-1 7.5" strokeLinecap="round" />
      <path d="M6.5 12a5.5 5.5 0 0 1 11 0c0 3-.3 5.2-.9 7" strokeLinecap="round" />
      <path d="M4.6 13.5C4.5 13 4.5 12.5 4.5 12a7.5 7.5 0 0 1 12.2-5.8" strokeLinecap="round" />
      <path d="M6 17.5c-.5-1-.8-2-.9-3" strokeLinecap="round" />
      <path d="M19.4 9.5c.1.8.1 1.6.1 2.5 0 2-.2 3.6-.6 5" strokeLinecap="round" />
    </svg>
  );
}
