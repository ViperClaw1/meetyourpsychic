import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataPanel, TableToolbar, Th, Td, Pill, exportCsv } from "@/components/admin-shell";

export const Route = createFileRoute("/admin/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — MYP admin" },
      { name: "description", content: "Global ledger of top-ups, session charges, refunds, and payouts." },
      { property: "og:title", content: "Transactions — MYP admin" },
      { property: "og:description", content: "Global ledger of top-ups, session charges, refunds, and payouts." },
    ],
  }),
  component: Transactions,
});

type Txn = {
  id: string;
  date: string;
  party: string;
  type: "Top-up" | "Session" | "Refund" | "Payout" | "Credit return";
  method: string;
  gross: number;
  fee: number;
  net: number;
  status: "settled" | "pending" | "failed";
};

const BASE: Txn[] = [
  { id: "T-99401", date: "2026-09-10", party: "U-8712 Marisol Vega", type: "Top-up", method: "NMI · Visa 4242", gross: 100, fee: 3.2, net: 96.8, status: "settled" },
  { id: "T-99402", date: "2026-09-10", party: "P-1042 Selene Marchetti", type: "Payout", method: "Dots.dev", gross: 842.19, fee: 1.5, net: 840.69, status: "pending" },
  { id: "T-99403", date: "2026-09-10", party: "U-8790 Dev Patel", type: "Session", method: "Clarity Credits", gross: 119.76, fee: 0, net: 119.76, status: "settled" },
  { id: "T-99404", date: "2026-09-09", party: "U-8801 Andre Kimura", type: "Refund", method: "NMI · Mastercard 8891", gross: -42.5, fee: 0, net: -42.5, status: "settled" },
  { id: "T-99405", date: "2026-09-09", party: "U-8655 Fiona Brennan", type: "Credit return", method: "NMI · Amex 1007", gross: -18, fee: 0, net: -18, status: "settled" },
  { id: "T-99406", date: "2026-09-09", party: "P-1088 Orion Vance", type: "Payout", method: "PayPal", gross: 2310.4, fee: 46.21, net: 2264.19, status: "settled" },
  { id: "T-99407", date: "2026-09-08", party: "U-8744 Priya Raman", type: "Top-up", method: "NMI · Visa 3310", gross: 50, fee: 1.75, net: 48.25, status: "failed" },
  { id: "T-99408", date: "2026-09-08", party: "U-8899 Ingrid Sollberg", type: "Top-up", method: "NMI · Visa 7712", gross: 250, fee: 7.55, net: 242.45, status: "settled" },
  { id: "T-99409", date: "2026-09-08", party: "U-8920 Hassan Nabil", type: "Session", method: "Clarity Credits", gross: 83.88, fee: 0, net: 83.88, status: "settled" },
  { id: "T-99410", date: "2026-09-07", party: "P-1121 Juniper Blake", type: "Payout", method: "Dots.dev", gross: 402.66, fee: 1.5, net: 401.16, status: "settled" },
];

const money = (n: number) => `${n < 0 ? "−" : ""}$${Math.abs(n).toFixed(2)}`;

function Transactions() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const filtered = BASE.filter(
    (t) =>
      (type === "all" || t.type === type) &&
      (t.id + t.party + t.method).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AdminShell title="Transactions" subtitle="Every movement of money across the marketplace.">
      <div className="mb-4 grid gap-4 sm:grid-cols-4">
        <Metric label="Gross volume" value={money(BASE.reduce((s, t) => s + Math.max(0, t.gross), 0))} />
        <Metric label="Refunds & returns" value={money(BASE.filter((t) => t.gross < 0).reduce((s, t) => s + t.gross, 0))} />
        <Metric label="Processing fees" value={money(BASE.reduce((s, t) => s + t.fee, 0))} />
        <Metric label="Failed" value={String(BASE.filter((t) => t.status === "failed").length)} />
      </div>

      <DataPanel title="Global transaction ledger" meta={`${filtered.length} of ${BASE.length} records`}>
        <TableToolbar
          query={query}
          onQuery={setQuery}
          placeholder="Search by transaction ID, party, or method"
          onExport={() =>
            exportCsv(
              "myp-transactions.csv",
              ["Txn ID", "Date", "Party", "Type", "Method", "Gross", "Fee", "Net", "Status"],
              filtered.map((t) => [t.id, t.date, t.party, t.type, t.method, t.gross, t.fee, t.net, t.status]),
            )
          }
          right={
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary"
            >
              {["all", "Top-up", "Session", "Refund", "Payout", "Credit return"].map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All types" : t}
                </option>
              ))}
            </select>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead className="bg-secondary/60">
              <tr>
                <Th>Txn ID</Th>
                <Th>Date</Th>
                <Th>Party</Th>
                <Th>Type</Th>
                <Th>Method</Th>
                <Th right>Gross</Th>
                <Th right>Fee</Th>
                <Th right>Net</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/40">
                  <Td strong>{t.id}</Td>
                  <Td>{t.date}</Td>
                  <Td>{t.party}</Td>
                  <Td>
                    <Pill tone={t.type === "Payout" ? "purple" : t.gross < 0 ? "amber" : "gray"}>{t.type}</Pill>
                  </Td>
                  <Td>{t.method}</Td>
                  <Td right>{money(t.gross)}</Td>
                  <Td right>{money(t.fee)}</Td>
                  <Td right strong>{money(t.net)}</Td>
                  <td className="px-4 py-2.5">
                    <Pill tone={t.status === "settled" ? "green" : t.status === "failed" ? "red" : "amber"}>
                      {t.status}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataPanel>
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
