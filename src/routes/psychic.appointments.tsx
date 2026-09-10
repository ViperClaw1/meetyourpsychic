import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PsychicShell, PsychicPanel } from "@/components/psychic-shell";
import { Modal } from "@/components/modal";

export const Route = createFileRoute("/psychic/appointments")({
  head: () => ({
    meta: [
      { title: "Appointments manager — MeetYourPsychic advisors" },
      { name: "description", content: "Approve, decline, or reschedule upcoming client bookings." },
      { property: "og:title", content: "Appointments manager — MeetYourPsychic advisors" },
      { property: "og:description", content: "Approve, decline, or reschedule upcoming client bookings." },
    ],
  }),
  component: Appointments,
});

type Booking = {
  id: string;
  client: string;
  when: string;
  kind: "Call" | "Chat";
  minutes: number;
  value: string;
  status: "pending" | "approved" | "declined" | "rescheduled";
  detail?: string;
};

const DECLINE_REASONS = [
  "Schedule conflict",
  "Outside my working hours",
  "Not my area of expertise",
  "Client requires a longer session",
  "Personal emergency",
];

const SLOTS = ["Tomorrow 2:00 PM", "Tomorrow 8:30 PM", "Fri 11:00 AM", "Fri 7:00 PM", "Sat 1:00 PM", "Sun 6:00 PM"];

const INITIAL: Booking[] = [
  { id: "b1", client: "Client #8712", when: "Fri, Sep 11 · 11:00 AM", kind: "Call", minutes: 30, value: "$209.70", status: "pending" },
  { id: "b2", client: "Client #8655", when: "Fri, Sep 11 · 7:30 PM", kind: "Chat", minutes: 45, value: "$224.55", status: "pending" },
  { id: "b3", client: "Client #8801", when: "Sat, Sep 12 · 12:00 PM", kind: "Call", minutes: 20, value: "$139.80", status: "approved" },
  { id: "b4", client: "Client #8790", when: "Mon, Sep 14 · 9:00 PM", kind: "Chat", minutes: 60, value: "$299.40", status: "pending" },
  { id: "b5", client: "Client #8744", when: "Tue, Sep 15 · 6:00 PM", kind: "Call", minutes: 15, value: "$104.85", status: "approved" },
];

type Tab = "upcoming" | "pending" | "history";

function Appointments() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL);
  const [tab, setTab] = useState<Tab>("pending");
  const [declineFor, setDeclineFor] = useState<Booking | null>(null);
  const [reason, setReason] = useState(DECLINE_REASONS[0]!);
  const [note, setNote] = useState("");
  const [reschedFor, setReschedFor] = useState<Booking | null>(null);
  const [slot, setSlot] = useState(SLOTS[0]!);

  const update = (id: string, patch: Partial<Booking>) =>
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const visible = bookings.filter((b) =>
    tab === "pending"
      ? b.status === "pending"
      : tab === "upcoming"
        ? b.status === "approved" || b.status === "rescheduled"
        : b.status === "declined",
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: "pending", label: `Requests (${bookings.filter((b) => b.status === "pending").length})` },
    { key: "upcoming", label: `Upcoming (${bookings.filter((b) => b.status === "approved" || b.status === "rescheduled").length})` },
    { key: "history", label: `Declined (${bookings.filter((b) => b.status === "declined").length})` },
  ];

  return (
    <PsychicShell title="Appointments" subtitle="Review booking requests and manage your confirmed sessions.">
      <div className="mb-5 inline-flex rounded-md border border-border bg-card p-1 shadow-soft">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-[5px] px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <PsychicPanel title={tabs.find((t) => t.key === tab)!.label}>
        {visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing here right now.</p>
        ) : (
          <div className="divide-y divide-border">
            {visible.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{b.when}</p>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                      {b.kind} · {b.minutes} min
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {b.client} · est. {b.value}
                    {b.detail ? ` · ${b.detail}` : ""}
                  </p>
                </div>

                {b.status === "pending" ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setReschedFor(b);
                        setSlot(SLOTS[0]!);
                      }}
                      className="rounded-md border border-border px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => {
                        setDeclineFor(b);
                        setReason(DECLINE_REASONS[0]!);
                        setNote("");
                      }}
                      className="rounded-md border border-red-200 px-3.5 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => update(b.id, { status: "approved", detail: "Confirmed" })}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
                    >
                      Approve
                    </button>
                  </div>
                ) : (
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                      b.status === "declined"
                        ? "bg-red-50 text-red-700"
                        : b.status === "rescheduled"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {b.status === "declined" ? "Declined" : b.status === "rescheduled" ? "Reschedule sent" : "Confirmed"}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </PsychicPanel>

      <Modal
        open={!!declineFor}
        onClose={() => setDeclineFor(null)}
        title="Decline booking"
        subtitle={declineFor ? `${declineFor.client} · ${declineFor.when}` : undefined}
        footer={
          <>
            <button
              onClick={() => setDeclineFor(null)}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (declineFor) update(declineFor.id, { status: "declined", detail: reason });
                setDeclineFor(null);
              }}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-red-700"
            >
              Decline booking
            </button>
          </>
        }
      >
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Reason (shared with the client)
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-2 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
        >
          {DECLINE_REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Optional message
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mt-2 w-full resize-none rounded-md border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none focus:border-primary"
          placeholder="Add a short note for the client…"
        />
        <p className="mt-3 rounded-md bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
          The client's deposit hold is released immediately. Frequent declines can affect your ranking.
        </p>
      </Modal>

      <Modal
        open={!!reschedFor}
        onClose={() => setReschedFor(null)}
        title="Propose a new time"
        subtitle={reschedFor ? `${reschedFor.client} · currently ${reschedFor.when}` : undefined}
        footer={
          <>
            <button
              onClick={() => setReschedFor(null)}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (reschedFor) update(reschedFor.id, { status: "rescheduled", when: slot, detail: "Awaiting client confirmation" });
                setReschedFor(null);
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
            >
              Send proposal
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {SLOTS.map((s) => (
            <button
              key={s}
              onClick={() => setSlot(s)}
              className={`rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                slot === s
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          The client has 24 hours to accept before the request expires.
        </p>
      </Modal>
    </PsychicShell>
  );
}
