import { useState } from "react";
import { LifeBuoy } from "lucide-react";
import { Pill } from "@/components/admin-shell";

export type Ticket = {
  id: string;
  subject: string;
  requester: string;
  customerId: string;
  ltv: number;
  credits: number;
  sessions: { advisor: string; when: string; minutes: number }[];
  channel: "Email" | "Chat" | "Web form";
  priority: "urgent" | "high" | "normal" | "low";
  status: "open" | "pending" | "solved";
  opened: string;
  firstReply: string;
};

export const TICKETS: Ticket[] = [
  {
    id: "ZD-40221",
    subject: "Charged twice for a 20 minute call",
    requester: "Marisol Vega",
    customerId: "U-8712",
    ltv: 1420.6,
    credits: 84.5,
    sessions: [
      { advisor: "P-1042 Selene", when: "Sep 10", minutes: 20 },
      { advisor: "P-1121 Juniper", when: "Sep 4", minutes: 31 },
    ],
    channel: "Email",
    priority: "urgent",
    status: "open",
    opened: "38m ago",
    firstReply: "pending",
  },
  {
    id: "ZD-40218",
    subject: "Advisor never joined the scheduled booking",
    requester: "Andre Kimura",
    customerId: "U-8801",
    ltv: 640.0,
    credits: 210.0,
    sessions: [{ advisor: "P-1155 Kai", when: "Sep 9", minutes: 0 }],
    channel: "Chat",
    priority: "high",
    status: "open",
    opened: "2h ago",
    firstReply: "sent",
  },
  {
    id: "ZD-40209",
    subject: "How do I redeem points for credits?",
    requester: "Hassan Nabil",
    customerId: "U-8920",
    ltv: 96.7,
    credits: 19.9,
    sessions: [{ advisor: "P-1088 Orion", when: "Sep 8", minutes: 12 }],
    channel: "Web form",
    priority: "normal",
    status: "pending",
    opened: "6h ago",
    firstReply: "sent",
  },
  {
    id: "ZD-40196",
    subject: "Requesting refund for unused credits",
    requester: "Fiona Brennan",
    customerId: "U-8655",
    ltv: 2960.4,
    credits: 0,
    sessions: [{ advisor: "P-1121 Juniper", when: "Sep 9", minutes: 31 }],
    channel: "Email",
    priority: "high",
    status: "open",
    opened: "Yesterday",
    firstReply: "sent",
  },
];

const money = (n: number) => `$${n.toFixed(2)}`;

export function SupportWidget({ compact = false }: { compact?: boolean }) {
  const [openId, setOpenId] = useState<string | null>(TICKETS[0]!.id);
  const list = compact ? TICKETS.slice(0, 3) : TICKETS;

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <LifeBuoy className="h-4 w-4 text-primary" />
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">
            Zendesk · open support tickets
          </h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {TICKETS.filter((t) => t.status === "open").length} open · median first reply 41m
        </span>
      </header>

      <div className="divide-y divide-border">
        {list.map((t) => {
          const expanded = openId === t.id;
          return (
            <div key={t.id}>
              <button
                onClick={() => setOpenId(expanded ? null : t.id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/40"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-semibold text-foreground">{t.id}</span>
                    <Pill
                      tone={t.priority === "urgent" ? "red" : t.priority === "high" ? "amber" : "gray"}
                    >
                      {t.priority}
                    </Pill>
                    <Pill tone={t.status === "open" ? "purple" : t.status === "solved" ? "green" : "gray"}>
                      {t.status}
                    </Pill>
                  </div>
                  <p className="mt-1 text-[13px] text-foreground">{t.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.requester} · {t.customerId} · {t.channel} · opened {t.opened}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Lifetime value
                  </p>
                  <p className="text-[15px] font-semibold text-foreground">{money(t.ltv)}</p>
                </div>
              </button>

              {expanded ? (
                <div className="grid gap-4 border-t border-border bg-secondary/30 px-4 py-4 md:grid-cols-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                      Customer record
                    </p>
                    <dl className="mt-2 space-y-1 text-[13px]">
                      <Line k="Customer ID" v={t.customerId} />
                      <Line k="Lifetime value" v={money(t.ltv)} />
                      <Line k="Credit balance" v={money(t.credits)} />
                      <Line k="Total sessions" v={String(t.sessions.length)} />
                    </dl>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                      Recent sessions
                    </p>
                    <ul className="mt-2 space-y-1 text-[13px] text-muted-foreground">
                      {t.sessions.map((s) => (
                        <li key={s.advisor + s.when}>
                          {s.when} · {s.advisor} · {s.minutes} min
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                      Actions
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                        Reply
                      </button>
                      <button className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">
                        Issue credits
                      </button>
                      <button className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
                        Mark solved
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">First reply: {t.firstReply}</p>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-semibold text-foreground">{v}</dd>
    </div>
  );
}
