import { MessageSquare, Phone, Star } from "lucide-react";
import type { Advisor, BadgeTag } from "@/data/advisors";

const badgeStyles: Record<BadgeTag, string> = {
  NEW: "bg-badge-new-soft text-badge-new border-badge-new/25",
  "RISING STAR": "bg-badge-rising-soft text-badge-rising border-badge-rising/25",
  "TOP RATED": "bg-badge-top-soft text-badge-top border-badge-top/25",
};

export function AdvisorBadge({ tag }: { tag: BadgeTag }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${badgeStyles[tag]}`}
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
  return (
    <article
      className={`group relative flex flex-col rounded-lg border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-lift ${
        compact ? "w-[260px] shrink-0" : ""
      }`}
    >
      {advisor.badge ? (
        <div className="absolute left-4 top-4 z-10">
          <AdvisorBadge tag={advisor.badge} />
        </div>
      ) : null}

      {showMatch && advisor.matchScore ? (
        <span className="absolute right-4 top-4 z-10 rounded-md bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary-foreground">
          {advisor.matchScore}% match
        </span>
      ) : null}

      <div className="overflow-hidden rounded-md border border-border bg-secondary">
        <img
          src={advisor.photo}
          alt={`${advisor.name}, ${advisor.category} advisor`}
          width={512}
          height={512}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className={`h-2 w-2 shrink-0 rounded-full ${
                advisor.online ? "bg-online" : "bg-offline"
              }`}
            />
            <h3 className="truncate text-sm font-semibold text-foreground">{advisor.name}</h3>
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">{advisor.headline}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-foreground">${advisor.pricePerMin.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">per min</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <Star className="h-3.5 w-3.5 fill-badge-rising text-badge-rising" />
        <span className="text-sm font-semibold text-foreground">{advisor.rating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">
          ({advisor.reviews.toLocaleString()} reviews)
        </span>
        <span className="ml-auto text-xs font-medium text-muted-foreground">
          {advisor.online ? "Online now" : "Offline"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          disabled={!advisor.online}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Phone className="h-4 w-4" />
          Call
        </button>
        <button
          disabled={!advisor.online}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </button>
      </div>
    </article>
  );
}
