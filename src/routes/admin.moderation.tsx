import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataPanel, Th, Td, Pill } from "@/components/admin-shell";
import { Play, Pause, Star, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin/moderation")({
  head: () => ({
    meta: [
      { title: "Moderation queue — MYP admin" },
      { name: "description", content: "Review audio bios, text bios, reviews, and flagged chats." },
      { property: "og:title", content: "Moderation queue — MYP admin" },
      { property: "og:description", content: "Review audio bios, text bios, reviews, and flagged chats." },
    ],
  }),
  component: Moderation,
});

type Tab = "audio" | "text" | "reviews" | "chats";

type Decision = "pending" | "approved" | "rejected";

const AUDIO = [
  { id: "AB-441", advisor: "Kai Fontaine", length: "0:48", submitted: "2h ago", note: "First submission" },
  { id: "AB-442", advisor: "Neve Halloran", length: "1:12", submitted: "5h ago", note: "Re-recorded after reject" },
  { id: "AB-443", advisor: "Rowan Fitzgerald", length: "0:36", submitted: "Yesterday", note: "Background noise flagged" },
];

const TEXT = [
  {
    id: "TB-902",
    advisor: "Amara Diallo",
    submitted: "1h ago",
    body: "Third-generation astrologer. I read natal charts and transits to help you time big decisions — moves, offers, and reconciliations.",
    flags: [] as string[],
  },
  {
    id: "TB-903",
    advisor: "Tobias Lund",
    submitted: "4h ago",
    body: "Guaranteed results — I can promise your ex will return within 7 days. Text me directly at 555-0148 for a discount.",
    flags: ["Guarantee claim", "Off-platform contact", "Phone number"],
  },
  {
    id: "TB-904",
    advisor: "Juniper Blake",
    submitted: "Yesterday",
    body: "I work with grief and connection to those who have passed, gently and at your pace.",
    flags: [],
  },
];

const REVIEWS = [
  { id: "R-7781", client: "U-8790", advisor: "Kai Fontaine", stars: 2, pii: false, text: "Reading felt generic and the call dropped twice." },
  { id: "R-7782", client: "U-8655", advisor: "Selene Marchetti", stars: 5, pii: true, text: "Amazing! Call me on 555-0192 for a group session." },
  { id: "R-7783", client: "U-8801", advisor: "Tobias Lund", stars: 1, pii: false, text: "Promised outcomes that never happened. Requesting refund." },
  { id: "R-7784", client: "U-8744", advisor: "Orion Vance", stars: 3, pii: false, text: "Helpful but rushed at the end." },
  { id: "R-7785", client: "U-8920", advisor: "Juniper Blake", stars: 5, pii: false, text: "Kind, precise, and grounding." },
];

const CHATS = [
  { id: "C-91208", session: "U-8712 ↔ P-1042", trigger: "Phone number", confidence: 0.97, excerpt: "you can reach me on 555-•••• instead" },
  { id: "C-91221", session: "U-8790 ↔ P-1155", trigger: "Off-platform payment", confidence: 0.88, excerpt: "send it to my cashapp and I'll read for free" },
  { id: "C-91240", session: "U-8899 ↔ P-1204", trigger: "Medical advice", confidence: 0.74, excerpt: "stop taking the medication your doctor gave you" },
  { id: "C-91255", session: "U-8601 ↔ P-1121", trigger: "Abusive language", confidence: 0.91, excerpt: "message withheld — profanity filter" },
];

