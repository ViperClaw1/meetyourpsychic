import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, MessageSquare, Phone, Star, Video, Volume2 } from "lucide-react";
import type { Advisor, AdvisorStatus, BadgeTag } from "@/data/advisors";

const badgeStyles: Record<BadgeTag, string> = {
  NEW: "bg-badge-green-soft text-badge-green border-badge-green/25",
  "RISING STAR": "bg-badge-top-soft text-badge-top border-badge-top/25",
  "TOP RATED": "bg-badge-rising-soft text-badge-rising border-badge-rising/25",
};

const statusDot: Record<AdvisorStatus, string> = {
  AVAILABLE: "bg-online",
  OFFLINE: "bg-offline",
  "ON A BREAK": "bg-away",
};

const statusText: Record<AdvisorStatus, string> = {
  AVAILABLE: "text-online",
  OFFLINE: "text-muted-foreground",
  "ON A BREAK": "text-away",
};

export function AdvisorBadge({ tag }: { tag: BadgeTag }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${badgeStyles[tag]}`}
    >
      {tag}
    </span>
  );
}

export function AdvisorCard({
  advisor,
  showMatch = false,
  compact = false,
}: {
  advisor: Advisor;
  showMatch?: boolean;
  compact?: boolean;
}) {
  const [favorite, setFavorite] = useState(false);
  const [playing, setPlaying] = useState(false);
  const status: AdvisorStatus = advisor.status ?? (advisor.online ? "AVAILABLE" : "OFFLINE");

  return (
    <article
      className={`group relative flex flex-col rounded-lg border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-lift ${
        compact ? "w-[280px] shrink-0" : ""
      }`}
    >
      <Link
        to="/advisor/$id"
        params={{ id: advisor.id }}
        aria-label={`View ${advisor.name}'s profile`}
        className="absolute inset-0 z-0 rounded-lg"
      />
      {/* Header row */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        {advisor.badge ? <AdvisorBadge tag={advisor.badge} /> : <span />}
        <div className="flex items-center gap-1">

          {showMatch && advisor.matchScore ? (
            <span className="mr-1 rounded-md bg-primary-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
              {advisor.matchScore}% match
            </span>
          ) : null}
          <button
            type="button"
            aria-label={favorite ? `Remove ${advisor.name} from favorites` : `Add ${advisor.name} to favorites`}
            aria-pressed={favorite}
            onClick={() => setFavorite((v) => !v)}
            className="rounded-md p-1.5 text-primary transition-colors hover:bg-primary-soft"
          >
            <Heart className={`h-4 w-4 ${favorite ? "fill-primary" : ""}`} />
          </button>
          <button
            type="button"
            aria-label={`Play audio bio for ${advisor.name}`}
            onClick={() => setPlaying((v) => !v)}
            className={`rounded-md p-1.5 transition-colors hover:bg-primary-soft ${
              playing ? "bg-primary-soft text-primary" : "text-muted-foreground"
            }`}
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Portrait */}
      <div className="mt-3 flex justify-center">
        <div className="relative">
          <img
            src={advisor.photo}
            alt={`${advisor.name}, ${advisor.category} advisor`}
            width={256}
            height={256}
            loading="lazy"
            className="h-20 w-20 rounded-full border border-border object-cover"
          />
          <span
            aria-hidden
            className={`absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-card ${statusDot[status]}`}
          />
        </div>
      </div>

      <div className="mt-3 text-center">
        <h3 className="text-sm font-bold text-foreground">
          <Link
            to="/advisor/$id"
            params={{ id: advisor.id }}
            className="transition-colors hover:text-primary"
          >
            {advisor.name}
          </Link>
        </h3>
        <p className={`mt-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${statusText[status]}`}>
          {status}
        </p>
        <p className="mt-1.5 line-clamp-2 text-xs italic leading-snug text-muted-foreground">
          {advisor.tagline ?? advisor.headline}
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {(advisor.readings ?? 0).toLocaleString()} readings since {advisor.since ?? 2012}
        </p>
      </div>

      {/* Specialties */}
      <div className="mt-3 flex flex-wrap justify-center gap-1">
        {advisor.skills.slice(0, 3).map((s) => (
          <span
            key={s}
            className="rounded-md bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Rating + price */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="flex items-center gap-1 text-xs">
          <Star className="h-3.5 w-3.5 fill-badge-rising text-badge-rising" />
          <span className="font-bold text-foreground">{advisor.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({advisor.reviews.toLocaleString()} reviews)</span>
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-primary">${advisor.pricePerMin.toFixed(2)}/min</span>
          <span className="text-[11px] text-muted-foreground line-through">
            ${(advisor.listPrice ?? advisor.pricePerMin * 2).toFixed(2)}
          </span>
        </span>
      </div>

      {/* Actions */}
      <div className="relative z-10 mt-3 grid grid-cols-3 gap-1.5">
        <Link
          to="/advisor/$id"
          params={{ id: advisor.id }}
          className="inline-flex items-center justify-center gap-1 rounded-md border border-primary/40 px-2 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary-soft"
        >
          <Phone className="h-3.5 w-3.5" />
          Call
        </Link>
        <Link
          to="/chat/$id"
          params={{ id: advisor.id }}
          className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-2 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Chat
        </Link>
        <Link
          to="/advisor/$id"
          params={{ id: advisor.id }}
          className="inline-flex items-center justify-center gap-1 rounded-md border border-primary/40 px-2 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary-soft"
        >
          <Video className="h-3.5 w-3.5" />
          Video
        </Link>
      </div>
    </article>
  );
}
