import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PsychicShell, PsychicPanel } from "@/components/psychic-shell";

export const Route = createFileRoute("/psychic/queue")({
  head: () => ({
    meta: [
      { title: "Live queue — MeetYourPsychic advisors" },
      { name: "description", content: "Accept, hold, or release clients waiting for a reading." },
      { property: "og:title", content: "Live queue — MeetYourPsychic advisors" },
      { property: "og:description", content: "Accept, hold, or release clients waiting for a reading." },
    ],
  }),
  component: QueuePage,
});

type Entry = {
  id: string;
  client: string;
  type: "Chat" | "Call";
  topic: string;
  waited: string;
  willingToWait: string;
  status: "waiting" | "accepted" | "released";
};

const INITIAL: Entry[] = [
  { id: "q1", client: "Client #8821", type: "Chat", topic: "Love & relationships", waited: "2m", willingToWait: "15m", status: "waiting" },
  { id: "q2", client: "Client #8809", type: "Call", topic: "Career", waited: "6m", willingToWait: "1h", status: "waiting" },
  { id: "q3", client: "Client #8790", type: "Chat", topic: "General guidance", waited: "11m", willingToWait: "24h", status: "waiting" },
  { id: "q4", client: "Client #8744", type: "Call", topic: "Tarot", waited: "18m", willingToWait: "1h", status: "waiting" },
];

function QueuePage() {
  const [queue, setQueue] = useState<Entry[]>(INITIAL);
  const set = (id: string, status: Entry["status"]) =>
    setQueue((q) => q.map((e) => (e.id === id ? { ...e, status } : e)));

  return (
    <PsychicShell title="Live queue" subtitle="Clients currently waiting for a session with you.">
      <PsychicPanel title={`${queue.filter((q) => q.status === "waiting").length} clients waiting`}>
        <div className="divide-y divide-border">
          {queue.map((e) => (
            <div key={e.id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{e.client}</p>
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                    {e.type}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {e.topic} · waiting {e.waited} · willing to wait {e.willingToWait}
                </p>
              </div>
              {e.status === "waiting" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => set(e.id, "released")}
                    className="rounded-md border border-border px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Release
                  </button>
                  <button
                    onClick={() => set(e.id, "accepted")}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
                  >
                    Accept
                  </button>
                </div>
              ) : (
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                    e.status === "accepted"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {e.status === "accepted" ? "Session started" : "Released"}
                </span>
              )}
            </div>
          ))}
        </div>
      </PsychicPanel>
    </PsychicShell>
  );
}
