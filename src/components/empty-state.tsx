import { Link } from "@tanstack/react-router";
import emptyIllustration from "@/assets/empty-advisors.png";

type EmptyStateProps = {
  title?: string;
  message?: string;
  ctaLabel?: string;
  ctaTo?: string;
};

/**
 * Clean, illustrated empty state shown when a client has no advisors or
 * sessions yet. Defaults to the "no advisors connected" copy used on the
 * Client Dashboard.
 */
export function EmptyState({
  title = "You haven't connected with any advisors yet!",
  message = "Explore trusted, screened advisors and start your first reading today.",
  ctaLabel = "Explore advisors",
  ctaTo = "/advisors",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center shadow-soft">
      <img
        src={emptyIllustration}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={240}
        height={192}
        className="h-44 w-auto opacity-90"
      />
      <h3 className="mt-5 text-base font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{message}</p>
      <Link
        to={ctaTo}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
