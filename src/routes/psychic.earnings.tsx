import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PsychicShell, PsychicPanel } from "@/components/psychic-shell";
import { Modal } from "@/components/modal";
import { Check, CircleDollarSign, Clock } from "lucide-react";

export const Route = createFileRoute("/psychic/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings & payouts — MeetYourPsychic advisors" },
      { name: "description", content: "Track pending ledger, commission tier, and withdraw your balance." },
      { property: "og:title", content: "Earnings & payouts — MeetYourPsychic advisors" },
      { property: "og:description", content: "Track pending ledger, commission tier, and withdraw your balance." },
    ],
  }),
  component: Earnings,
});

const PENDING = [
  ["Sep 10", "Chat · Client #8790", "$83.83", "Clears Sep 17"],
  ["Sep 9", "Call · Client #8744", "$88.07", "Clears Sep 16"],
  ["Sep 8", "Chat · Client #8712", "$108.28", "Clears Sep 15"],
  ["Sep 7", "Call · Client #8655", "$58.72", "Clears Sep 14"],
  ["Sep 6", "Chat · Client #8601", "$157.19", "Clears Sep 13"],
];

const TIERS = [
  { name: "Standard", rate: 22, threshold: 0 },
  { name: "Preferred", rate: 25, threshold: 3000 },
  { name: "Elite", rate: 27, threshold: 7500 },
];

const MONTHLY_SALES = 4318;
const WALLET = 842.19;
const PENDING_TOTAL = 496.09;

