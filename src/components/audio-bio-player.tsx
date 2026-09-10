import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

const bars = Array.from({ length: 48 }, (_, i) => 30 + Math.round(50 * Math.abs(Math.sin(i * 1.7))));

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioBioPlayer({ seconds, name }: { seconds: number; name: string }) {
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setPos((p) => {
        if (p + 1 >= seconds) {
          setPlaying(false);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [playing, seconds]);

  const progress = pos / seconds;

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-soft">
      <button
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pause audio bio" : "Play audio bio"}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Audio intro from {name.split(" ")[0]}
        </p>
        <div className="mt-2 flex h-8 items-center gap-[3px]">
          {bars.map((h, i) => {
            const active = i / bars.length <= progress;
            return (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className={`w-full rounded-sm transition-colors ${
                  active ? "bg-primary" : "bg-border"
                }`}
              />
            );
          })}
        </div>
      </div>
      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
        {fmt(pos)} / {fmt(seconds)}
      </span>
    </div>
  );
}
