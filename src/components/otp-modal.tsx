import { useEffect, useRef, useState } from "react";

const LENGTH = 6;
const MOCK_CODE = "428913";

export function OtpModal({
  open,
  phone = "+1 (555) 014-2280",
  onClose,
  onVerified,
}: {
  open: boolean;
  phone?: string;
  onClose: () => void;
  onVerified: () => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "verifying" | "verified">("idle");
  const [seconds, setSeconds] = useState(60);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!open) return;
    setDigits(Array(LENGTH).fill(""));
    setError(null);
    setStatus("idle");
    setSeconds(60);
    const t = setTimeout(() => inputs.current[0]?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open || seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [open, seconds]);

  if (!open) return null;

  const submit = (code: string) => {
    setStatus("verifying");
    setError(null);
    setTimeout(() => {
      if (code === MOCK_CODE || code === "000000") {
        setStatus("verified");
        setTimeout(onVerified, 700);
      } else {
        setStatus("idle");
        setError("That code doesn't match. Try again.");
        setDigits(Array(LENGTH).fill(""));
        inputs.current[0]?.focus();
      }
    }, 900);
  };

  const setAt = (i: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      const next = [...digits];
      next[i] = "";
      setDigits(next);
      return;
    }
    const next = [...digits];
    clean.split("").forEach((c, k) => {
      if (i + k < LENGTH) next[i + k] = c;
    });
    setDigits(next);
    const landed = Math.min(i + clean.length, LENGTH - 1);
    inputs.current[landed]?.focus();
    if (next.every((d) => d)) submit(next.join(""));
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      e.preventDefault();
      const next = [...digits];
      next[i - 1] = "";
      setDigits(next);
      inputs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  const complete = digits.every((d) => d);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-7 shadow-lift">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Verify your number</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              We sent a 6-digit code to <span className="font-medium text-foreground">{phone}</span>.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Close
          </button>
        </div>

        <div className="mt-6 flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={d}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={LENGTH}
              disabled={status !== "idle"}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              className={`h-14 w-full rounded-md border bg-background text-center text-xl font-bold text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary/20 disabled:opacity-70 ${
                error
                  ? "border-destructive"
                  : status === "verified"
                    ? "border-primary bg-primary-soft"
                    : "border-input focus:border-primary"
              }`}
            />
          ))}
        </div>

        {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}
        {status === "verifying" && (
          <p className="mt-3 text-sm text-muted-foreground">Verifying code…</p>
        )}
        {status === "verified" && (
          <p className="mt-3 text-sm font-semibold text-primary">Number verified — signing you in…</p>
        )}

        <button
          disabled={!complete || status !== "idle"}
          onClick={() => submit(digits.join(""))}
          className="mt-6 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Verify &amp; continue
        </button>

        <div className="mt-4 flex items-center justify-between text-sm">
          {seconds > 0 ? (
            <span className="text-muted-foreground">
              Resend code in <span className="font-semibold text-foreground">{seconds}s</span>
            </span>
          ) : (
            <button
              onClick={() => {
                setSeconds(60);
                setError(null);
                setDigits(Array(LENGTH).fill(""));
                inputs.current[0]?.focus();
              }}
              className="font-semibold text-primary hover:underline"
            >
              Resend code
            </button>
          )}
          <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">
            Demo code: {MOCK_CODE}
          </span>
        </div>
      </div>
    </div>
  );
}
