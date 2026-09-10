import { useState } from "react";
import { Clock, Users } from "lucide-react";
import { Modal } from "@/components/modal";
import type { Advisor } from "@/data/advisors";

const waitOptions = [
  { label: "15 minutes", minutes: 15 },
  { label: "1 hour", minutes: 60 },
  { label: "24 hours", minutes: 1440 },
];

export function WaitlistModal({
  advisor,
  open,
  onClose,
}: {
  advisor: Advisor;
  open: boolean;
  onClose: () => void;
}) {
  const [minutes, setMinutes] = useState(60);
  const [joined, setJoined] = useState(false);

  const queue = 3;
  const estimate = Math.round(queue * 14 + (minutes >= 1440 ? 0 : 4));
  const willBeSeen = estimate <= minutes;

  const close = () => {
    onClose();
    setTimeout(() => setJoined(false), 250);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={joined ? "You're on the waitlist" : `${advisor.name} is busy right now`}
      subtitle={
        joined
          ? "We'll notify you by push and email the moment your turn comes up."
          : "Join the queue and we'll hold your place."
      }
      footer={
        joined ? (
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
              Not now
            </button>
            <button
              onClick={() => setJoined(true)}
              className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Join Waitlist
            </button>
          </>
        )
      }
    >
      {joined ? (
        <div className="space-y-3">
          <Stat icon={<Users className="h-4 w-4 text-primary" />} label="Your position" value="#4 in queue" />
          <Stat
            icon={<Clock className="h-4 w-4 text-primary" />}
            label="Estimated wait"
            value={`~${estimate} minutes`}
          />
          <Stat
            icon={<Clock className="h-4 w-4 text-primary" />}
            label="Willing to wait"
            value={waitOptions.find((o) => o.minutes === minutes)?.label ?? ""}
          />
        </div>
      ) : (
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat
              icon={<Users className="h-4 w-4 text-primary" />}
              label="People ahead of you"
              value={`${queue}`}
            />
            <Stat
              icon={<Clock className="h-4 w-4 text-primary" />}
              label="Estimated wait"
              value={`~${estimate} min`}
            />
          </div>

          <label className="mt-6 block">
            <span className="text-sm font-medium text-foreground">Willing to wait</span>
            <select
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {waitOptions.map((o) => (
                <option key={o.minutes} value={o.minutes}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <div
            className={`mt-5 rounded-md border p-3.5 text-xs leading-relaxed ${
              willBeSeen
                ? "border-online/30 bg-online/10 text-foreground"
                : "border-badge-rising/30 bg-badge-rising-soft text-foreground"
            }`}
          >
            {willBeSeen
              ? `Good news — at the current pace you should be connected within your ${
                  waitOptions.find((o) => o.minutes === minutes)?.label
                } window.`
              : `The queue is likely longer than ${
                  waitOptions.find((o) => o.minutes === minutes)?.label
                }. We'll drop you from the waitlist automatically if your window passes.`}
          </div>
        </div>
      )}
    </Modal>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border px-4 py-3">
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1.5 text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
