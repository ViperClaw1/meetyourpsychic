import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PsychicShell, PsychicPanel } from "@/components/psychic-shell";
import { Mic, Play, Pause, Upload, Square, Trash2 } from "lucide-react";

export const Route = createFileRoute("/psychic/profile")({
  head: () => ({
    meta: [
      { title: "Profile editor — MeetYourPsychic advisors" },
      { name: "description", content: "Edit your biography, taglines, and audio introduction." },
      { property: "og:title", content: "Profile editor — MeetYourPsychic advisors" },
      { property: "og:description", content: "Edit your biography, taglines, and audio introduction." },
    ],
  }),
  component: ProfileEditor,
});

function ProfileEditor() {
  const [tagline, setTagline] = useState("Clear answers, delivered with compassion.");
  const [shortTag, setShortTag] = useState("Tarot · Love · Career");
  const [bio, setBio] = useState(
    "I have read for over 12 years, blending tarot with clairsentient impressions. My style is direct but warm — I will tell you what I see, then help you decide what to do with it.",
  );
  const [saved, setSaved] = useState(false);

  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [clip, setClip] = useState<number | null>(42);

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <PsychicShell title="Profile editor" subtitle="How clients see you across search and your public page.">
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <PsychicPanel
          title="Biography & taglines"
          action={
            <button
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
            >
              {saved ? "Saved" : "Save changes"}
            </button>
          }
        >
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Headline tagline
          </label>
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            maxLength={80}
            className="mt-2 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">{tagline.length}/80 characters</p>

          <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Card sub-tagline
          </label>
          <input
            value={shortTag}
            onChange={(e) => setShortTag(e.target.value)}
            maxLength={48}
            className="mt-2 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />

          <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Biography
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={9}
            maxLength={1200}
            className="mt-2 w-full resize-none rounded-md border border-border bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground outline-none focus:border-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">{bio.length}/1200 characters</p>
        </PsychicPanel>

        <div className="space-y-5">
          <PsychicPanel title="Audio bio recording">
            <div className="rounded-md border border-border bg-secondary/50 p-5 text-center">
              <div
                className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
                  recording ? "bg-red-500/10 text-red-600" : "bg-primary/10 text-primary"
                }`}
              >
                <Mic className={`h-7 w-7 ${recording ? "animate-pulse" : ""}`} />
              </div>
              <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
                {fmt(recording ? seconds : (clip ?? 0))}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {recording ? "Recording…" : clip ? "Saved introduction" : "No recording yet"}
              </p>

              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => {
                    if (recording) {
                      setRecording(false);
                      setClip(seconds);
                    } else {
                      setSeconds(0);
                      setPlaying(false);
                      setRecording(true);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
                >
                  {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {recording ? "Stop" : "Record"}
                </button>
                <button
                  disabled={!clip || recording}
                  onClick={() => setPlaying((p) => !p)}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {playing ? "Pause" : "Play"}
                </button>
                <button
                  onClick={() => setClip(58)}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </button>
              </div>

              <div className="mt-5 flex h-10 items-end justify-center gap-[3px]">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-[3px] rounded-full ${recording || playing ? "bg-primary" : "bg-border"}`}
                    style={{ height: `${12 + Math.abs(Math.sin(i * 0.7)) * 26}px` }}
                  />
                ))}
              </div>

              {clip && !recording ? (
                <button
                  onClick={() => setClip(null)}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete recording
                </button>
              ) : null}
            </div>
          </PsychicPanel>

          <PsychicPanel title="Review status">
            <p className="text-sm text-muted-foreground">
              Profile changes are reviewed by MYP compliance before going live. Typical review time is
              under 4 hours.
            </p>
            <span className="mt-3 inline-block rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              Approved · live
            </span>
          </PsychicPanel>
        </div>
      </div>
    </PsychicShell>
  );
}
