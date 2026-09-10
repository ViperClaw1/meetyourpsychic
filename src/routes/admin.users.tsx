import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataPanel, TableToolbar, Th, Td, Pill, exportCsv } from "@/components/admin-shell";
import { Modal } from "@/components/modal";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Customer management — MYP admin" },
      { name: "description", content: "Global customer ledger with Clarity Credit balances and refunds." },
      { property: "og:title", content: "Customer management — MYP admin" },
      { property: "og:description", content: "Global customer ledger with Clarity Credit balances and refunds." },
    ],
  }),
  component: CustomerLedger,
});

type Customer = {
  id: string;
  name: string;
  email: string;
  joined: string;
  credits: number;
  unused: number;
  lifetime: number;
  points: number;
  sessions: number;
  status: "active" | "dormant" | "suspended";
};

const BASE: Customer[] = [
  { id: "U-8712", name: "Marisol Vega", email: "marisol.v@example.com", joined: "2024-11-02", credits: 84.5, unused: 24.0, lifetime: 1420.6, points: 3120, sessions: 41, status: "active" },
  { id: "U-8790", name: "Dev Patel", email: "dev.patel@example.com", joined: "2025-02-18", credits: 12.25, unused: 12.25, lifetime: 388.2, points: 940, sessions: 12, status: "active" },
  { id: "U-8655", name: "Fiona Brennan", email: "f.brennan@example.com", joined: "2023-06-09", credits: 0, unused: 0, lifetime: 2960.4, points: 8420, sessions: 96, status: "dormant" },
  { id: "U-8801", name: "Andre Kimura", email: "a.kimura@example.com", joined: "2026-01-27", credits: 210.0, unused: 65.5, lifetime: 640.0, points: 1580, sessions: 9, status: "active" },
  { id: "U-8744", name: "Priya Raman", email: "priya.r@example.com", joined: "2025-08-14", credits: 45.75, unused: 5.75, lifetime: 1105.9, points: 2260, sessions: 33, status: "active" },
  { id: "U-8601", name: "Colton Reyes", email: "colton.r@example.com", joined: "2024-03-30", credits: 6.4, unused: 6.4, lifetime: 214.8, points: 410, sessions: 6, status: "suspended" },
  { id: "U-8899", name: "Ingrid Sollberg", email: "ingrid.s@example.com", joined: "2026-05-11", credits: 132.0, unused: 40.0, lifetime: 512.3, points: 1120, sessions: 15, status: "active" },
  { id: "U-8920", name: "Hassan Nabil", email: "h.nabil@example.com", joined: "2026-07-02", credits: 19.9, unused: 19.9, lifetime: 96.7, points: 220, sessions: 4, status: "active" },
];

const money = (n: number) => `$${n.toFixed(2)}`;

function CustomerLedger() {
  const [rows, setRows] = useState(BASE);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [refundFor, setRefundFor] = useState<Customer | null>(null);
  const [amount, setAmount] = useState("0");

  const filtered = rows.filter(
    (r) =>
      (status === "all" || r.status === status) &&
      (r.name + r.email + r.id).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AdminShell
      title="Customer management"
      subtitle="Global ledger of client accounts, Clarity Credit balances, and refunds."
    >
      <div className="mb-4 grid gap-4 sm:grid-cols-4">
        <Metric label="Customers" value={String(rows.length)} />
        <Metric label="Credits outstanding" value={money(rows.reduce((s, r) => s + r.credits, 0))} />
        <Metric label="Refundable unused" value={money(rows.reduce((s, r) => s + r.unused, 0))} />
        <Metric label="Lifetime spend" value={money(rows.reduce((s, r) => s + r.lifetime, 0))} />
      </div>

      <DataPanel title="Customer ledger" meta={`${filtered.length} of ${rows.length} accounts`}>
        <TableToolbar
          query={query}
          onQuery={setQuery}
          placeholder="Search by name, email, or user ID"
          onExport={() =>
            exportCsv(
              "myp-customers.csv",
              ["User ID", "Name", "Email", "Joined", "Credits", "Unused", "Lifetime", "Points", "Sessions", "Status"],
              filtered.map((r) => [r.id, r.name, r.email, r.joined, r.credits, r.unused, r.lifetime, r.points, r.sessions, r.status]),
            )
          }
          right={
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="dormant">Dormant</option>
              <option value="suspended">Suspended</option>
            </select>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px]">
            <thead className="bg-secondary/60">
              <tr>
                <Th>User ID</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Joined</Th>
                <Th right>Credits</Th>
                <Th right>Unused</Th>
                <Th right>Lifetime</Th>
                <Th right>Points</Th>
                <Th right>Sessions</Th>
                <Th>Status</Th>
                <Th right>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/40">
                  <Td strong>{r.id}</Td>
                  <Td strong>{r.name}</Td>
                  <Td>{r.email}</Td>
                  <Td>{r.joined}</Td>
                  <Td right strong>{money(r.credits)}</Td>
                  <Td right>{money(r.unused)}</Td>
                  <Td right>{money(r.lifetime)}</Td>
                  <Td right>{r.points.toLocaleString()}</Td>
                  <Td right>{r.sessions}</Td>
                  <td className="px-4 py-2.5">
                    <Pill tone={r.status === "active" ? "green" : r.status === "suspended" ? "red" : "gray"}>
                      {r.status}
                    </Pill>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      disabled={r.unused <= 0}
                      onClick={() => {
                        setRefundFor(r);
                        setAmount(r.unused.toFixed(2));
                      }}
                      className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-50"
                    >
                      Refund unused
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataPanel>

      <Modal
        open={!!refundFor}
        onClose={() => setRefundFor(null)}
        title="Refund unused credits"
        subtitle={refundFor ? `${refundFor.name} · ${refundFor.id}` : ""}
        footer={
          <>
            <button
              onClick={() => setRefundFor(null)}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const amt = Number(amount) || 0;
                if (refundFor) {
                  setRows((rs) =>
                    rs.map((x) =>
                      x.id === refundFor.id
                        ? { ...x, unused: Math.max(0, x.unused - amt), credits: Math.max(0, x.credits - amt) }
                        : x,
                    ),
                  );
                }
                setRefundFor(null);
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
            >
              Issue refund
            </button>
          </>
        }
      >
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Refund amount (max {refundFor ? money(refundFor.unused) : "$0.00"})
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          className="mt-2 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground outline-none focus:border-primary"
        />
        <p className="mt-3 rounded-md bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
          Refunds return to the original payment method via NMI and appear on the customer's transaction history
          within 3–5 business days.
        </p>
      </Modal>
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-soft">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  );
}
