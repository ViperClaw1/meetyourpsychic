import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Eye,
  Feather,
  Flame,
  Gem,
  Heart,
  HeartHandshake,
  Layers,
  MessageSquare,
  Moon,
  Phone,
  Sparkles,
  Star,
  Sun,
  Users,
  Video,
  Volume2,
} from "lucide-react";
import { AdvisorBadge } from "@/components/advisor-card";
import { SiteNav } from "@/components/site-nav";
import { PromoBanner } from "@/components/promo-banner";
import { SiteFooter } from "@/components/site-footer";
import { AudioBioPlayer } from "@/components/audio-bio-player";
import { BookingModal } from "@/components/booking-modal";
import { WaitlistModal } from "@/components/waitlist-modal";
import { IvrCallModal } from "@/components/ivr-modal";
import { getAdvisor, type Advisor } from "@/data/advisors";

export const Route = createFileRoute("/advisor/$id")({
  loader: ({ params }) => {
    const advisor = getAdvisor(params.id);
    if (!advisor) throw notFound();
    return { name: advisor.name, headline: advisor.headline };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Advisor";
    const title = `${name} · Psychic Advisor Profile | MeetYourPsychic`;
    const description =
      loaderData?.headline ??
      `Read reviews, hear the audio intro and book a session with ${name} on MeetYourPsychic.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: AdvisorProfile,
});

const attributeGroups = (advisor: Advisor) => [
  {
    title: "Styles of Intuition",
    items: [
      { icon: Eye, label: "Clairvoyant" },
      { icon: Feather, label: "Empath" },
      { icon: Sparkles, label: "Channeler" },
      { icon: Moon, label: "Dream interpreter" },
      { icon: Sun, label: "Aura reader" },
    ],
  },
  {
    title: "Topics",
    items: [
      ...advisor.skills.map((s) => ({ icon: HeartHandshake, label: s })),
      { icon: Compass, label: "Life path" },
      { icon: Flame, label: "Twin flames" },
    ],
  },
  {
    title: "Reading Style",
    items: [
      { icon: Compass, label: "Direct & honest" },
      { icon: Heart, label: "Compassionate" },
      { icon: Clock, label: "Timing focused" },
      { icon: Layers, label: "Detailed" },
      { icon: Sparkles, label: "Uplifting" },
    ],
  },
  {
    title: "Tools",
    items: [
      { icon: Layers, label: "Tarot deck" },
      { icon: Gem, label: "Crystals" },
      { icon: Moon, label: "Natal chart" },
      { icon: Sparkles, label: "Pendulum" },
      { icon: Feather, label: "Oracle cards" },
    ],
  },
];

const weekly = [
  { day: "Today", hours: "9:00 AM – 12:00 PM · 4:00 PM – 9:00 PM", open: true },
  { day: "Saturday", hours: "10:00 AM – 6:00 PM", open: true },
  { day: "Sunday", hours: "Offline", open: false },
  { day: "Monday", hours: "9:00 AM – 6:00 PM", open: true },
  { day: "Tuesday", hours: "9:00 AM – 6:00 PM", open: true },
  { day: "Wednesday", hours: "Offline", open: false },
  { day: "Thursday", hours: "12:00 PM – 9:00 PM", open: true },
];

function AttributeColumn({
  title,
  items,
}: {
  title: string;
  items: { icon: typeof Eye; label: string }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, 3);
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">{title}</p>
      <ul className="mt-3 space-y-2">
        {visible.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-sm text-purple-700">
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{label}</span>
          </li>
        ))}
      </ul>
      {items.length > 3 ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          {expanded ? "See less" : "See more"}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      ) : null}
    </div>
  );
}

const PAGE_SIZE = 3;

function AdvisorProfile() {
  const { id } = Route.useParams();
  const advisor = getAdvisor(id)!;
  const [booking, setBooking] = useState(false);
  const [waitlist, setWaitlist] = useState(false);
  const [call, setCall] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [audio, setAudio] = useState(false);
  const [page, setPage] = useState(0);

  const available = advisor.online && !advisor.busy;
  const status = advisor.busy ? "On a break" : advisor.online ? "Available" : "Offline";
  const dot = advisor.busy ? "bg-away" : advisor.online ? "bg-online" : "bg-offline";

  const allReviews = [
    ...(advisor.reviewList ?? []),
    {
      id: "r5",
      author: "Hannah M.",
      rating: 5,
      date: "2 months ago",
      text: "Straightforward, kind, and shockingly accurate about a name I never mentioned. Booking again next month.",
    },
    {
      id: "r6",
      author: "Dev P.",
      rating: 5,
      date: "3 months ago",
      text: "I came in skeptical and left with a plan. The timing they gave me for the job move was exact.",
    },
  ];
  const pages = Math.max(1, Math.ceil(allReviews.length / PAGE_SIZE));
  const shown = allReviews.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const sessionButtons = [
    { label: "Call", Icon: Phone, onClick: () => (available ? setCall(true) : setWaitlist(true)) },
    { label: "Chat", Icon: MessageSquare, to: "/chat/$id" as const },
    { label: "Video", Icon: Video, onClick: () => setCall(true) },
  ];

  return (
    <div className="min-h-screen bg-app-tint">
      <PromoBanner />
      <SiteNav />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Link to="/client-dashboard" className="text-sm font-medium text-primary hover:underline">
          ← Back to dashboard
        </Link>

        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Header card */}
            <section className="rounded-xl bg-card p-6 shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="relative">
                  <img
                    src={advisor.photo}
                    alt={`${advisor.name}, ${advisor.category} advisor`}
                    width={512}
                    height={512}
                    className="h-28 w-28 rounded-full object-cover ring-4 ring-primary-soft"
                  />
                  <span
                    aria-hidden
                    className={`absolute bottom-1.5 right-1.5 h-5 w-5 rounded-full border-[3px] border-card ${dot}`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-pressed={favorite}
                    aria-label="Favorite this advisor"
                    onClick={() => setFavorite((v) => !v)}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-border text-primary transition-colors hover:bg-primary-soft"
                  >
                    <Heart className={`h-4.5 w-4.5 ${favorite ? "fill-primary" : ""}`} />
                  </button>
                  <button
                    type="button"
                    aria-label="Play audio bio"
                    onClick={() => setAudio((v) => !v)}
                    className={`grid h-10 w-10 place-items-center rounded-lg border border-border transition-colors hover:bg-primary-soft ${
                      audio ? "bg-primary-soft text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Volume2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {advisor.name}
                  </h1>
                  {advisor.badge ? <AdvisorBadge tag={advisor.badge} /> : null}
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    <span className={`h-2 w-2 rounded-full ${dot}`} />
                    {status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-badge-rising text-badge-rising" />
                    <span className="font-bold text-foreground">{advisor.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">
                      ({advisor.reviews.toLocaleString()} reviews)
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    {(advisor.readings ?? 0).toLocaleString()} readings since {advisor.since}
                  </span>
                </div>
                <p className="mt-3 max-w-2xl text-sm italic leading-relaxed text-muted-foreground">
                  {advisor.tagline ?? advisor.headline}
                </p>
              </div>

              {audio ? (
                <div className="mt-5">
                  <AudioBioPlayer seconds={advisor.audioBioSeconds ?? 45} name={advisor.name} />
                </div>
              ) : null}
            </section>

            {/* About */}
            <section className="rounded-xl bg-card p-6 shadow-md">
              <h2 className="text-base font-bold text-foreground">About Me</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{advisor.bio}</p>
            </section>

            {/* Attributes */}
            <section className="rounded-xl bg-card p-6 shadow-md">
              <h2 className="text-base font-bold text-foreground">My Attributes</h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {attributeGroups(advisor).map((g) => (
                  <AttributeColumn key={g.title} title={g.title} items={g.items} />
                ))}
              </div>
            </section>

            {/* Schedule */}
            <section className="rounded-xl bg-card p-6 shadow-md">
              <h2 className="text-base font-bold text-foreground">Schedule</h2>
              <ul className="mt-4 divide-y divide-border">
                {weekly.map((d) => (
                  <li key={d.day} className="flex items-center justify-between gap-4 py-3">
                    <span className="text-sm font-semibold text-foreground">{d.day}</span>
                    <span
                      className={`flex items-center gap-2 text-sm ${
                        d.open ? "text-purple-700" : "text-muted-foreground"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {d.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Reviews */}
            <section className="rounded-xl bg-card p-6 shadow-md">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">Reviews</h2>
                <span className="text-sm text-muted-foreground">
                  {advisor.reviews.toLocaleString()} total
                </span>
              </div>
              <ul className="mt-4 divide-y divide-border">
                {shown.map((r) => (
                  <li key={r.id} className="py-5 first:pt-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{r.author}</p>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="mt-1.5 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < r.rating ? "fill-badge-rising text-badge-rising" : "text-border"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm font-bold text-foreground">
                      {r.rating === 5 ? "Exactly what I needed to hear" : "Helpful and grounding"}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              <div className="mt-5 flex items-center justify-center gap-1.5 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                  aria-label="Previous reviews"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i)}
                    aria-current={page === i}
                    className={`h-8 w-8 rounded-md text-sm font-semibold transition-colors ${
                      page === i
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                  disabled={page === pages - 1}
                  className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                  aria-label="More reviews"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT — sticky */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-xl bg-card p-5 shadow-md">
              <p className="text-base font-bold text-foreground">Start Session</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Instant connection · billed per minute
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {sessionButtons.map(({ label, Icon, onClick, to }) =>
                  to ? (
                    <Link
                      key={label}
                      to={to}
                      params={{ id: advisor.id }}
                      className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg bg-primary px-1 text-primary-foreground transition-colors hover:bg-primary-hover"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-bold">{label}</span>
                      <span className="text-[10px] font-medium opacity-90">
                        ${advisor.pricePerMin.toFixed(2)}/min
                      </span>
                    </Link>
                  ) : (
                    <button
                      key={label}
                      type="button"
                      onClick={onClick}
                      className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg bg-primary px-1 text-primary-foreground transition-colors hover:bg-primary-hover"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-bold">{label}</span>
                      <span className="text-[10px] font-medium opacity-90">
                        ${advisor.pricePerMin.toFixed(2)}/min
                      </span>
                    </button>
                  ),
                )}
              </div>

              <div className="my-5 h-px bg-border" />

              <button
                type="button"
                onClick={() => setBooking(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-transparent px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
              >
                <CalendarDays className="h-4 w-4" />
                Schedule Appointment
              </button>

              {!available ? (
                <p className="mt-4 flex items-start gap-2 rounded-lg bg-badge-rising-soft p-3 text-xs leading-relaxed text-foreground">
                  <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-badge-rising" />
                  3 people are waiting. Typical wait is around 46 minutes.
                </p>
              ) : (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Satisfaction guarantee on your first paid reading.
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />

      <BookingModal advisor={advisor} open={booking} onClose={() => setBooking(false)} />
      <WaitlistModal advisor={advisor} open={waitlist} onClose={() => setWaitlist(false)} />
      <IvrCallModal advisor={advisor} open={call} onClose={() => setCall(false)} />
    </div>
  );
}
