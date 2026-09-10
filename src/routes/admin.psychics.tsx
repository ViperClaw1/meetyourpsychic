import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataPanel, TableToolbar, Th, Td, Pill, exportCsv } from "@/components/admin-shell";
import { Modal } from "@/components/modal";

export const Route = createFileRoute("/admin/psychics")({
  head: () => ({
    meta: [
      { title: "Psychic management — MYP admin" },
      { name: "description", content: "Advisor payout ledgers and manual commission overrides." },
      { property: "og:title", content: "Psychic management — MYP admin" },
      { property: "og:description", content: "Advisor payout ledgers and manual commission overrides." },
    ],
  }),
  component: PsychicLedger,
});

type Advisor = {
  id: string;
  name: string;
  category: string;
  rating: number;
  monthly: number;
  pending: number;
  wallet: number;
  lifetime: number;
  commission: number;
  override: boolean;
  payout: "Dots.dev" | "PayPal" | "Not set";
  status: "active" | "review" | "suspended";
};

const BASE: Advisor[] = [
  { id: "P-1042", name: "Selene Marchetti", category: "Tarot", rating: 4.9, monthly: 4318, pending: 496.09, wallet: 842.19, lifetime: 68940, commission: 22, override: false, payout: "Dots.dev", status: "active" },
  { id: "P-1088", name: "Orion Vance", category: "Astrology", rating: 4.7, monthly: 7810, pending: 1204.5, wallet: 2310.4, lifetime: 121400, commission: 27, override: false, payout: "PayPal", status: "active" },
  { id: "P-1121", name: "Juniper Blake", category: "Mediumship", rating: 4.8, monthly: 2960, pending: 318.2, wallet: 402.66, lifetime: 42890, commission: 22, override: false, payout: "Dots.dev", status: "active" },
  { id: "P-1155", name: "Kai Fontaine", category: "Dream analysis", rating: 4.4, monthly: 1180, pending: 88.4, wallet: 96.1, lifetime: 8420, commission: 30, override: true, payout: "Not set", status: "review" },
  { id: "P-1190", name: "Amara Diallo", category: "Astrology", rating: 5.0, monthly: 5240, pending: 702.8, wallet: 1180.0, lifetime: 30110, commission: 25, override: false, payout: "Dots.dev", status: "active" },
  { id: "P-1204", name: "Tobias Lund", category: "Mediumship", rating: 3.9, monthly: 640, pending: 0, wallet: 41.2, lifetime: 5210, commission: 30, override: true, payout: "PayPal", status: "suspended" },
];

const money = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function PsychicLedger() {
  const [rows, setRows] = useState(BASE);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<Advisor | null>(null);
  const [rate, setRate] = useState(22);

  const filtered = rows.filter(
    (r) =>
      (status === "all" || r.status === status) &&
      (r.name + r.id + r.category).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AdminShell
      title="Psychic management"
      subtitle="Payout ledgers, commission tiers, and manual rate overrides."
    >
      <div className="mb-4 grid gap-4 sm:grid-cols-4">
        <Metric label="Advisors" value={String(rows.length)} />
        <Metric label="Pending ledger" value={money(rows.reduce((s, r) => s + r.pending, 0))} />
        <Metric label="Withdrawable" value={money(rows.reduce((s, r) => s + r.wallet, 0))} />
        <Metric label="Manual overrides" value={String(rows.filter((r) => r.override).length)} />
      </div>

      <DataPanel title="Advisor payout ledger" meta={`${filtered.length} of ${rows.length} advisors`}>
        <TableToolbar
          query={query}
          onQuery={setQuery}
          placeholder="Search by advisor, ID, or category"
          onExport={() =>
            exportCsv(
              "myp-advisors.csv",
              ["Advisor ID", "Name", "Category", "Rating", "Monthly sales", "Pending", "Wallet", "Lifetime", "Commission %", "Override", "Payout", "Status"],
              filtered.map((r) => [r.id, r.name, r.category, r.rating, r.monthly, r.pending, r.wallet, r.lifetime, r.commission, r.override ? "yes" : "no", r.payout, r.status]),
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
              <option value="review">In review</option>
              <option value="suspended">Suspended</option>
            </select>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1160px]">
            <thead className="bg-secondary/60">
              <tr>
                <Th>Advisor ID</Th>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th right>Rating</Th>
                <Th right>Monthly sales</Th>
                <Th right>Pending</Th>
                <Th right>Wallet</Th>
                <Th right>Lifetime</Th>
                <Th right>Commission</Th>
                <Th>Payout</Th>
                <Th>Status</Th>
                <Th right>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/40">
                  <Td strong>{r.id}</Td>
                  <Td strong>{r.name}</Td>
                  <Td>{r.category}</Td>
                  <Td right>{r.rating.toFixed(1)}</Td>
                  <Td right>{money(r.monthly)}</Td>
                  <Td right>{money(r.pending)}</Td>
                  <Td right strong>{money(r.wallet)}</Td>
                  <Td right>{money(r.lifetime)}</Td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-[13px] font-semibold text-foreground">{r.commission}%</span>
                    {r.override ? (
                      <span className="ml-1.5 align-middle">
                        <Pill tone="purple">override</Pill>
                      </span>
                    ) : null}
                  </td>
                  <Td>{r.payout}</Td>
                  <td className="px-4 py-2.5">
                    <Pill tone={r.status === "active" ? "green" : r.status === "suspended" ? "red" : "amber"}>
                      {r.status}
                    </Pill>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => {
                        setEditing(r);
                        setRate(r.commission);
                      }}
                      className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary"
                    >
                      Set commission
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataPanel>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Manual commission override"
        subtitle={editing ? `${editing.name} · ${editing.id}` : ""}
        footer={
          <>
            <button
              onClick={() => {
                if (editing) {
                  setRows((rs) =>
                    rs.map((x) => (x.id === editing.id ? { ...x, override: false, commission: 22 } : x)),
                  );
                }
                setEditing(null);
              }}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear override
            </button>
            <button
              onClick={() => {
                if (editing) {
                  setRows((rs) =>
                    rs.map((x) =>
                      x.id === editing.id ? { ...x, commission: rate, override: rate !== 22 } : x,
                    ),
                  );
                }
                setEditing(null);
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
            >
              Save override
            </button>
          </>
        }
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Platform commission rate</span>
          <span className="text-xl font-semibold text-primary">{rate}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={40}
          step={1}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--color-primary)]"
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>10%</span>
          <span>Tiered default: 22 / 25 / 27%</span>
          <span>40%</span>
        </div>
        <p className="mt-4 rounded-md bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
          An override freezes the advisor's automatic tier progression until it is cleared. The change applies to
          sessions completed after saving.
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