function Earnings() {
  const [provider, setProvider] = useState<"dots" | "paypal" | null>("dots");
  const [connected, setConnected] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState(WALLET.toFixed(2));
  const [done, setDone] = useState(false);

  const current = [...TIERS].reverse().find((t) => MONTHLY_SALES >= t.threshold)!;
  const next = TIERS.find((t) => t.threshold > MONTHLY_SALES);
  const max = TIERS[TIERS.length - 1]!.threshold;
  const pct = Math.min(100, (MONTHLY_SALES / max) * 100);

  const amt = Math.max(0, Math.min(WALLET, Number(amount) || 0));
  const processing = provider === "paypal" ? amt * 0.02 : 1.5;
  const net = Math.max(0, amt - processing);

  return (
    <PsychicShell title="Earnings & payouts" subtitle="Everything about what you've earned and how it reaches you.">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wide">7-day pending ledger</p>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            ${PENDING_TOTAL.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Held 7 days to cover refunds and disputes. Next release Sep 13.
          </p>
          <div className="mt-4 divide-y divide-border border-t border-border text-sm">
            {PENDING.map((r) => (
              <div key={r.join()} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="text-foreground">{r[1]}</p>
                  <p className="text-xs text-muted-foreground">
                    {r[0]} · {r[3]}
                  </p>
                </div>
                <span className="font-semibold text-foreground">{r[2]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col rounded-lg border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CircleDollarSign className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wide">Withdrawable wallet balance</p>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-primary">${WALLET.toFixed(2)}</p>
          <p className="mt-1 text-sm text-muted-foreground">Cleared funds, available now.</p>

          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Earned this month</dt>
              <dd className="font-semibold text-foreground">${MONTHLY_SALES.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Lifetime paid out</dt>
              <dd className="font-semibold text-foreground">$68,940</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Minimum withdrawal</dt>
              <dd className="font-semibold text-foreground">$25.00</dd>
            </div>
          </dl>

          <button
            onClick={() => setWithdrawOpen(true)}
            disabled={!connected}
            className="mt-auto w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Request withdrawal
          </button>
          {!connected ? (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Connect a payout account below to withdraw.
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <PsychicPanel title="Commission tier tracker">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Your current rate</p>
              <p className="text-3xl font-semibold tracking-tight text-foreground">{current.rate}%</p>
              <p className="text-sm text-muted-foreground">{current.name} tier</p>
            </div>
            {next ? (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  ${(next.threshold - MONTHLY_SALES).toLocaleString()}
                </span>{" "}
                more this month to reach {next.rate}%
              </p>
            ) : (
              <p className="text-sm font-semibold text-primary">Top tier reached</p>
            )}
          </div>

          <div className="mt-6">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {TIERS.map((t) => {
                const reached = MONTHLY_SALES >= t.threshold;
                return (
                  <div
                    key={t.name}
                    className={`rounded-md border px-3 py-2.5 ${
                      reached ? "border-primary bg-primary/8" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {reached ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
                      <p className={`text-sm font-semibold ${reached ? "text-primary" : "text-foreground"}`}>
                        {t.rate}%
                      </p>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.name} · ${t.threshold.toLocaleString()}+ / mo
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Commission is the share MYP keeps. A lower monthly volume means a higher platform share; tiers reset
              on the 1st.
            </p>
          </div>
        </PsychicPanel>

        <PsychicPanel title="Payout method">
          <div className="space-y-3">
            {[
              { key: "dots" as const, name: "Dots.dev", desc: "Mass payouts to bank, card, or wallet · $1.50 flat" },
              { key: "paypal" as const, name: "PayPal", desc: "Payout in 1–2 business days · 2% fee" },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => {
                  setProvider(p.key);
                  setConnected(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-md border px-4 py-3 text-left transition-colors ${
                  provider === p.key ? "border-primary bg-primary/8" : "border-border hover:border-primary"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
                {provider === p.key && connected ? (
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                    Connected
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <button
            onClick={() => setConnected((c) => !c)}
            disabled={!provider}
            className={`mt-4 w-full rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
              connected
                ? "border border-border text-muted-foreground hover:text-foreground"
                : "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover"
            }`}
          >
            {connected ? "Disconnect account" : `Connect ${provider === "paypal" ? "PayPal" : "Dots.dev"}`}
          </button>
          <p className="mt-3 text-xs text-muted-foreground">
            Payout accounts are verified with tax details (W-9 / W-8BEN) before the first withdrawal.
          </p>
        </PsychicPanel>
      </div>

      <Modal
        open={withdrawOpen}
        onClose={() => {
          setWithdrawOpen(false);
          setDone(false);
        }}
        title="Request withdrawal"
        subtitle={`Paying out via ${provider === "paypal" ? "PayPal" : "Dots.dev"}`}
        footer={
          done ? (
            <button
              onClick={() => {
                setWithdrawOpen(false);
                setDone(false);
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              Done
            </button>
          ) : (
            <>
              <button
                onClick={() => setWithdrawOpen(false)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => setDone(true)}
                disabled={amt < 25}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                Withdraw ${net.toFixed(2)}
              </button>
            </>
          )
        }
      >
        {done ? (
          <div className="py-4 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">Withdrawal requested</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ${net.toFixed(2)} is on its way. Expect arrival in 1–2 business days.
            </p>
          </div>
        ) : (
          <>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Amount
            </label>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-semibold text-muted-foreground">$</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground outline-none focus:border-primary"
              />
              <button
                onClick={() => setAmount(WALLET.toFixed(2))}
                className="shrink-0 rounded-md border border-border px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Max
              </button>
            </div>

            <dl className="mt-5 space-y-2 rounded-md border border-border bg-secondary/50 p-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Requested</dt>
                <dd className="text-foreground">${amt.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Processing fee ({provider === "paypal" ? "2%" : "flat"})
                </dt>
                <dd className="text-red-600">−${processing.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <dt className="font-semibold text-foreground">You receive</dt>
                <dd className="font-semibold text-foreground">${net.toFixed(2)}</dd>
              </div>
            </dl>
            {amt < 25 ? (
              <p className="mt-3 text-xs font-medium text-red-600">Minimum withdrawal is $25.00.</p>
            ) : null}
          </>
        )}
      </Modal>
    </PsychicShell>
  );
}
