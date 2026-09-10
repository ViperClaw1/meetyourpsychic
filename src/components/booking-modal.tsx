import { useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Modal } from "@/components/modal";
import type { Advisor } from "@/data/advisors";

const slots = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "4:00 PM", "6:30 PM", "8:00 PM", "9:30 PM"];
const unavailable = new Set(["12:00 PM", "6:30 PM"]);
const monthLabel = "September 2026";
const firstWeekdayOffset = 1; // month starts Tuesday
const daysInMonth = 30;

export function BookingModal({
  advisor,
  open,
  onClose,
}: {
  advisor: Advisor;
  open: boolean;
  onClose: () => void;
}) {
  const [day, setDay] = useState<number | null>(12);
  const [slot, setSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);
  const [confirmed, setConfirmed] = useState(false);

  const deposit = (advisor.pricePerMin * duration).toFixed(2);

  const close = () => {
    onClose();
    setTimeout(() => setConfirmed(false), 250);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={confirmed ? "Booking confirmed" : `Book a session with ${advisor.name}`}
      subtitle={
        confirmed
          ? "A calendar invite and reminder have been sent to your email."
          : "Pick a date and time. Your deposit is only captured when the session starts."
      }
      width="max-w-2xl"
      footer={
        confirmed ? (
          <button
            onClick={close}
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Done
          </button>
        ) : (
          <>
            <button
              onClick={close}
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              disabled={!day || !slot}
              onClick={() => setConfirmed(true)}
              className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirm Booking
            </button>
          </>
        )
      }
    >
      {confirmed ? (
        <div className="space-y-3">
          <SummaryRow label="Advisor" value={advisor.name} />
          <SummaryRow label="When" value={`Sep ${day}, 2026 · ${slot}`} />
          <SummaryRow label="Length" value={`${duration} minutes`} />
          <SummaryRow label="Deposit hold" value={`$${deposit}`} />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between">
              <button className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-sm font-semibold text-foreground">{monthLabel}</p>
              <button className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={`${d}${i}`}>{d}</span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {Array.from({ length: firstWeekdayOffset }).map((_, i) => (
                <span key={`pad-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                const disabled = d < 10 || d % 7 === 0;
                const active = day === d;
                return (
                  <button
                    key={d}
                    disabled={disabled}
                    onClick={() => setDay(d)}
                    className={`aspect-square rounded-md border text-sm font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : disabled
                          ? "border-transparent text-muted-foreground/40"
                          : "border-border text-foreground hover:border-primary hover:bg-primary-soft"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Available times
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {slots.map((s) => {
                const off = unavailable.has(s);
                const active = slot === s;
                return (
                  <button
                    key={s}
                    disabled={off}
                    onClick={() => setSlot(s)}
                    className={`rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary-soft text-primary"
                        : off
                          ? "border-border text-muted-foreground/40 line-through"
                          : "border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Session length
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[15, 30, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                    duration === d
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border text-foreground hover:border-primary"
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3 rounded-md border border-badge-rising/30 bg-badge-rising-soft p-3.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-badge-rising" />
              <p className="text-xs leading-relaxed text-foreground">
                <span className="font-semibold">Deposit hold of ${deposit}.</span> We place a
                temporary authorisation on your Clarity Credits when you book. It is released if you
                cancel more than 2 hours before the session.
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
