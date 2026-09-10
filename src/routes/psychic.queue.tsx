import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PsychicShell, PsychicPanel } from "@/components/psychic-shell";
import { Phone, MessageSquare, Timer } from "lucide-react";

export const Route = createFileRoute("/psychic/queue")({
  head: () => ({
    meta: [
      { title: "Active queue manager — MeetYourPsychic advisors" },
      { name: "description", content: "Accept calls and chats from clients waiting in your live queue." },
      { property: "og:title", content: "Active queue manager — MeetYourPsychic advisors" },
      { property: "og:description", content: "Accept calls and chats from clients waiting in your live queue." },
    ],
  }),
  component: QueuePage,
});

type Entry = {
  id: string;
  client: string;
  preferred: "Call" | "Chat";
  topic: string;
  waited: number; // seconds waited so far
  patience: number; // seconds they are willing to wait
  status: "waiting" | "call" | "chat" | "expired" | "released";
};

const INITIAL: Entry[] = [
  { id: "q1", client: "Client #8821", preferred: "Chat", topic: "Love & relationships", waited: 122, patience: 900, status: "waiting" },
  { id: "q2", client: "Client #8809", preferred: "Call", topic: "Career", waited: 361, patience: 3600, status: "waiting" },
  { id: "q3", client: "Client #8790", preferred: "Chat", topic: "General guidance", waited: 668, patience: 720, status: "waiting" },
  { id: "q4", client: "Client #8744", preferred: "Call", topic: "Tarot", waited: 1080, patience: 86400, status: "waiting" },
];

function clock(sec: number) {
  if (sec >= 3600) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${String(m).padStart(2, "0")}m`;
  }
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

function QueuePage() {
  const [queue, setQueue] = useState<Entry[]>(INITIAL);

  useEffect(() => {
    const id = setInterval(() => {
      setQueue((q) =>
        q.map((e) => {
          if (e.status !== "waiting") return e;
          const waited = e.waited + 1;
          if (waited >= e.patience) return { ...e, waited, status: "expired" };
          return { ...e, waited };
        }),
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const set = (id: string, status: Entry["status"]) =>
    setQueue((q) => q.map((e) => (e.id === id ? { ...e, status } : e)));

  const waiting = queue.filter((e) => e.status === "waiting");

  return (
    <PsychicShell
      title="Active queue manager"
      subtitle="Live view of clients waiting right now — timers count down in real time."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <Stat label="In queue" value={String(waiting.length)} hint="Updating live" />
        <Stat
          label="Longest wait"
          value={waiting.length ? clock(Math.max(...waiting.map((w) => w.waited))) : "—"}
          hint="Since joining"
        />
        <Stat
          label="At risk of dropping"
          value={String(waiting.filter((w) => w.patience - w.waited < 180).length)}
          hint="Under 3 minutes of patience left"
        />
      </div>

      <div className="mt-5">
        <PsychicPanel title={`${waiting.length} clients waiting`}>
          <div className="divide-y divide-border">
            {queue.map((e) => {
              const left = Math.max(0, e.patience - e.waited);
              const pct = Math.max(0, Math.min(100, (left / e.patience) * 100));
              const urgent = left < 180;
              return (
                <div key={e.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{e.client}</p>
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                          Prefers {e.preferred}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {e.topic} · waiting {clock(e.waited)}
                      </p>
                    </div>

                    {e.status === "waiting" ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold tabular-nums ${
                            urgent
                              ? "border-red-200 bg-red-50 text-red-700"
                              : "border-border bg-secondary/60 text-muted-foreground"
                          }`}
                        >
                          <Timer className="h-3.5 w-3.5" />
                          {clock(left)} left
                        </span>
                        <button
                          onClick={() => set(e.id, "call")}
                          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
                        >
                          <Phone className="h-4 w-4" /> Accept call
                        </button>
                        <button
                          onClick={() => set(e.id, "chat")}
                          className="inline-flex items-center gap-1.5 rounded-md border border-primary px-3.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                        >
                          <MessageSquare className="h-4 w-4" /> Accept chat
                        </button>
                        <button
                          onClick={() => set(e.id, "released")}
                          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Release
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                          e.status === "expired"
                            ? "bg-red-50 text-red-700"
                            : e.status === "released"
                              ? "bg-secondary text-muted-foreground"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {e.status === "expired"
                          ? "Left the queue"
                          : e.status === "released"
                            ? "Released"
                            : e.status === "call"
                              ? "Call started"
                              : "Chat started"}
                      </span>
                    )}
                  </div>

                  {e.status === "waiting" ? (
                    <div className="mt-3">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${urgent ? "bg-red-500" : "bg-primary"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Willing to wait {clock(e.patience)} total
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </PsychicPanel>
      </div>
    </PsychicShell>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-soft">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}
