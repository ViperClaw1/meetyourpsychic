import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Warm up a page's code as soon as the pointer touches a link so the
    // click itself is instant instead of waiting on a chunk download.
    defaultPreload: "intent",
    defaultPreloadDelay: 40,
    defaultPreloadStaleTime: 60_000,
    // Avoid flashing a pending state for fast transitions.
    defaultPendingMs: 400,
    defaultPendingMinMs: 200,
  });

  return router;
};
