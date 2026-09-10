import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataPanel, TableToolbar, Th, Td, Pill, exportCsv } from "@/components/admin-shell";
import { Modal } from "@/components/modal";

export const Route = createFileRoute("/admin/content")({
  head: () => ({
    meta: [
      { title: "Blog & content manager — MYP admin" },
      { name: "description", content: "Review, edit, approve, or reject articles submitted by advisors." },
      { property: "og:title", content: "Blog & content manager — MYP admin" },
      { property: "og:description", content: "Review, edit, approve, or reject articles submitted by advisors." },
    ],
  }),
  component: ContentManager,
});

type Article = {
  id: string;
  title: string;
  author: string;
  category: string;
  words: number;
  submitted: string;
  updated: string;
  seo: number;
  status: "submitted" | "in review" | "published" | "rejected" | "draft";
  body: string;
  notes: string;
};

const BASE: Article[] = [
  {
    id: "A-3011",
    title: "Reading reversals without fear",
    author: "P-1042 Selene Marchetti",
    category: "Tarot",
    words: 1240,
    submitted: "2026-09-09",
    updated: "2026-09-10",
    seo: 82,
    status: "submitted",
    body: "Reversed cards are not punishments. They describe energy that is blocked, internalised, or waiting. In this piece I walk through the five reversals clients fear most and what each one actually asks of you…",
    notes: "",
  },
  {
    id: "A-3012",
    title: "Mercury retrograde: what it does not mean",
    author: "P-1088 Orion Vance",
    category: "Astrology",
    words: 980,
    submitted: "2026-09-08",
    updated: "2026-09-08",
    seo: 74,
    status: "in review",
    body: "Every three months the internet declares chaos. Retrograde motion is an optical effect, but the practical advice around it — slow down, re-read contracts — still holds…",
    notes: "Tighten the intro, add an internal link to /advisor listings.",
  },
  {
    id: "A-3013",
    title: "Signs a loved one is reaching out",
    author: "P-1121 Juniper Blake",
    category: "Mediumship",
    words: 1610,
    submitted: "2026-09-06",
    updated: "2026-09-07",
    seo: 91,
    status: "published",
    body: "Grief has its own grammar. These are the moments clients most often describe to me as contact, and how to sit with them without forcing meaning…",
    notes: "Approved — strong organic traffic in first 48h.",
  },
  {
    id: "A-3014",
    title: "Guaranteed love spell results in 7 days",
    author: "P-1204 Tobias Lund",
    category: "Love",
    words: 640,
    submitted: "2026-09-05",
    updated: "2026-09-05",
    seo: 38,
    status: "rejected",
    body: "Pay for my premium ritual package and I will guarantee your ex returns within one week, no exceptions…",
    notes: "Rejected: outcome guarantees violate advertising policy.",
  },
  {
    id: "A-3015",
    title: "Journaling prompts for a new moon",
    author: "P-1190 Amara Diallo",
    category: "Ritual",
    words: 820,
    submitted: "2026-09-10",
    updated: "2026-09-10",
    seo: 66,
    status: "submitted",
    body: "A new moon is a blank page. Here are twelve prompts, one per sign, to help you name what you are actually starting…",
    notes: "",
  },
];

const REJECT_REASONS = [
  "Outcome guarantees or medical claims",
  "Off-platform contact details",
  "Plagiarised or duplicate content",
  "Below editorial quality bar",
  "Wrong category or off-topic",
];

