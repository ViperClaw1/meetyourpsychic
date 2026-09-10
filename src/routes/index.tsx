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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

const categories = [
  {
    title: "Tarot Readings",
    desc: "Arcana insights on love, choices, and the path ahead.",
    icon: "🜂",
    accent: "from-violet-500/20 to-purple-500/10",
  },
  {
    title: "Love & Relationships",
    desc: "Clarity on connections, timing, and matters of the heart.",
    icon: "♥",
    accent: "from-rose-500/20 to-pink-500/10",
  },
  {
    title: "Career Outlook",
    desc: "Guidance on work, money, and the next professional move.",
    icon: "★",
    accent: "from-amber-500/20 to-yellow-500/10",
  },
  {
    title: "Psychic Mediums",
    desc: "Messages and closures from beyond the veil.",
    icon: "☾",
    accent: "from-indigo-500/20 to-blue-500/10",
  },
];

const steps = [
  {
    n: "01",
    title: "Take the Match Quiz",
    body: "Answer a few questions about what you're seeking. Our match engine narrows the field to advisors who fit you.",
  },
  {
    n: "02",
    title: "Choose Your Advisor",
    body: "Compare ratings, rates, and specialties. Connect by chat or call the moment they're available.",
  },
  {
    n: "03",
    title: "Find Clarity",
    body: "Start your reading with three free minutes. Top up only if you want to go deeper — you're always in control.",
  },
];

const testimonials = [
  {
    quote:
      "I went in skeptical and came out crying — in the best way. She described my situation before I said a word.",
    name: "Priya R.",
    tag: "First-time client",
  },
  {
    quote:
      "The career reading was scarily accurate. Two weeks later exactly what he predicted started unfolding at work.",
    name: "Marcus T.",
    tag: "First-time client",
  },
  {
    quote:
      "I booked a medium reading to hear from my dad. The details she shared were things nobody else could have known.",
    name: "Elena V.",
    tag: "First-time client",
  },
];

const zodiacs = [
  { sign: "Aries", glyph: "♈", range: "Mar 21 – Apr 19" },
  { sign: "Taurus", glyph: "♉", range: "Apr 20 – May 20" },
  { sign: "Gemini", glyph: "♊", range: "May 21 – Jun 20" },
  { sign: "Cancer", glyph: "♋", range: "Jun 21 – Jul 22" },
  { sign: "Leo", glyph: "♌", range: "Jul 23 – Aug 22" },
  { sign: "Virgo", glyph: "♍", range: "Aug 23 – Sep 22" },
];

function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex-1">
        {/* Hero — ethereal gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-600">
          {/* decorative glows */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-[28rem] w-[28rem] rounded-full bg-violet-400/20 blur-3xl" />
          <div className="pointer-events-none absolute left-1/3 top-1/2 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                1,240 advisors online now
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
                Talk To One Of The Best Psychics Today!
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
                Clarity on love, career, and life path — from vetted advisors available by chat or
                call, at rates you see before you connect.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  Start your reading
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
                >
                  Browse advisors
                </Link>
              </div>
              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/20 pt-6">
                {[
                  ["4.9/5", "Average rating"],
                  ["2.1M", "Readings delivered"],
                  ["24/7", "Advisors available"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="text-2xl font-bold text-white">{value}</dt>
                    <dd className="mt-1 text-sm text-white/70">{label}</dd>
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
                className="aspect-[4/5] w-full rounded-2xl border border-white/20 object-cover shadow-2xl"
              />
              <div className="absolute -bottom-5 left-5 right-5 rounded-xl border border-white/30 bg-white/80 p-4 shadow-2xl backdrop-blur-md sm:right-auto sm:w-72">
                <p className="text-sm font-semibold text-foreground">Selene is online</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Average wait under 2 minutes · $4.99/min
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust badges — white section */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-5 md:grid-cols-3">
              {badges.map((b) => (
                <div
                  key={b.title}
                  className="rounded-xl border border-border bg-white/70 p-6 shadow-xl backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="h-1 w-10 rounded-md bg-primary" />
                  <h2 className="mt-4 text-base font-semibold text-foreground">{b.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Explore Categories — soft lavender section */}
        <section className="bg-purple-50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Explore Categories</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Find the kind of reading you need — every advisor is screened for their specialty.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((c) => (
                <Link
                  key={c.title}
                  to="/login"
                  className={`group flex flex-col items-center rounded-2xl border border-border bg-white p-7 text-center shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl`}
                >
                  <span
                    className={`grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br ${c.accent} text-3xl text-violet-700`}
                  >
                    {c.icon}
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works — white section */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">How It Works</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Three steps from curious to clear — your first three minutes are always free.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.n} className="relative">
                  <div className="rounded-2xl border border-border bg-white p-7 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                    <span className="text-4xl font-extrabold text-primary/30">{s.n}</span>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="absolute -right-4 top-1/2 hidden h-px w-8 -translate-y-1/2 bg-gradient-to-r from-primary/40 to-transparent md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured advisors — soft lavender section */}
        <section className="bg-purple-50">
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
                <article
                  key={a.name}
                  className="rounded-xl border border-border bg-white/70 p-5 shadow-xl backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-sm font-bold text-primary">
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
                    className="mt-4 block rounded-lg border border-primary px-4 py-2 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
                  >
                    Connect now
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Client testimonials — white section */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Client Testimonials</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Real readings, real outcomes — shared by members who started exactly where you are.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure
                  key={t.name}
                  className="flex flex-col rounded-2xl border border-border bg-white p-7 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex gap-0.5 text-amber-400" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{t.name}</span>
                    <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                      {t.tag}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Horoscopes teaser — soft lavender section */}
        <section className="bg-purple-50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="relative overflow-hidden rounded-3xl border border-violet-300/40 bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-600 p-8 shadow-2xl sm:p-12">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-fuchsia-400/15 blur-3xl" />
              <div className="relative grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
                    Free daily horoscope
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                    Sign up to get your free daily horoscope sent to your phone.
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
                    Personalized for your zodiac sign, written fresh each morning by our astrology
                    advisors. No cost, no spam — just clarity to start your day.
                  </p>
                  <Link
                    to="/login"
                    className="mt-6 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                  >
                    Get my horoscope
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {zodiacs.map((z) => (
                    <div
                      key={z.sign}
                      className="flex flex-col items-center rounded-xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-sm"
                    >
                      <span className="text-2xl text-white">{z.glyph}</span>
                      <span className="mt-1 text-xs font-semibold text-white">{z.sign}</span>
                      <span className="text-[10px] text-white/60">{z.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Free-minutes CTA — white section */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-primary p-8 shadow-2xl md:flex-row md:items-center">
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
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              >
                Create free account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
