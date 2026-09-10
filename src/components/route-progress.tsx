import { useRouterState } from "@tanstack/react-router";

/**
 * Thin top bar shown while the router is loading the next page.
 * Gives immediate feedback on click instead of a "frozen" feeling.
 */
export function RouteProgress() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 transition-opacity duration-200 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="h-full w-full origin-left animate-[route-progress_1.2s_ease-out_infinite] bg-primary" />
    </div>
  );
}
