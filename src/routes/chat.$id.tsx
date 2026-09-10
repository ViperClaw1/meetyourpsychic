import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Send, ShieldAlert, ShieldCheck } from "lucide-react";
import { getAdvisor } from "@/data/advisors";

export const Route = createFileRoute("/chat/$id")({
  loader: ({ params }) => {
    const advisor = getAdvisor(params.id);
    if (!advisor) throw notFound();
    return { advisorId: advisor.id, name: advisor.name };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Advisor";
    const title = `Live chat with ${name} · MeetYourPsychic`;
    const description = `Private, moderated live chat reading with ${name} on MeetYourPsychic.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ChatRoom,
});

const LIMIT = 1000;

type Msg = {
  id: number;
  from: "me" | "them" | "system";
  text: string;
  time: string;
  blocked?: boolean;
};

const piiPatterns: { label: string; re: RegExp }[] = [
  { label: "phone number", re: /(\+?\d[\d\s().-]{7,}\d)/ },
  { label: "email address", re: /[\w.+-]+@[\w-]+\.[\w.]{2,}/i },
  { label: "external link", re: /(https?:\/\/|www\.)\S+/i },
];

function now() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function ChatRoom() {
  const { id } = Route.useParams();
  const advisor = getAdvisor(id)!;
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      from: "system",
      text: "Session started. Messages are screened by Sightengine moderation. Never share payment details or contact information.",
      time: now(),
    },
    {
      id: 2,
      from: "them",
      text: `Hi, I'm ${advisor.name.split(" ")[0]}. Take a breath — tell me what's been sitting on your mind lately.`,
      time: now(),
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const over = text.length > LIMIT;
  const near = text.length > LIMIT * 0.9;

  function send() {
    const value = text.trim();
    if (!value || over) return;

    const hit = piiPatterns.find((p) => p.re.test(value));
    if (hit) {
      setAlert(hit.label);
      setMessages((m) => [
        ...m,
        { id: Date.now(), from: "me", text: value, time: now(), blocked: true },
      ]);
      setText("");
      return;
    }

    setAlert(null);
    setMessages((m) => [...m, { id: Date.now(), from: "me", text: value, time: now() }]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "them",
          text: "I'm sitting with that. The card that keeps surfacing is about timing — you already know the answer, you're waiting for permission. Let's look at the next six weeks.",
          time: now(),
        },
      ]);
    }, 2600);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6">
      <header className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-soft">
        <Link
          to="/advisor/$id"
          params={{ id }}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Back to profile"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <img
          src={advisor.photo}
          alt={advisor.name}
          className="h-10 w-10 rounded-md border border-border object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{advisor.name}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-online" />
            {typing ? "typing…" : "Online · in session"}
          </p>
        </div>
        <span className="ml-auto rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-foreground">
          ${advisor.pricePerMin.toFixed(2)}/min
        </span>
      </header>

      <div className="mt-4 flex-1 space-y-4 overflow-y-auto rounded-lg border border-border bg-secondary/40 p-4">
        {messages.map((m) =>
          m.from === "system" ? (
            <p
              key={m.id}
              className="mx-auto flex max-w-md items-start gap-2 rounded-md border border-border bg-card px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground"
            >
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-online" />
              {m.text}
            </p>
          ) : (
            <div
              key={m.id}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[78%]">
                <div
                  className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${
                    m.blocked
                      ? "border-destructive/40 bg-destructive/8 text-muted-foreground line-through"
                      : m.from === "me"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground"
                  }`}
                >
                  {m.text}
                </div>
                <p
                  className={`mt-1 text-[11px] text-muted-foreground ${
                    m.from === "me" ? "text-right" : ""
                  }`}
                >
                  {m.blocked ? "Blocked by moderation" : m.time}
                </p>
              </div>
            </div>
          ),
        )}

        {typing ? (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-3">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  style={{ animationDelay: `${d}ms` }}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                />
              ))}
              <span className="ml-1 text-xs text-muted-foreground">
                {advisor.name.split(" ")[0]} is typing…
              </span>
            </div>
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      {alert ? (
        <div className="mt-4 flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/8 p-3.5">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-destructive">
              Sightengine moderation · message blocked
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              We detected a {alert} in your message. Sharing personal contact details is not allowed
              and puts your purchase protection at risk. Please rewrite and send again.
            </p>
          </div>
          <button
            onClick={() => setAlert(null)}
            className="ml-auto shrink-0 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="mt-4 rounded-lg border border-border bg-card p-3 shadow-soft">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, LIMIT + 60))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={3}
          placeholder="Type your message… (contact details are automatically blocked)"
          className="w-full resize-none bg-transparent px-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <div className="mt-2 flex items-center justify-between">
          <span
            className={`font-mono text-xs tabular-nums ${
              over ? "font-bold text-destructive" : near ? "text-badge-rising" : "text-muted-foreground"
            }`}
          >
            {text.length} / {LIMIT}
          </span>
          <button
            onClick={send}
            disabled={!text.trim() || over}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