function ContentManager() {
  const [rows, setRows] = useState(BASE);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<Article | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftNotes, setDraftNotes] = useState("");
  const [rejectFor, setRejectFor] = useState<Article | null>(null);
  const [reason, setReason] = useState(REJECT_REASONS[0]!);

  const filtered = rows.filter(
    (a) =>
      (status === "all" || a.status === status) &&
      (a.title + a.author + a.category + a.id).toLowerCase().includes(query.toLowerCase()),
  );

  const setStatusFor = (id: string, s: Article["status"], notes?: string) =>
    setRows((rs) => rs.map((a) => (a.id === id ? { ...a, status: s, notes: notes ?? a.notes } : a)));

  return (
    <AdminShell
      title="Blog & content manager"
      subtitle="Editorial workflow for articles submitted by advisors."
    >
      <div className="mb-4 grid gap-4 sm:grid-cols-4">
        <Metric label="Awaiting review" value={String(rows.filter((a) => a.status === "submitted").length)} />
        <Metric label="In review" value={String(rows.filter((a) => a.status === "in review").length)} />
        <Metric label="Published" value={String(rows.filter((a) => a.status === "published").length)} />
        <Metric label="Rejected" value={String(rows.filter((a) => a.status === "rejected").length)} />
      </div>

      <DataPanel title="Article submissions" meta={`${filtered.length} of ${rows.length} articles`}>
        <TableToolbar
          query={query}
          onQuery={setQuery}
          placeholder="Search by title, author, or category"
          onExport={() =>
            exportCsv(
              "myp-articles.csv",
              ["ID", "Title", "Author", "Category", "Words", "Submitted", "Updated", "SEO score", "Status", "Editor notes"],
              filtered.map((a) => [a.id, a.title, a.author, a.category, a.words, a.submitted, a.updated, a.seo, a.status, a.notes]),
            )
          }
          right={
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary"
            >
              {["all", "submitted", "in review", "published", "rejected", "draft"].map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All statuses" : s}
                </option>
              ))}
            </select>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px]">
            <thead className="bg-secondary/60">
              <tr>
                <Th>ID</Th>
                <Th>Title</Th>
                <Th>Author</Th>
                <Th>Category</Th>
                <Th right>Words</Th>
                <Th>Submitted</Th>
                <Th right>SEO</Th>
                <Th>Status</Th>
                <Th>Editor notes</Th>
                <Th right>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-secondary/40">
                  <Td strong>{a.id}</Td>
                  <Td strong>{a.title}</Td>
                  <Td>{a.author}</Td>
                  <Td>{a.category}</Td>
                  <Td right>{a.words.toLocaleString()}</Td>
                  <Td>{a.submitted}</Td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right">
                    <span className={`text-[13px] font-semibold ${a.seo >= 80 ? "text-emerald-600" : a.seo >= 60 ? "text-amber-600" : "text-red-600"}`}>
                      {a.seo}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <Pill
                      tone={
                        a.status === "published"
                          ? "green"
                          : a.status === "rejected"
                            ? "red"
                            : a.status === "in review"
                              ? "amber"
                              : a.status === "draft"
                                ? "gray"
                                : "purple"
                      }
                    >
                      {a.status}
                    </Pill>
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-2.5 text-[13px] text-muted-foreground">
                    {a.notes || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right">
                    <div className="inline-flex gap-1.5">
                      <button
                        onClick={() => {
                          setEditing(a);
                          setDraftTitle(a.title);
                          setDraftBody(a.body);
                          setDraftNotes(a.notes);
                        }}
                        className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        Review / edit
                      </button>
                      <button
                        disabled={a.status === "published"}
                        onClick={() => setStatusFor(a.id, "published", "Approved and live")}
                        className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        disabled={a.status === "rejected"}
                        onClick={() => {
                          setRejectFor(a);
                          setReason(REJECT_REASONS[0]!);
                        }}
                        className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataPanel>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        width="max-w-3xl"
        title="Review article"
        subtitle={editing ? `${editing.id} · ${editing.author}` : ""}
        footer={
          <>
            <button
              onClick={() => setEditing(null)}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Close
            </button>
            <button
              onClick={() => {
                if (editing) {
                  setRows((rs) =>
                    rs.map((a) =>
                      a.id === editing.id
                        ? { ...a, title: draftTitle, body: draftBody, notes: draftNotes, status: "in review", updated: "2026-09-10" }
                        : a,
                    ),
                  );
                }
                setEditing(null);
              }}
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Save edits
            </button>
            <button
              onClick={() => {
                if (editing) setStatusFor(editing.id, "published", draftNotes || "Approved and live");
                setEditing(null);
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
            >
              Approve & publish
            </button>
          </>
        }
      >
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</label>
        <input
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          className="mt-2 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground outline-none focus:border-primary"
        />
        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Body</label>
        <textarea
          value={draftBody}
          onChange={(e) => setDraftBody(e.target.value)}
          rows={10}
          className="mt-2 w-full resize-none rounded-md border border-border bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground outline-none focus:border-primary"
        />
        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Editor notes (visible to the advisor)
        </label>
        <textarea
          value={draftNotes}
          onChange={(e) => setDraftNotes(e.target.value)}
          rows={3}
          className="mt-2 w-full resize-none rounded-md border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none focus:border-primary"
        />
      </Modal>

      <Modal
        open={!!rejectFor}
        onClose={() => setRejectFor(null)}
        title="Reject article"
        subtitle={rejectFor ? `${rejectFor.title} · ${rejectFor.author}` : ""}
        footer={
          <>
            <button
              onClick={() => setRejectFor(null)}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (rejectFor) setStatusFor(rejectFor.id, "rejected", `Rejected: ${reason}`);
                setRejectFor(null);
              }}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-red-700"
            >
              Reject article
            </button>
          </>
        }
      >
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reason</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-2 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
        >
          {REJECT_REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <p className="mt-3 text-xs text-muted-foreground">
          The advisor is notified with this reason and can resubmit after edits.
        </p>
      </Modal>
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-soft">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  );
}
