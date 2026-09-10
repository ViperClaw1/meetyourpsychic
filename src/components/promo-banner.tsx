import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function PromoBanner() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-6 py-2 text-center text-xs font-medium sm:text-[13px]">
        <Sparkles className="h-4 w-4" />
        <span>
          New member offer: your first 3 minutes are free, then just $1.00/min with any advisor.
        </span>
        <Link
          to="/promos"
          className="rounded-md bg-primary-foreground/15 px-2.5 py-1 font-semibold underline-offset-2 transition-colors hover:bg-primary-foreground/25"
        >
          View offers
        </Link>
      </div>
    </div>
  );
}
