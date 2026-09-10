import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, Clock, MessageSquare, Phone, Star, Users } from "lucide-react";
import { AdvisorBadge } from "@/components/advisor-card";
import { AudioBioPlayer } from "@/components/audio-bio-player";
import { BookingModal } from "@/components/booking-modal";
import { WaitlistModal } from "@/components/waitlist-modal";
import { IvrCallModal } from "@/components/ivr-modal";
import { getAdvisor } from "@/data/advisors";

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

function AdvisorProfile() {
  const { id } = Route.useParams();
  const advisor = getAdvisor(id)!;
  const [booking, setBooking] = useState(false);
  const [waitlist, setWaitlist] = useState(false);
  const [call, setCall] = useState(false);

  const available = advisor.online && !advisor.busy;
  const status = advisor.busy ? "In a session" : advisor.online ? "Online now" : "Offline";
  const reviews = advisor.reviewList ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Link to="/client-dashboard" className="text-sm font-medium text-primary hover:underline">
        ← Back to dashboard
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          {/* Header */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="flex flex-col gap-6 sm:flex-row">
              <img
                src={advisor.photo}
                alt={`${advisor.name}, ${advisor.category} advisor`}
                width={512}
                height={512}
                className="h-40 w-40 shrink-0 rounded-lg border border-border object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {advisor.badge ? <AdvisorBadge tag={advisor.badge} /> : null}
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs font-semibold text-foreground">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        advisor.busy ? "bg-badge-rising" : advisor.online ? "bg-online" : "bg-offline"
                      }`}
                    />
                    {status}
                  </span>
                </div>
                <h1 className="mt-3 text-2xl font-bold text-foreground">{advisor.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{advisor.headline}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-badge-rising text-badge-rising" />
                    <span className="font-semibold text-foreground">
                      {advisor.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({advisor.reviews.toLocaleString()} reviews)
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    {advisor.experienceYears} yrs experience
                  </span>
                  <span className="text-muted-foreground">
                    {(advisor.languages ?? []).join(", ")}
                  </span>
                  <span className="font-bold text-foreground">
                    ${advisor.pricePerMin.toFixed(2)}
                    <span className="font-medium text-muted-foreground"> / min</span>
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {advisor.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <AudioBioPlayer seconds={advisor.audioBioSeconds ?? 45} name={advisor.name} />

          {/* Bio */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
              About {advisor.name.split(" ")[0]}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground">{advisor.bio}</p>
          </section>

          {/* Reviews */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Client reviews
              </h2>
              <span className="text-sm text-muted-foreground">
                {advisor.reviews.toLocaleString()} total
              </span>
            </div>
            <ul className="mt-5 divide-y divide-border">
              {reviews.map((r) => (
                <li key={r.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{r.author}</p>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <div className="mt-1.5 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < r.rating
                            ? "fill-badge-rising text-badge-rising"
                            : "text-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <p className="text-sm font-semibold text-foreground">Start a reading</p>
            <div className="mt-4 space-y-2.5">
              <button
                onClick={() => (available ? setCall(true) : setWaitlist(true))}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <Phone className="h-4 w-4" />
                {available ? "Call now" : "Join Waitlist"}
              </button>
              <Link
                to="/chat/$id"
                params={{ id: advisor.id }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <MessageSquare className="h-4 w-4" />
                Chat now
              </Link>
              <button
                onClick={() => setBooking(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <CalendarDays className="h-4 w-4" />
                Book appointment
              </button>
            </div>
            {!available ? (
              <p className="mt-4 flex items-start gap-2 rounded-md border border-badge-rising/30 bg-badge-rising-soft p-3 text-xs leading-relaxed text-foreground">
                <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-badge-rising" />
                3 people are waiting. Typical wait is around 46 minutes.
              </p>
            ) : null}
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Weekly schedule
            </p>
            <ul className="mt-4 space-y-2.5">
              {(advisor.schedule ?? []).map((s) => (
                <li key={s.day} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{s.day}</span>
                  <span
                    className={
                      s.available ? "font-medium text-foreground" : "text-muted-foreground/60"
                    }
                  >
                    {s.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <BookingModal advisor={advisor} open={booking} onClose={() => setBooking(false)} />
      <WaitlistModal advisor={advisor} open={waitlist} onClose={() => setWaitlist(false)} />
      <IvrCallModal advisor={advisor} open={call} onClose={() => setCall(false)} />
    </div>
  );
}
