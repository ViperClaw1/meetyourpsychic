import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PsychicShell, PsychicPanel } from "@/components/psychic-shell";

export const Route = createFileRoute("/psychic/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule manager — MeetYourPsychic advisors" },
      { name: "description", content: "Set weekly working hours and per-minute pricing." },
      { property: "og:title", content: "Schedule manager — MeetYourPsychic advisors" },
      { property: "og:description", content: "Set weekly working hours and per-minute pricing." },
    ],
  }),
  component: ScheduleManager,
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7:00 - 22:00

type Key = `${string}-${number}`;

const DEFAULT: Key[] = [
  "Mon-18", "Mon-19", "Mon-20", "Tue-18", "Tue-19", "Wed-10", "Wed-11", "Wed-12",
  "Thu-19", "Thu-20", "Thu-21", "Fri-18", "Fri-19", "Sat-11", "Sat-12", "Sat-13",
];

function ScheduleManager() {
  const [slots, setSlots] = useState<Set<string>>(new Set(DEFAULT));
  const [chatPrice, setChatPrice] = useState(4.99);
  const [callPrice, setCallPrice] = useState(6.99);
  const [peakBoost, setPeakBoost] = useState(20);

  const toggle = (key: string) =>
    setSlots((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const label = (h: number) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? "am" : "pm"}`;

  return (
    <PsychicShell title="Schedule manager" subtitle="Tap a cell to open or close that hour for bookings.">
      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <PsychicPanel title={`Weekly availability · ${slots.size} hrs open`}>
          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-[56px_repeat(7,1fr)] gap-1">
                <span />
                {DAYS.map((d) => (
                  <span key={d} className="pb-1 text-center text-xs font-semibold text-muted-foreground">
                    {d}
                  </span>
                ))}
                {HOURS.map((h) => (
                  <Fragment key={h}>
                    <span key={`l${h}`} className="pr-2 text-right text-[11px] leading-7 text-muted-foreground">
                      {label(h)}
                    </span>
                    {DAYS.map((d) => {
                      const key = `${d}-${h}`;
                      const on = slots.has(key);
                      return (
                        <button
                          key={key}
                          onClick={() => toggle(key)}
                          aria-pressed={on}
                          aria-label={`${d} ${label(h)}`}
                          className={`h-7 rounded-[4px] border transition-colors ${
                            on
                              ? "border-primary bg-primary/85"
                              : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        />
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[3px] bg-primary/85" /> Open for bookings
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-[3px] border border-border bg-background" /> Unavailable
            </span>
          </div>
        </PsychicPanel>

        <div className="space-y-5">
          <PsychicPanel title="Dynamic pricing per minute">
            <PriceRow label="Chat reading" value={chatPrice} onChange={setChatPrice} />
            <div className="mt-5">
              <PriceRow label="Call reading" value={callPrice} onChange={setCallPrice} />
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Peak hour boost</span>
                <span className="text-sm font-semibold text-primary">+{peakBoost}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={peakBoost}
                onChange={(e) => setPeakBoost(Number(e.target.value))}
                className="mt-3 w-full accent-[var(--color-primary)]"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Applied 7pm–11pm. Peak chat rate: ${(chatPrice * (1 + peakBoost / 100)).toFixed(2)}/min.
              </p>
            </div>
          </PsychicPanel>

          <PsychicPanel title="Booked appointments">
            <div className="divide-y divide-border text-sm">
              {[
                ["Tomorrow, 11:00 AM", "Client #8712 · 30 min call"],
                ["Thursday, 7:30 PM", "Client #8655 · 45 min chat"],
                ["Saturday, 12:00 PM", "Client #8801 · 20 min call"],
              ].map(([when, who]) => (
                <div key={when} className="py-3 first:pt-0 last:pb-0">
                  <p className="font-medium text-foreground">{when}</p>
                  <p className="text-muted-foreground">{who}</p>
                </div>
              ))}
            </div>
          </PsychicPanel>
        </div>
      </div>
    </PsychicShell>
  );
}

function PriceRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground">$</span>
        <input
          type="number"
          step={0.25}
          min={0.99}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-28 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground outline-none focus:border-primary"
        />
        <span className="text-sm text-muted-foreground">per minute</span>
      </div>
    </div>
  );
}
