import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Apple, Facebook, Instagram, Mail, Play, Twitter, Youtube } from "lucide-react";

const columns: { title: string; links: { label: string; to?: string }[] }[] = [
  {
    title: "Readings",
    links: [
      { label: "Tarot readings" },
      { label: "Love & relationships" },
      { label: "Career outlook" },
      { label: "Psychic mediums" },
      { label: "Astrology & birth charts" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About MeetYourPsychic" },
      { label: "How screening works" },
      { label: "Become an advisor" },
      { label: "Careers" },
      { label: "Press" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center" },
      { label: "Satisfaction guarantee" },
      { label: "Billing & credits", to: "/billing" },
      { label: "Refer & earn", to: "/refer" },
      { label: "Contact us" },
    ],
  },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Newsletter */}
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-primary-soft p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Mail className="h-5 w-5 text-primary" />
              Get the Latest News
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Weekly horoscopes, advisor spotlights and members-only credit offers.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setJoined(true);
            }}
            className="flex w-full max-w-md gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-md border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {joined ? "Subscribed" : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Link columns */}
        <div className="mt-12 grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                M
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-foreground">
                MeetYour<span className="text-primary">Psychic</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Screened advisors, transparent per-minute pricing and a satisfaction guarantee on
              every reading.
            </p>
            <div className="mt-5 flex gap-2">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social profile"
                  className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 transition-colors hover:border-primary"
              >
                <Apple className="h-5 w-5 text-foreground" />
                <span className="leading-tight">
                  <span className="block text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                    Download on the
                  </span>
                  <span className="block text-xs font-bold text-foreground">App Store</span>
                </span>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 transition-colors hover:border-primary"
              >
                <Play className="h-5 w-5 fill-foreground text-foreground" />
                <span className="leading-tight">
                  <span className="block text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                    Get it on
                  </span>
                  <span className="block text-xs font-bold text-foreground">Google Play</span>
                </span>
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link
                        to={l.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MeetYourPsychic. For entertainment purposes only. 18+.</p>
          <div className="flex flex-wrap gap-5">
            <a href="#" className="transition-colors hover:text-primary">Terms of use</a>
            <a href="#" className="transition-colors hover:text-primary">Privacy policy</a>
            <a href="#" className="transition-colors hover:text-primary">Cookie settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
