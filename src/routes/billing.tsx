import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, Lock, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { ClientSubnav } from "@/components/client-subnav";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "Billing & Top-Up — MeetYourPsychic" },
      {
        name: "description",
        content:
          "Top up Clarity Credits with a secure NMI checkout, manage saved cards, and review your transaction history.",
      },
      { property: "og:title", content: "Billing & Top-Up — MeetYourPsychic" },
      {
        property: "og:description",
        content: "Top up Clarity Credits, manage saved cards, and review transaction history.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BillingPage,
});

const packs = [
  { amount: 25, bonus: 0 },
  { amount: 50, bonus: 5 },
  { amount: 100, bonus: 15 },
  { amount: 200, bonus: 40 },
];

type SavedCard = { id: string; brand: string; last4: string; exp: string; primary: boolean };

const initialCards: SavedCard[] = [
  { id: "c1", brand: "Visa", last4: "4242", exp: "08/29", primary: true },
  { id: "c2", brand: "Mastercard", last4: "8210", exp: "01/28", primary: false },
];

type Txn = {
  id: string;
  date: string;
  type: "Top-up" | "Session charge" | "Partial refund" | "Unused credit return";
  detail: string;
  amount: number;
  status: "Completed" | "Processing" | "Reversed";
};

const transactions: Txn[] = [
  { id: "TX-10432", date: "Sep 9, 2026", type: "Top-up", detail: "Visa •••• 4242 · NMI auth 88213", amount: 50, status: "Completed" },
  { id: "TX-10429", date: "Sep 8, 2026", type: "Session charge", detail: "Chat · Selene Marlowe · 14 min", amount: -69.86, status: "Completed" },
  { id: "TX-10421", date: "Sep 6, 2026", type: "Partial refund", detail: "Dropped call credit · Idris Vale", amount: 12.5, status: "Completed" },
  { id: "TX-10418", date: "Sep 3, 2026", type: "Unused credit return", detail: "Booking cancelled · deposit released", amount: 30, status: "Completed" },
  { id: "TX-10402", date: "Aug 29, 2026", type: "Top-up", detail: "Mastercard •••• 8210 · NMI auth 87740", amount: 100, status: "Completed" },
  { id: "TX-10395", date: "Aug 27, 2026", type: "Session charge", detail: "Call · Nadia Okonkwo · 22 min", amount: -82.5, status: "Reversed" },
];

const typeStyles: Record<Txn["type"], string> = {
  "Top-up": "bg-primary-soft text-primary border-primary/20",
  "Session charge": "bg-secondary text-secondary-foreground border-border",
  "Partial refund": "bg-badge-rising-soft text-badge-rising border-badge-rising/25",
  "Unused credit return": "bg-badge-new-soft text-badge-new border-badge-new/25",
};