function Moderation() {
  const [tab, setTab] = useState<Tab>("audio");
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [playing, setPlaying] = useState<string | null>(null);
  const [lowOnly, setLowOnly] = useState(false);
  const [piiOnly, setPiiOnly] = useState(false);

  const decide = (id: string, d: Decision) => setDecisions((s) => ({ ...s, [id]: d }));
  const state = (id: string): Decision => decisions[id] ?? "pending";

  const pendingCount = (ids: string[]) => ids.filter((id) => state(id) === "pending").length;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "audio", label: "Audio bios", count: pendingCount(AUDIO.map((a) => a.id)) },
    { key: "text", label: "Text bios", count: pendingCount(TEXT.map((t) => t.id)) },
    { key: "reviews", label: "Reviews", count: pendingCount(REVIEWS.map((r) => r.id)) },
    { key: "chats", label: "Chat flags", count: pendingCount(CHATS.map((c) => c.id)) },
  ];

  const reviews = REVIEWS.filter((r) => (!lowOnly || r.stars <= 3) && (!piiOnly || r.pii));

  return (
    <AdminShell title="Moderation queue" subtitle="Everything awaiting a human decision before it goes live.">
      <div className="mb-5 inline-flex flex-wrap rounded-md border border-border bg-card p-1 shadow-soft">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-[5px] px-4 py-2 text-[13px] font-semibold transition-colors ${
              tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            <span className={`ml-2 text-[11px] ${tab === t.key ? "opacity-80" : "text-muted-foreground"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {tab === "audio" ? (
        <DataPanel title="Audio bios pending approval" meta={`${AUDIO.length} submissions`}>
          <div className="divide-y divide-border">
            {AUDIO.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPlaying((p) => (p === a.id ? null : a.id))}
                    className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover"
                    aria-label={playing === a.id ? "Pause" : "Play"}
                  >
                    {playing === a.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">
                      {a.advisor} <span className="font-normal text-muted-foreground">· {a.id}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a.length} · submitted {a.submitted} · {a.note}
                    </p>
                  </div>
                  <div className="hidden h-8 items-end gap-[2px] md:flex">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-[2px] rounded-full ${playing === a.id ? "bg-primary" : "bg-border"}`}
                        style={{ height: `${8 + Math.abs(Math.sin(i * 0.8)) * 22}px` }}
                      />
                    ))}
                  </div>
                </div>
                <Decide id={a.id} state={state(a.id)} decide={decide} />
              </div>
            ))}
          </div>
        </DataPanel>
      ) : null}

      {tab === "text" ? (
        <DataPanel title="Text bios pending approval" meta={`${TEXT.length} submissions`}>
          <div className="divide-y divide-border">
            {TEXT.map((t) => (
              <div key={t.id} className="px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <p className="text-[13px] font-semibold text-foreground">
                      {t.advisor} <span className="font-normal text-muted-foreground">· {t.id} · {t.submitted}</span>
                    </p>
                    <p className="mt-2 rounded-md border border-border bg-secondary/40 p-3 text-[13px] leading-relaxed text-foreground">
                      {t.body}
                    </p>
                    {t.flags.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {t.flags.map((f) => (
                          <Pill key={f} tone="red">
                            {f}
                          </Pill>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">No automated flags.</p>
                    )}
                  </div>
                  <Decide id={t.id} state={state(t.id)} decide={decide} />
                </div>
              </div>
            ))}
          </div>
        </DataPanel>
      ) : null}

      {tab === "reviews" ? (
        <DataPanel title="Review moderation" meta={`${reviews.length} shown`}>
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
            <Toggle active={lowOnly} onClick={() => setLowOnly((v) => !v)} label="3 stars or below" />
            <Toggle active={piiOnly} onClick={() => setPiiOnly((v) => !v)} label="PII flagged only" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-secondary/60">
                <tr>
                  <Th>Review</Th>
                  <Th>Client</Th>
                  <Th>Advisor</Th>
                  <Th>Rating</Th>
                  <Th>Content</Th>
                  <Th>Flags</Th>
                  <Th right>Decision</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-secondary/40">
                    <Td strong>{r.id}</Td>
                    <Td>{r.client}</Td>
                    <Td>{r.advisor}</Td>
                    <td className="whitespace-nowrap px-4 py-2.5">
                      <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-foreground">
                        <Star className={`h-3.5 w-3.5 ${r.stars <= 3 ? "text-amber-500" : "text-primary"}`} />
                        {r.stars}.0
                      </span>
                    </td>
                    <td className="max-w-[320px] px-4 py-2.5 text-[13px] text-muted-foreground">{r.text}</td>
                    <td className="px-4 py-2.5">
                      {r.pii ? <Pill tone="red">PII</Pill> : <Pill tone="gray">clean</Pill>}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Decide id={r.id} state={state(r.id)} decide={decide} compact />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataPanel>
      ) : null}

      {tab === "chats" ? (
        <DataPanel title="Chat flags · Sightengine" meta={`${CHATS.length} blocked messages`}>
          <div className="divide-y divide-border">
            {CHATS.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-red-600" />
                    <p className="text-[13px] font-semibold text-foreground">{c.id}</p>
                    <Pill tone="red">{c.trigger}</Pill>
                    <span className="text-xs text-muted-foreground">
                      confidence {(c.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{c.session}</p>
                  <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-800">
                    “{c.excerpt}”
                  </p>
                </div>
                <Decide
                  id={c.id}
                  state={state(c.id)}
                  decide={decide}
                  approveLabel="Allow message"
                  rejectLabel="Uphold block"
                />
              </div>
            ))}
          </div>
        </DataPanel>
      ) : null}
    </AdminShell>
  );
}

function Decide({
  id,
  state,
  decide,
  compact,
  approveLabel = "Approve",
  rejectLabel = "Reject",
}: {
  id: string;
  state: Decision;
  decide: (id: string, d: Decision) => void;
  compact?: boolean;
  approveLabel?: string;
  rejectLabel?: string;
}) {
  if (state !== "pending") {
    return <Pill tone={state === "approved" ? "green" : "red"}>{state}</Pill>;
  }
  return (
    <div className="flex shrink-0 gap-2">
      <button
        onClick={() => decide(id, "rejected")}
        className={`rounded-md border border-red-200 font-semibold text-red-600 transition-colors hover:bg-red-50 ${
          compact ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-[13px]"
        }`}
      >
        {rejectLabel}
      </button>
      <button
        onClick={() => decide(id, "approved")}
        className={`rounded-md bg-primary font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover ${
          compact ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-[13px]"
        }`}
      >
        {approveLabel}
      </button>
    </div>
  );
}

function Toggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors ${
        active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
