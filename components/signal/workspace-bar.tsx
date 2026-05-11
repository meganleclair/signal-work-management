"use client";

import { WORKSPACES, type Workspace } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  value: Workspace;
  onChange: (w: Workspace) => void;
};

export function WorkspaceBar({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1 border-b border-sidebar-border bg-sidebar px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/85">
          Workspace
        </p>
      </div>
      <div
        className="flex flex-wrap gap-1 rounded-xl bg-sidebar-accent/60 p-1 ring-1 ring-sidebar-border"
        role="tablist"
        aria-label="Workspace"
      >
        {WORKSPACES.map((w) => {
          const active = value === w.id;
          return (
            <button
              key={w.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(w.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm transition-colors",
                active
                  ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-sidebar-border"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              {w.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
