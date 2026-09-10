import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PsychicShell } from "@/components/psychic-shell";
import { Lock, Search } from "lucide-react";

export const Route = createFileRoute("/psychic/notes")({
  head: () => ({
    meta: [
      { title: "Client notes — MeetYourPsychic advisors" },
      { name: "description", content: "Private CRM with past sessions, transcripts, and your notes." },
      { property: "og:title", content: "Client notes — MeetYourPsychic advisors" },
      { property: "og:description", content: "Private CRM with past sessions, transcripts, and your notes." },
    ],
  }),
  component: ClientNotes,
});

type Session = { date: string; kind: string; minutes: number; transcript: { who: "client" | "you"; text: string }[] };
type Client = {
  id: string;
  handle: string;
  sign: string;
  sessions: Session[];
  totalSpend: string;
  note: string;
};

const CLIENTS: Client[] = [
  {
    id: "c1",
    handle: "Client #8712",
    sign: "Scorpio",
    totalSpend: "$412.60",
    note: "Going through a slow separation. Prefers gentle delivery, hates yes/no answers.",
    sessions: [
      {
        date: "Sep 8, 2026",
        kind: "Chat",
        minutes: 31,
        transcript: [
          { who: "client", text: "I keep dreaming about the same house." },
          { who: "you", text: "The house is your sense of safety — it's asking to be rebuilt, not returned to." },
          { who: "client", text: "That lands. What about the move in October?" },
          { who: "you", text: "The cards favour it, but wait until the paperwork is in writing." },
        ],
      },
      {
        date: "Aug 21, 2026",
        kind: "Call",
        minutes: 22,
        transcript: [
          { who: "client", text: "Should I reach out first?" },
          { who: "you", text: "Let them come to you — the Two of Swords breaks in your favour within three weeks." },
        ],
      },
    ],
  },
  {
    id: "c2",
    handle: "Client #8790",
    sign: "Gemini",
    totalSpend: "$188.20",
    note: "Career focused. Responds well to timelines and concrete dates.",
    sessions: [
      {
        date: "Sep 9, 2026",
        kind: "Chat",
        minutes: 24,
        transcript: [
          { who: "client", text: "Is the promotion happening?" },
          { who: "you", text: "Yes, but after a reorganisation — I see movement in late November." },
        ],
      },
    ],
  },
  {
    id: "c3",
    handle: "Client #8655",
    sign: "Pisces",
    totalSpend: "$96.40",
    note: "",
    sessions: [
      {
        date: "Sep 7, 2026",
        kind: "Call",
        minutes: 12,
        transcript: [
          { who: "client", text: "I feel stuck." },
          { who: "you", text: "The Eight of Cups — you have already left, you just haven't said it out loud." },
        ],
      },
    ],
  },
];

function ClientNotes() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(CLIENTS[0]!.id);
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(CLIENTS.map((c) => [c.id, c.note])),
  );
  const [saved, setSaved] = useState(false);

  const filtered = CLIENTS.filter((c) =>
    (c.handle + c.sign).toLowerCase().includes(query.toLowerCase()),
  );
  const active = CLIENTS.find((c) => c.id === activeId)!;

  return (
    <PsychicShell title="Client notes" subtitle="Private CRM — nothing here is visible to the client.">
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <section className="rounded-lg border border-border bg-card shadow-soft">
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search past clients"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`block w-full px-4 py-3.5 text-left transition-colors ${
                  c.id === activeId ? "bg-primary/8" : "hover:bg-secondary"
                }`}
              >
                <p className={`text-sm font-semibold ${c.id === activeId ? "text-primary" : "text-foreground"}`}>
                  {c.handle}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {c.sign} · {c.sessions.length} session{c.sessions.length > 1 ? "s" : ""} · {c.totalSpend}
                </p>
              </button>
            ))}
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">No clients match that search.</p>
            ) : null}
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-lg border border-border bg-card p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-foreground">{active.handle}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {active.sign} · lifetime spend {active.totalSpend}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                <Lock className="h-3.5 w-3.5" /> Private
              </span>
            </div>

            <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Your private notes
            </label>
            <textarea
              value={notes[active.id] ?? ""}
              onChange={(e) => setNotes((n) => ({ ...n, [active.id]: e.target.value }))}
              rows={5}
              placeholder="What should you remember before the next reading?"
              className="mt-2 w-full resize-none rounded-md border border-border bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground outline-none focus:border-primary"
            />
            <button
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
              }}
              className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
            >
              {saved ? "Note saved" : "Save note"}
            </button>
          </section>

          <section className="rounded-lg border border-border bg-card shadow-soft">
            <header className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Session history</h2>
            </header>
            <div className="divide-y divide-border">
              {active.sessions.map((s) => (
                <details key={s.date} className="group px-5 py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {s.kind} · {s.minutes} min
                      </p>
                    </div>
                    <span className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground group-open:border-primary group-open:text-primary">
                      Transcript
                    </span>
                  </summary>
                  <div className="mt-4 space-y-2.5 rounded-md border border-border bg-secondary/40 p-4">
                    {s.transcript.map((t, i) => (
                      <div key={i} className={t.who === "you" ? "text-right" : ""}>
                        <span
                          className={`inline-block max-w-[80%] rounded-md px-3 py-2 text-sm ${
                            t.who === "you"
                              ? "bg-primary text-primary-foreground"
                              : "border border-border bg-card text-foreground"
                          }`}
                        >
                          {t.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PsychicShell>
  );
}
