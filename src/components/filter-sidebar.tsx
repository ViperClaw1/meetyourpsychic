import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { advisors, categories, type ReadingType } from "@/data/advisors";
import { AdvisorCard } from "@/components/advisor-card";

export type Filters = {
  query: string;
  categories: string[];
  maxPrice: number;
  readingTypes: ReadingType[];
  onlineOnly: boolean;
};

const defaultFilters: Filters = {
  query: "",
  categories: [],
  maxPrice: 10,
  readingTypes: [],
  onlineOnly: false,
};

type DiscoveryValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
};

const DiscoveryContext = createContext<DiscoveryValue | null>(null);

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const value = useMemo(() => ({ open, setOpen, filters, setFilters }), [open, filters]);
  return (
    <DiscoveryContext.Provider value={value}>
      {children}
      <FilterSidebar />
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery() {
  const ctx = useContext(DiscoveryContext);
  if (!ctx) throw new Error("useDiscovery must be used inside DiscoveryProvider");
  return ctx;
}

export function DiscoveryTrigger({ className }: { className?: string }) {
  const { setOpen } = useDiscovery();
  return (
    <button
      onClick={() => setOpen(true)}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium text-muted-foreground shadow-soft transition-colors hover:border-primary hover:text-foreground"
      }
    >
      <Search className="h-4 w-4" />
      Search advisors
      <SlidersHorizontal className="h-3.5 w-3.5" />
    </button>
  );
}

const readingTypes: ReadingType[] = ["Chat", "Call", "Video"];

function FilterSidebar() {
  const { open, setOpen, filters, setFilters } = useDiscovery();

  const results = advisors.filter((a) => {
    const q = filters.query.trim().toLowerCase();
    if (q && !`${a.name} ${a.headline} ${a.skills.join(" ")}`.toLowerCase().includes(q)) return false;
    if (filters.categories.length && !filters.categories.some((c) => a.skills.includes(c))) return false;
    if (a.pricePerMin > filters.maxPrice) return false;
    if (filters.readingTypes.length && !filters.readingTypes.some((t) => a.readingTypes.includes(t)))
      return false;
    if (filters.onlineOnly && !a.online) return false;
    return true;
  });

  const toggle = <T,>(list: T[], item: T): T[] =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-foreground/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-[380px] flex-col border-r border-border bg-card shadow-lift transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Search and filter advisors"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Find an advisor</h2>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              placeholder="Name, skill, or topic"
              className="w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <FilterGroup label="Category">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const active = filters.categories.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => setFilters({ ...filters, categories: toggle(filters.categories, c) })}
                    className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          <FilterGroup label={`Max price — $${filters.maxPrice.toFixed(2)}/min`}>
            <input
              type="range"
              min={1}
              max={10}
              step={0.25}
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-primary"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>$1.00</span>
              <span>$10.00</span>
            </div>
          </FilterGroup>

          <FilterGroup label="Reading type">
            <div className="grid grid-cols-3 gap-2">
              {readingTypes.map((t) => {
                const active = filters.readingTypes.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() =>
                      setFilters({ ...filters, readingTypes: toggle(filters.readingTypes, t) })
                    }
                    className={`rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                      active
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          <label className="mt-6 flex items-center justify-between rounded-md border border-border px-3.5 py-3">
            <span className="text-sm font-medium text-foreground">Online advisors only</span>
            <input
              type="checkbox"
              checked={filters.onlineOnly}
              onChange={(e) => setFilters({ ...filters, onlineOnly: e.target.checked })}
              className="h-4 w-4 accent-primary"
            />
          </label>

          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            <div className="mt-3 space-y-3">
              {results.map((a) => (
                <AdvisorCard key={a.id} advisor={a} />
              ))}
              {results.length === 0 && (
                <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                  No advisors match these filters yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <footer className="flex items-center gap-3 border-t border-border px-5 py-4">
          <button
            onClick={() => setFilters(defaultFilters)}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Reset
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Show results
          </button>
        </footer>
      </aside>
    </>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}
