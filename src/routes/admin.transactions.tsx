import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataPanel, TableToolbar, Th, Td, Pill, exportCsv } from "@/components/admin-shell";
import { Modal } from "@/components/modal";

export const Route = createFileRoute("/admin/transactions")({
  head: () => ({
    meta: [
      { title: "Transaction management — MYP admin" },
      { name: "description", content: "Full financial ledger with AVS results, decline codes, and manual refunds." },
      { property: "og:title", content: "Transaction management — MYP admin" },
      { property: "og:description", content: "Full financial ledger with AVS results, decline codes, and manual refunds." },
    ],
  }),
  component: Transactions,
});

type Txn = {
  id: string;
  date: string;
  customer: string;
  advisor: string;
  type: "Top-up" | "Session" | "Refund" | "Payout" | "Credit return";
  method: string;
  auth: string;
  avs: "Y" | "Z" | "A" | "N" | "U" | "—";
  cvv: "M" | "N" | "P" | "—";
  decline: string;
  minutes: number;
  rate: number;
  gross: number;
  fee: number;
  net: number;
  refunded: number;
  status: "settled" | "pending" | "declined" | "refunded";
};

const AVS_MEANING: Record<string, string> = {
  Y: "Street + ZIP match",
  Z: "ZIP matches, street does not",
  A: "Street matches, ZIP does not",
  N: "No match",
  U: "Unavailable from issuer",
  "—": "Not applicable",
};

const DECLINE_MEANING: Record<string, string> = {
  "05": "Do Not Honor",
  "51": "Insufficient Funds",
  "54": "Expired Card",
  "14": "Invalid Card Number",
  "61": "Exceeds Withdrawal Limit",
};

const BASE: Txn[] = [
  { id: "T-99401", date: "2026-09-10 19:42", customer: "U-8712 Marisol Vega", advisor: "—", type: "Top-up", method: "Visa •4242", auth: "A19F42", avs: "Y", cvv: "M", decline: "", minutes: 0, rate: 0, gross: 100, fee: 3.2, net: 96.8, refunded: 0, status: "settled" },
  { id: "T-99403", date: "2026-09-10 18:05", customer: "U-8790 Dev Patel", advisor: "P-1042 Selene", type: "Session", method: "Clarity Credits", auth: "—", avs: "—", cvv: "—", decline: "", minutes: 24, rate: 4.99, gross: 119.76, fee: 0, net: 119.76, refunded: 0, status: "settled" },
  { id: "T-99407", date: "2026-09-10 16:20", customer: "U-8744 Priya Raman", advisor: "—", type: "Top-up", method: "Visa •3310", auth: "—", avs: "N", cvv: "N", decline: "05", minutes: 0, rate: 0, gross: 50, fee: 0, net: 0, refunded: 0, status: "declined" },
  { id: "T-99412", date: "2026-09-10 14:58", customer: "U-8801 Andre Kimura", advisor: "—", type: "Top-up", method: "Mastercard •8891", auth: "—", avs: "Z", cvv: "M", decline: "51", minutes: 0, rate: 0, gross: 250, fee: 0, net: 0, refunded: 0, status: "declined" },
  { id: "T-99414", date: "2026-09-09 22:31", customer: "U-8655 Fiona Brennan", advisor: "P-1121 Juniper", type: "Session", method: "Clarity Credits", auth: "—", avs: "—", cvv: "—", decline: "", minutes: 31, rate: 4.99, gross: 154.69, fee: 0, net: 154.69, refunded: 24.95, status: "refunded" },
  { id: "T-99416", date: "2026-09-09 20:10", customer: "U-8899 Ingrid Sollberg", advisor: "—", type: "Top-up", method: "Amex •1007", auth: "C77B01", avs: "A", cvv: "M", decline: "", minutes: 0, rate: 0, gross: 250, fee: 7.55, net: 242.45, refunded: 0, status: "settled" },
  { id: "T-99418", date: "2026-09-09 18:44", customer: "U-8920 Hassan Nabil", advisor: "P-1088 Orion", type: "Session", method: "Clarity Credits", auth: "—", avs: "—", cvv: "—", decline: "", minutes: 12, rate: 6.99, gross: 83.88, fee: 0, net: 83.88, refunded: 0, status: "settled" },
  { id: "T-99420", date: "2026-09-09 12:02", customer: "U-8601 Colton Reyes", advisor: "—", type: "Top-up", method: "Visa •7712", auth: "—", avs: "U", cvv: "P", decline: "54", minutes: 0, rate: 0, gross: 25, fee: 0, net: 0, refunded: 0, status: "declined" },
  { id: "T-99402", date: "2026-09-09 09:15", customer: "—", advisor: "P-1042 Selene", type: "Payout", method: "Dots.dev", auth: "DOT-8841", avs: "—", cvv: "—", decline: "", minutes: 0, rate: 0, gross: 842.19, fee: 1.5, net: 840.69, refunded: 0, status: "pending" },
  { id: "T-99405", date: "2026-09-08 21:47", customer: "U-8655 Fiona Brennan", advisor: "—", type: "Credit return", method: "Amex •1007", auth: "R44A19", avs: "Y", cvv: "M", decline: "", minutes: 0, rate: 0, gross: -18, fee: 0, net: -18, refunded: 0, status: "settled" },
];

