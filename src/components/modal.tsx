import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/40 p-4">
      <div
        className={`w-full ${width} overflow-hidden rounded-lg border border-border bg-card shadow-lift`}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-foreground">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="max-h-[65vh] overflow-y-auto px-6 py-6">{children}</div>
        {footer ? (
          <footer className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
