import { useEffect, useState, type ComponentType } from "react";
import {
  Check,
  Loader2,
  CloudRain,
  Sun,
  Anchor,
  Search,
  HeartCrack,
  Sparkles,
  Heart,
  Briefcase,
  Coins,
  Users,
  Compass,
  Feather,
  Layers,
  Moon,
  Hash,
  CloudMoon,
  HandHeart,
} from "lucide-react";

const optionIcons: Record<string, ComponentType<{ className?: string }>> = {
  Anxious: CloudRain,
  Hopeful: Sun,
  Stuck: Anchor,
  Curious: Search,
  Heartbroken: HeartCrack,
  "Ready for change": Sparkles,
  "Love & Relationships": Heart,
  Career: Briefcase,
  Money: Coins,
  Family: Users,
  "Life path": Compass,
  Grief: Feather,
  Tarot: Layers,
  Astrology: Moon,
  Mediumship: Sparkles,
  Numerology: Hash,
  "Dream Analysis": CloudMoon,
  "Spiritual Healing": HandHeart,
};

const STORAGE_KEY = "myp.quiz.completed";

const feelings = ["Anxious", "Hopeful", "Stuck", "Curious", "Heartbroken", "Ready for change"];
const topics = ["Love & Relationships", "Career", "Money", "Family", "Life path", "Grief"];
const skills = ["Tarot", "Astrology", "Mediumship", "Numerology", "Dream Analysis", "Spiritual Healing"];

const steps = ["Feelings", "Topics", "Skills", "About you", "Syncing"];

export function PreMatchQuiz({
  alwaysOpen = false,
  onFinish,
}: {
  alwaysOpen?: boolean;
  onFinish?: () => void;
} = {}) {
  const [visible, setVisible] = useState(alwaysOpen);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Record<number, string[]>>({ 0: [], 1: [], 2: [] });
  const [profile, setProfile] = useState({ name: "", birthdate: "", pronouns: "" });
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (alwaysOpen) return;
    if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    const open = () => {
      setStep(0);
      setVisible(true);
    };
    window.addEventListener("myp:open-quiz", open);
    return () => window.removeEventListener("myp:open-quiz", open);
  }, [alwaysOpen]);


  useEffect(() => {
    if (step !== 4) return;
    setSynced(false);
    const t = setTimeout(() => setSynced(true), 2400);
    return () => clearTimeout(t);
  }, [step]);

  if (!visible) return null;

  const toggle = (group: number, value: string) =>
    setPicked((prev) => {
      const list = prev[group] ?? [];
      return {
        ...prev,
        [group]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      };
    });

  const finish = () => {
    window.localStorage.setItem(STORAGE_KEY, "1");
    if (onFinish) {
      onFinish();
      return;
    }
    setVisible(false);
  };

  const canContinue =
    step === 3
      ? profile.name.trim().length > 0
      : step === 4
        ? synced
        : (picked[step]?.length ?? 0) > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-card shadow-lift">
        {/* Progress */}
        <div className="border-b border-border px-6 py-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Pre-match quiz · Step {step + 1} of 5
            </p>
            <button
              onClick={finish}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Skip
            </button>
          </div>
          <div className="mt-4 flex gap-1.5">
            {steps.map((label, i) => (
              <div key={label} className="flex-1">
                <div
                  className={`h-1 rounded-md transition-colors ${
                    i <= step ? "bg-primary" : "bg-border"
                  }`}
                />
                <p
                  className={`mt-2 hidden text-[11px] font-medium sm:block ${
                    i <= step ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-7">
          {step === 0 && (
            <ChoiceStep
              title="How are you feeling right now?"
              subtitle="Pick everything that resonates — this shapes your matches."
              options={feelings}
              selected={picked[0] ?? []}
              onToggle={(v) => toggle(0, v)}
            />
          )}
          {step === 1 && (
            <ChoiceStep
              title="What would you like guidance on?"
              subtitle="Choose one or more topics for your first reading."
              options={topics}
              selected={picked[1] ?? []}
              onToggle={(v) => toggle(1, v)}
            />
          )}
          {step === 2 && (
            <ChoiceStep
              title="Which reading styles appeal to you?"
              subtitle="We'll prioritise advisors trained in these practices."
              options={skills}
              selected={picked[2] ?? []}
              onToggle={(v) => toggle(2, v)}
            />
          )}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-foreground">A little about you</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Advisors use this to prepare before your session.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <QuizField
                  label="First name"
                  value={profile.name}
                  placeholder="Alex"
                  onChange={(v) => setProfile({ ...profile, name: v })}
                />
                <QuizField
                  label="Pronouns (optional)"
                  value={profile.pronouns}
                  placeholder="she/her"
                  onChange={(v) => setProfile({ ...profile, pronouns: v })}
                />
                <QuizField
                  label="Date of birth"
                  value={profile.birthdate}
                  type="date"
                  placeholder=""
                  onChange={(v) => setProfile({ ...profile, birthdate: v })}
                />
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="flex flex-col items-center py-6 text-center">
              {synced ? (
                <span className="grid h-16 w-16 place-items-center rounded-lg bg-primary-soft">
                  <Check className="h-8 w-8 text-primary" />
                </span>
              ) : (
                <span className="grid h-16 w-16 place-items-center rounded-lg bg-primary-soft">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </span>
              )}
              <h2 className="mt-5 text-xl font-bold text-foreground">
                {synced ? "Your matches are ready" : "Syncing your profile with Recombee…"}
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {synced
                  ? "We found advisors aligned with your answers. Smart Matches are now personalised on your dashboard."
                  : "Building your recommendation vector from feelings, topics, and preferred practices."}
              </p>
              <div className="mt-6 w-full max-w-sm space-y-2 text-left">
                {["Profile signals", "Topic affinity", "Advisor ranking"].map((s, i) => (
                  <div
                    key={s}
                    className="flex items-center justify-between rounded-md border border-border px-3.5 py-2.5 text-sm"
                  >
                    <span className="text-foreground">{s}</span>
                    <span className={synced ? "text-primary" : "text-muted-foreground"}>
                      {synced ? "Done" : i === 0 ? "Processing" : "Queued"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between border-t border-border px-6 py-4">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || step === 4}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            Back
          </button>
          <button
            onClick={() => (step === 4 ? finish() : setStep((s) => s + 1))}
            disabled={!canContinue}
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step === 4 ? "See my matches" : "Continue"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function ChoiceStep({
  title,
  subtitle,
  options,
  selected = [],
  onToggle,
}: {
  title: string;
  subtitle: string;
  options: string[];
  selected?: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-3">
        {options.map((o) => {
          const active = selected.includes(o);
          const Icon = optionIcons[o] ?? Sparkles;
          return (
            <button
              key={o}
              onClick={() => onToggle(o)}
              className={`group relative flex aspect-square flex-col items-center justify-center gap-2.5 rounded-xl border p-3 text-center text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                active
                  ? "border-primary bg-primary-soft text-primary shadow-lift"
                  : "border-border bg-card text-foreground shadow-soft hover:border-primary/50 hover:shadow-lift"
              }`}
            >
              {active && (
                <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </span>
              )}
              <span
                className={`grid h-12 w-12 place-items-center rounded-full transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"
                }`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <span className="leading-tight">{o}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuizField({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