function BillingPage() {
  const [cards, setCards] = useState(initialCards);
  const [pack, setPack] = useState(50);
  const [custom, setCustom] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [payWith, setPayWith] = useState("c1");
  const [done, setDone] = useState(false);

  const amount = custom ? Number(custom) || 0 : pack;
  const bonus = packs.find((p) => p.amount === pack && !custom)?.bonus ?? 0;

  return (
    <DashboardShell
      role="client"
      title="Billing & Top-Up"
      subtitle="Add Clarity Credits, manage saved cards, and review every transaction."
    >
      <ClientSubnav />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Checkout */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Top up Clarity Credits</h2>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              NMI secure gateway
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {packs.map((p) => (
              <button
                key={p.amount}
                onClick={() => {
                  setPack(p.amount);
                  setCustom("");
                }}
                className={`rounded-md border px-3 py-3 text-left transition-colors ${
                  !custom && pack === p.amount
                    ? "border-primary bg-primary-soft"
                    : "border-border hover:border-primary"
                }`}
              >
                <span className="block text-lg font-bold text-foreground">${p.amount}</span>
                <span className="block text-xs text-muted-foreground">
                  {p.bonus ? `+ $${p.bonus} bonus` : "No bonus"}
                </span>
              </button>
            ))}
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-foreground">Custom amount</span>
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^\d.]/g, ""))}
              inputMode="decimal"
              placeholder="e.g. 75.00"
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <div className="mt-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Pay with
            </p>
            {cards.map((c) => (
              <label
                key={c.id}
                className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-colors ${
                  payWith === c.id ? "border-primary bg-primary-soft" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="card"
                  checked={payWith === c.id}
                  onChange={() => setPayWith(c.id)}
                  className="accent-[var(--primary)]"
                />
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  {c.brand} •••• {c.last4}
                </span>
                <span className="text-xs text-muted-foreground">exp {c.exp}</span>
                {c.primary ? (
                  <span className="rounded-md bg-card px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                    Default
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setCards((cs) => cs.filter((x) => x.id !== c.id));
                  }}
                  aria-label={`Remove ${c.brand} ending ${c.last4}`}
                  className="ml-auto rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </label>
            ))}
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-colors ${
                payWith === "new" ? "border-primary bg-primary-soft" : "border-border"
              }`}
            >
              <input
                type="radio"
                name="card"
                checked={payWith === "new"}
                onChange={() => setPayWith("new")}
                className="accent-[var(--primary)]"
              />
              <Plus className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Use a new card</span>
            </label>
          </div>

          {payWith === "new" ? (
            <div className="mt-5 grid gap-4 rounded-md border border-border p-4 sm:grid-cols-2">
              <Field label="Name on card" placeholder="Alex Rivera" className="sm:col-span-2" />
              <Field label="Card number" placeholder="4111 1111 1111 1111" className="sm:col-span-2" />
              <Field label="Expiry" placeholder="MM / YY" />
              <Field label="CVV" placeholder="123" />
              <Field label="Billing ZIP" placeholder="10001" />
              <Field label="Country" placeholder="United States" />
              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="h-4 w-4 rounded accent-[var(--primary)]"
                />
                <span className="text-sm text-foreground">
                  Save this payment method for future top-ups
                </span>
              </label>
            </div>
          ) : null}

          <div className="mt-6 rounded-md border border-border bg-secondary/50 p-4 text-sm">
            <Line label="Top-up amount" value={`$${amount.toFixed(2)}`} />
            {bonus ? <Line label="Bonus credits" value={`+ $${bonus.toFixed(2)}`} /> : null}
            <Line label="Processing fee" value="$0.00" />
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base font-bold text-foreground">
              <span>Credits added</span>
              <span>${(amount + bonus).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setDone(true)}
            disabled={amount <= 0}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShieldCheck className="h-4 w-4" />
            Pay ${amount.toFixed(2)} securely
          </button>

          {done ? (
            <p className="mt-4 flex items-center gap-2 rounded-md border border-online/30 bg-online/10 px-4 py-3 text-sm font-medium text-foreground">
              <CheckCircle2 className="h-4 w-4 text-online" />
              Simulated NMI approval · ${(amount + bonus).toFixed(2)} added to your wallet.
            </p>
          ) : null}
        </section>

        {/* Saved methods */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-soft lg:self-start">
          <h2 className="text-base font-bold text-foreground">Saved payment methods</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tokenised by NMI — full card numbers are never stored by MYP.
          </p>
          <ul className="mt-5 space-y-3">
            {cards.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-md border border-border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {c.brand} •••• {c.last4}
                  </p>
                  <p className="text-xs text-muted-foreground">Expires {c.exp}</p>
                </div>
                {c.primary ? (
                  <span className="rounded-md bg-primary-soft px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                    Default
                  </span>
                ) : (
                  <button
                    onClick={() =>
                      setCards((cs) => cs.map((x) => ({ ...x, primary: x.id === c.id })))
                    }
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Make default
                  </button>
                )}
              </li>
            ))}
            {cards.length === 0 ? (
              <li className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                No saved cards yet.
              </li>
            ) : null}
          </ul>
          <div className="mt-6 rounded-md border border-border bg-secondary/50 p-4">
            <p className="text-sm font-semibold text-foreground">Auto top-up</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Automatically add $25 when your balance drops below $5 so calls never cut off
              mid-session.
            </p>
            <button className="mt-3 rounded-md border border-border px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-card">
              Enable auto top-up
            </button>
          </div>
        </section>
      </div>

      {/* Transactions */}
      <section className="mt-8 overflow-hidden rounded-lg border border-border bg-card shadow-soft">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-bold text-foreground">Transaction History</h2>
          <span className="text-xs text-muted-foreground">Last 30 days</span>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Reference</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Detail</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-secondary/40">
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{t.date}</td>
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-muted-foreground">
                    {t.id}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] ${typeStyles[t.type]}`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{t.detail}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold ${
                        t.status === "Completed"
                          ? "text-online"
                          : t.status === "Processing"
                            ? "text-badge-rising"
                            : "text-destructive"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-4 text-right font-semibold ${
                      t.amount >= 0 ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {t.amount >= 0 ? "+" : "−"}${Math.abs(t.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}

function Field({
  label,
  placeholder,
  className = "",
}: {
  label: string;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
