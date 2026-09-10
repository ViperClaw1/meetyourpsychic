import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/dashboard-shell";
import { PsychicShell, PsychicPanel } from "@/components/psychic-shell";

export const Route = createFileRoute("/psychic/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings — MeetYourPsychic advisors" },
      { name: "description", content: "Track payouts, session revenue, and platform fees." },
      { property: "og:title", content: "Earnings — MeetYourPsychic advisors" },
      { property: "og:description", content: "Track payouts, session revenue, and platform fees." },
    ],
  }),
  component: Earnings,
});

const ROWS = [
  ["Sep 9", "Chat · Client #8790", "24 min", "$119.76", "$83.83"],
  ["Sep 9", "Call · Client #8744", "18 min", "$125.82", "$88.07"],
  ["Sep 8", "Chat · Client #8712", "31 min", "$154.69", "$108.28"],
  ["Sep 7", "Call · Client #8655", "12 min", "$83.88", "$58.72"],
  ["Sep 6", "Chat · Client #8601", "45 min", "$224.55", "$157.19"],
];

const BARS = [62, 78, 45, 91, 70, 88, 54];

function Earnings() {
  return (
    <PsychicShell title="Earnings" subtitle="Payouts are released every Tuesday for the prior week.">
      <div className="grid gap-5 sm:grid-cols-3">
        <Card label="Available balance" value="$842.19" hint="Next payout Tue, Sep 15" />
        <Card label="This month" value="$4,318" hint="70% advisor share" />
        <Card label="Lifetime" value="$68,940" hint="Since Mar 2021" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <PsychicPanel title="Last 7 days">
          <div className="flex h-40 items-end gap-3">
            {BARS.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-[4px] bg-primary/85" style={{ height: `${v}%` }} />
                <span className="text-[11px] text-muted-foreground">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </PsychicPanel>

        <PsychicPanel title="Recent sessions">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 font-semibold">Date</th>
                  <th className="pb-2 font-semibold">Session</th>
                  <th className="pb-2 font-semibold">Length</th>
                  <th className="pb-2 font-semibold">Gross</th>
                  <th className="pb-2 text-right font-semibold">Your share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ROWS.map((r) => (
                  <tr key={r.join()}>
                    <td className="py-3 text-muted-foreground">{r[0]}</td>
                    <td className="py-3 text-foreground">{r[1]}</td>
                    <td className="py-3 text-muted-foreground">{r[2]}</td>
                    <td className="py-3 text-muted-foreground">{r[3]}</td>
                    <td className="py-3 text-right font-semibold text-foreground">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PsychicPanel>
      </div>
    </PsychicShell>
  );
}
