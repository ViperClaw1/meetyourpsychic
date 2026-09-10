import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataPanel, Th, Td, Pill } from "@/components/admin-shell";

export const Route = createFileRoute("/admin/content")({
  head: () => ({
    meta: [
      { title: "Content management — MYP admin" },
      { name: "description", content: "Manage categories, horoscope copy, promos, and site pages." },
      { property: "og:title", content: "Content management — MYP admin" },
      { property: "og:description", content: "Manage categories, horoscope copy, promos, and site pages." },
    ],
  }),
  component: Content;
});

const PAGES = [
  ["Homepage hero", "Landing", "2026-09-04", "published"],
  ["How it works", "Marketing", "2026-08-22", "published"],
  ["Refund policy", "Legal", "2026-07-15", "published"],
  ["New-member offer banner", "Promo", "2026-09-09", "draft"],
  ["Daily horoscope template", "Automation", "2026-09-10", "published"],
];

const CATEGORIES = [
  ["Tarot", 412, "featured"],
  ["Love & relationships", 388, "featured"],
  ["Career & money", 254, "live"],
  ["Mediumship", 176, "live"],
  ["Dream analysis", 98, "hidden"],
];

function Content() {
  const [tab, setTab] = useState<"pages" | "categories">("pages");

  return (
    <AdminShell title="Content management" subtitle="Site copy, categories, and automated horoscope templates.">
      <div className="mb-5 inline-flex rounded-md border border-border bg-card p-1 shadow-soft">
        {(["pages", "categories"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-[5px] px-4 py-2 text-[13px] font-semibold capitalize transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "pages" ? (
        <DataPanel title="Pages & blocks" meta={`${PAGES.length} entries`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-secondary/60">
                <tr>
                  <Th>Title</Th>
                  <Th>Type</Th>
                  <Th>Last updated</Th>
                  <Th>Status</Th>
                  <Th right>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PAGES.map((p) => (
                  <tr key={p[0]} className="hover:bg-secondary/40">
                    <Td strong>{p[0]}</Td>
                    <Td>{p[1]}</Td>
                    <Td>{p[2]}</Td>
                    <td className="px-4 py-2.5">
                      <Pill tone={p[3] === "published" ? "green" : "amber"}>{p[3]}</Pill>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataPanel>
      ) : (
        <DataPanel title="Categories" meta={`${CATEGORIES.length} categories`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-secondary/60">
                <tr>
                  <Th>Category</Th>
                  <Th right>Advisors</Th>
                  <Th>Placement</Th>
                  <Th right>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CATEGORIES.map((c) => (
                  <tr key={String(c[0])} className="hover:bg-secondary/40">
                    <Td strong>{c[0]}</Td>
                    <Td right>{c[1]}</Td>
                    <td className="px-4 py-2.5">
                      <Pill tone={c[2] === "featured" ? "purple" : c[2] === "hidden" ? "gray" : "green"}>
                        {c[2]}
                      </Pill>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataPanel>
      )}
    </AdminShell>
  );
}
