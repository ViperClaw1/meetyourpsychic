import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import heroImage from "@/assets/hero-advisor.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MeetYourPsychic — Talk to one of the best psychics today" },
      {
        name: "description",
        content:
          "Live chat and phone readings with screened psychic advisors. Transparent per-minute pricing, no hidden charges, satisfaction guarantee.",
      },
      { property: "og:title", content: "MeetYourPsychic — Talk to one of the best psychics today" },
      {
        property: "og:description",
        content: "Screened advisors, transparent pricing, and a satisfaction guarantee on every reading.",
      },
    ],
  }),
  component: Landing,
});

const badges = [
  {
    title: "No Hidden Charges",
    body: "Per-minute rates shown before your session starts. You approve every charge.",
  },
  {
    title: "Screened Advisors",
    body: "Fewer than 4% of applicants pass our multi-stage vetting and test readings.",
  },
  {
    title: "Satisfaction Guarantee",
    body: "If a reading misses the mark, we credit the minutes back — no questions asked.",
  },
];

const advisors = [
  { name: "Selene Marlowe", craft: "Tarot · Relationships", rate: "$4.99/min", rating: "4.9", reviews: "2,318" },
  { name: "Idris Vale", craft: "Clairvoyant · Career", rate: "$6.50/min", rating: "4.8", reviews: "1,104" },
  { name: "Nadia Okonkwo", craft: "Astrology · Life path", rate: "$3.75/min", rating: "5.0", reviews: "876" },
];

function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-primary-soft to-background">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                1,240 advisors online now
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
                Talk To One Of The Best Psychics Today!
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Clarity on love, career, and life path — from vetted advisors available by chat or
                call, at rates you see before you connect.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lift transition-colors hover:bg-primary-hover"
                >
                  Start your reading
                </Link>
                <Link
                  to="/login"
                  className="rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-soft transition-colors hover:bg-secondary"
                >
                  Browse advisors
                </Link>
              </div>
              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
                {[
                  ["4.9/5", "Average rating"],
                  ["2.1M", "Readings delivered"],
                  ["24/7", "Advisors available"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="text-2xl font-bold text-foreground">{value}</dt>
                    <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="Psychic advisor preparing a tarot reading at her desk"
                width={1024}
                height={1280}
                className="w-full rounded-lg border border-border object-cover shadow-lift"
              />
              <div className="absolute -bottom-5 left-5 right-5 rounded-lg border border-border bg-card p-4 shadow-lift sm:right-auto sm:w-72">
                <p className="text-sm font-semibold text-foreground">Selene is online</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Average wait under 2 minutes · $4.99/min
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {badges.map((b) => (
              <div
                key={b.title}
                className="rounded-lg border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
              >
                <div className="h-1 w-10 rounded-md bg-primary" />
                <h2 className="mt-4 text-base font-semibold text-foreground">{b.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured advisors */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Featured advisors</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Hand-picked readers with consistently high client ratings.
                </p>
              </div>
              <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
                See all advisors
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {advisors.map((a) => (
                <article key={a.name} className="rounded-lg border border-border bg-card p-5 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-primary-soft text-sm font-bold text-primary">
                      {a.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{a.name}</h3>
                      <p className="text-sm text-muted-foreground">{a.craft}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      ★ {a.rating} · {a.reviews} reviews
                    </span>
                    <span className="font-semibold text-foreground">{a.rate}</span>
                  </div>
                  <Link
                    to="/login"
                    className="mt-4 block rounded-md border border-primary px-4 py-2 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
                  >
                    Connect now
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-primary p-8 shadow-lift md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary-foreground">
                Your first 3 minutes are on us.
              </h2>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Create an account and get matched with an advisor in under a minute.
              </p>
            </div>
            <Link
              to="/login"
              className="rounded-md bg-card px-6 py-3 text-sm font-semibold text-primary shadow-soft transition-opacity hover:opacity-90"
            >
              Create free account
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
