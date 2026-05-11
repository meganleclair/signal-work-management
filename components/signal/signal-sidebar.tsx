"use client";

import {
  faCircleCheck,
  faClock,
  faEyeSlash,
  faFilter,
  faInbox,
  faLayerGroup,
  faMoon,
  faSun,
  faUserCheck,
  FaIcon,
  type FaIconDefinition,
} from "@/components/ui/fa-icon";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/lib/use-theme";
import type { SourceType, TriageView } from "@/lib/types";
import { sourceLabel } from "@/components/signal/urgency-styles";
import { cn } from "@/lib/utils";

const VIEWS: { id: TriageView; label: string; icon: FaIconDefinition }[] = [
  { id: "all", label: "All", icon: faLayerGroup },
  { id: "needs_triage", label: "Needs triage", icon: faInbox },
  { id: "assigned", label: "Assigned", icon: faUserCheck },
  { id: "deferred", label: "Deferred", icon: faClock },
  { id: "ignored", label: "Ignored", icon: faEyeSlash },
  { id: "resolved", label: "Resolved", icon: faCircleCheck },
];

type Props = {
  view: TriageView;
  onViewChange: (v: TriageView) => void;
  counts: Record<TriageView, number>;
  sourceTypes: SourceType[];
  /** Which source types are included in the feed (whitelist). */
  allowedSources: SourceType[];
  onToggleSource: (t: SourceType) => void;
};

export function SignalSidebar({
  view,
  onViewChange,
  counts,
  sourceTypes,
  allowedSources,
  onToggleSource,
}: Props) {
  const { dark, toggle } = useTheme();

  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-5">
        {/* Vela logo mark — bold geometric V */}
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 ring-1 ring-foreground/10">
          <svg
            viewBox="0 0 24 24"
            className="size-5 text-primary"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 4 L22 4 L12 21 Z M7 4 L17 4 L12 17 Z"
            />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold tracking-tight">Signal</p>
          <p className="text-[10px] text-muted-foreground tracking-wide">
            by <span className="font-medium text-muted-foreground/90">Vela</span>
          </p>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Nav */}
      <ScrollArea className="min-h-0 flex-1">
        <nav className="flex flex-col gap-0.5 p-2">
          <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/85">
            Views
          </p>
          {VIEWS.map((v) => {
            const active = view === v.id;
            return (
              <Button
                key={v.id}
                type="button"
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "h-9 w-full justify-start gap-2 px-2 font-normal",
                  active && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
                onClick={() => onViewChange(v.id)}
              >
                <FaIcon
                  icon={v.icon}
                  className="size-3.5 text-muted-foreground"
                />
                <span className="flex-1 text-left text-sm">{v.label}</span>
                <span className="tabular-nums text-xs text-muted-foreground">
                  {counts[v.id]}
                </span>
              </Button>
            );
          })}
        </nav>

        <Separator className="my-2 bg-sidebar-border" />

        <div className="px-2 pb-4">
          <p className="flex items-center gap-1.5 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/85">
            <FaIcon icon={faFilter} className="size-3" />
            Source filters
          </p>
          <div className="flex flex-col gap-1">
            {sourceTypes.map((t) => {
              const on = allowedSources.includes(t);
              return (
                <label
                  key={t}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-sidebar-accent/80"
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => onToggleSource(t)}
                    className="size-3.5 rounded border-border accent-primary"
                  />
                  <span>{sourceLabel(t)}</span>
                </label>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      {/* User bar */}
      <Separator className="bg-sidebar-border" />
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-[11px] font-semibold text-primary ring-1 ring-primary/20">
            MF
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-sidebar-foreground">
              Megan Flory
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              Demo workspace
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          title={dark ? "Light mode" : "Dark mode"}
        >
          <FaIcon icon={dark ? faSun : faMoon} className="size-3.5" />
        </button>
      </div>
    </aside>
  );
}