const money = (n: number) => `${n < 0 ? "−" : ""}$${Math.abs(n).toFixed(2)}`;

function Transactions() {
  const [rows, setRows] = useState(BASE);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [refundFor, setRefundFor] = useState<Txn | null>(null);
  const [minutes, setMinutes] = useState(5);

  const filtered = rows.filter(
    (t) =>
      (type === "all" || t.type === type) &&
      (status === "all" || t.status === status) &&
      (t.id + t.customer + t.advisor + t.method + t.auth).toLowerCase().includes(query.toLowerCase()),
  );

  const refundAmount = refundFor ? minutes * (refundFor.rate || 0) : 0;
  const maxMinutes = refundFor ? Math.max(0, refundFor.minutes - Math.round(refundFor.refunded / (refundFor.rate || 1))) : 0;

  return (
    <AdminShell
      title="Transaction management"
      subtitle="Every authorisation, decline, and refund across the platform."
    >
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Gross volume" value={money(rows.reduce((s, t) => s + Math.max(0, t.net), 0))} />
        <Metric label="Declined" value={String(rows.filter((t) => t.status === "declined").length)} />
        <Metric label="Refunded" value={money(rows.reduce((s, t) => s + t.refunded, 0))} />
        <Metric label="Processing fees" value={money(rows.reduce((s, t) => s + t.fee, 0))} />
      </div>

      <DataPanel title="Global transaction ledger" meta={`${filtered.length} of ${rows.length} records`}>
        <TableToolbar
          query={query}
          onQuery={setQuery}
          placeholder="Search by txn ID, customer, advisor, card, or auth code"
          onExport={() =>
            exportCsv(
              "myp-transactions.csv",
              ["Txn ID", "Date", "Customer", "Advisor", "Type", "Method", "Auth", "AVS", "CVV", "Decline code", "Minutes", "Rate", "Gross", "Fee", "Net", "Refunded", "Status"],
              filtered.map((t) => [t.id, t.date, t.customer, t.advisor, t.type, t.method, t.auth, t.avs, t.cvv, t.decline ? `${t.decline} ${DECLINE_MEANING[t.decline]}` : "", t.minutes, t.rate, t.gross, t.fee, t.net, t.refunded, t.status]),
            )
          }
          right={
            <>
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
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary"
              >
                {["all", "settled", "pending", "declined", "refunded"].map((s) => (
                  <option key={s} value={s}>
                    {s === "all" ? "All statuses" : s}
                  </option>
                ))}
              </select>
            </>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1500px]">
            <thead className="bg-secondary/60">
              <tr>
                <Th>Txn ID</Th>
                <Th>Date</Th>
                <Th>Customer</Th>
                <Th>Advisor</Th>
                <Th>Type</Th>
                <Th>Method</Th>
                <Th>Auth</Th>
                <Th>AVS</Th>
                <Th>CVV</Th>
                <Th>Decline code</Th>
                <Th right>Min</Th>
                <Th right>Rate</Th>
                <Th right>Gross</Th>
                <Th right>Fee</Th>
                <Th right>Refunded</Th>
                <Th right>Net</Th>
                <Th>Status</Th>
                <Th right>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/40">
                  <Td strong>{t.id}</Td>
                  <Td>{t.date}</Td>
                  <Td>{t.customer}</Td>
                  <Td>{t.advisor}</Td>
                  <Td>
                    <Pill tone={t.type === "Payout" ? "purple" : t.gross < 0 ? "amber" : "gray"}>{t.type}</Pill>
                  </Td>
                  <Td>{t.method}</Td>
                  <Td>{t.auth}</Td>
                  <td className="whitespace-nowrap px-4 py-2.5" title={AVS_MEANING[t.avs]}>
                    <Pill tone={t.avs === "Y" ? "green" : t.avs === "N" ? "red" : t.avs === "—" ? "gray" : "amber"}>
                      {t.avs}
                    </Pill>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <Pill tone={t.cvv === "M" ? "green" : t.cvv === "N" ? "red" : "gray"}>{t.cvv}</Pill>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-[13px]">
                    {t.decline ? (
                      <span className="font-semibold text-red-600">
                        {t.decline} · {DECLINE_MEANING[t.decline]}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <Td right>{t.minutes || "—"}</Td>
                  <Td right>{t.rate ? `$${t.rate.toFixed(2)}` : "—"}</Td>
                  <Td right>{money(t.gross)}</Td>
                  <Td right>{money(t.fee)}</Td>
                  <Td right>{t.refunded ? money(t.refunded) : "—"}</Td>
                  <Td right strong>{money(t.net - t.refunded)}</Td>
                  <td className="px-4 py-2.5">
                    <Pill
                      tone={
                        t.status === "settled"
                          ? "green"
                          : t.status === "declined"
                            ? "red"
                            : t.status === "refunded"
                              ? "purple"
                              : "amber"
                      }
                    >
                      {t.status}
                    </Pill>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      disabled={t.type !== "Session" || t.minutes === 0}
                      onClick={() => {
                        setRefundFor(t);
                        setMinutes(Math.min(5, t.minutes));
                      }}
                      className="whitespace-nowrap rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-50"
                    >
                      Partial refund
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataPanel>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Legend title="AVS response codes" entries={AVS_MEANING} />
        <Legend title="Common decline codes" entries={DECLINE_MEANING} />
      </div>

      <Modal
        open={!!refundFor}
        onClose={() => setRefundFor(null)}
        title="Manual partial refund"
        subtitle={refundFor ? `${refundFor.id} · ${refundFor.customer}` : ""}
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
                if (refundFor) {
                  setRows((rs) =>
                    rs.map((x) =>
                      x.id === refundFor.id
                        ? { ...x, refunded: x.refunded + refundAmount, status: "refunded" }
                        : x,
                    ),
                  );
                }
                setRefundFor(null);
              }}
              disabled={minutes <= 0 || minutes > maxMinutes}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              Refund {minutes} min · {money(refundAmount)}
            </button>
          </>
        }
      >
        {refundFor ? (
          <>
            <p className="text-sm text-muted-foreground">
              Session ran {refundFor.minutes} minutes at ${refundFor.rate.toFixed(2)}/min. Up to {maxMinutes}{" "}
              minutes can still be refunded.
            </p>
            <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Minutes to refund
            </label>
            <input
              type="range"
              min={1}
              max={Math.max(1, maxMinutes)}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--color-primary)]"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>1 min</span>
              <span className="font-semibold text-primary">{minutes} min</span>
              <span>{maxMinutes} min</span>
            </div>

            <dl className="mt-5 space-y-2 rounded-md border border-border bg-secondary/50 p-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Credit back to client</dt>
                <dd className="font-semibold text-foreground">{money(refundAmount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Clawed back from advisor</dt>
                <dd className="text-foreground">{money(refundAmount * 0.78)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <dt className="text-muted-foreground">Platform absorbs</dt>
                <dd className="text-foreground">{money(refundAmount * 0.22)}</dd>
              </div>
            </dl>
          </>
        ) : null}
      </Modal>
    </AdminShell>
  );
}

function Legend({ title, entries }: { title: string; entries: Record<string, string> }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-soft">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{title}</p>
      <dl className="mt-2 grid gap-1 text-[13px] sm:grid-cols-2">
        {Object.entries(entries).map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <dt className="font-semibold text-foreground">{k}</dt>
            <dd className="text-muted-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
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
