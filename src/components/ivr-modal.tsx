import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Mic, MicOff, PhoneOff, Volume2 } from "lucide-react";
import type { Advisor } from "@/data/advisors";

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function IvrCallModal({
  advisor,
  open,
  onClose,
}: {
  advisor: Advisor;
  open: boolean;
  onClose: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState(90);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open || ended) return;
    timer.current = setInterval(() => {
      setElapsed((e) => e + 1);
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [open, ended]);

  useEffect(() => {
    if (!open) {
      setElapsed(0);
      setRemaining(90);
      setEnded(false);
      setMuted(false);
    }
  }, [open]);

  if (!open) return null;

  const lowBalance = remaining <= 60;
  const cost = (elapsed / 60) * advisor.pricePerMin;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/60 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-card shadow-lift">
        <div className="flex flex-col items-center border-b border-border bg-primary-soft px-6 py-8 text-center">
          <img
            src={advisor.photo}
            alt={advisor.name}
            className="h-20 w-20 rounded-lg border border-border object-cover"
          />
          <p className="mt-4 text-base font-bold text-foreground">{advisor.name}</p>
          {!ended ? (
            <div className="mt-3 flex h-8 items-end justify-center gap-[3px]">
              {[0.55, 0.8, 1, 0.7, 1, 0.45, 0.9, 0.65, 1, 0.5, 0.85, 0.6].map((h, i) => (
                <span
                  key={i}
                  className={`w-[3px] rounded-full ${lowBalance ? "bg-destructive" : "bg-primary"}`}
                  style={{
                    height: `${h * 100}%`,
                    animation: `myp-wave ${0.9 + (i % 4) * 0.18}s ease-in-out ${i * 0.07}s infinite`,
                  }}
                />
              ))}
            </div>
          ) : null}
          <p className="text-sm text-muted-foreground">
            {ended ? "Call ended" : "Voice session in progress"}
          </p>
          <p
            className={`mt-4 font-mono text-4xl font-bold tabular-nums ${
              lowBalance
                ? "text-destructive animate-pulse"
                : "text-foreground"
            }`}
          >
            {fmt(elapsed)}
          </p>
          <div className="mt-2 flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <span
              className={
                lowBalance
                  ? "font-bold text-destructive animate-pulse"
                  : "font-medium text-muted-foreground"
              }
            >
              Balance time left: {fmt(remaining)}
            </span>
            <span>Charged: ${cost.toFixed(2)}</span>
          </div>
        </div>

        <div className="px-6 py-6">
          {lowBalance && !ended ? (
            <div className="mb-5 rounded-md border border-destructive/30 bg-destructive/8 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Low Balance: Top Up 10 Mins or End Call
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Your Clarity Credits are running out. Top up now to keep the session going, or the
                call will end automatically.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setRemaining((r) => r + 600)}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Top Up 10 Mins
                </button>
                <button
                  onClick={() => setEnded(true)}
                  className="rounded-md border border-destructive/40 px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                >
                  End Call
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setMuted((m) => !m)}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {muted ? "Unmute" : "Mute"}
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
              <Volume2 className="h-4 w-4" />
              Speaker
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90"
            >
              <PhoneOff className="h-4 w-4" />
              {ended ? "Close" : "Hang up"}
            </button>
          </div>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground">
            IVR bridge · Session recorded for quality and safety review
          </p>
        </div>
      </div>
    </div>
  );
}
