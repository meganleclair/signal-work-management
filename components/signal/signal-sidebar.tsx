"use client";

import {
  faCircleCheck,
  faClock,
  faEyeSlash,
  faInbox,
  faLayerGroup,
  faMoon,
  faSignal,
  faSun,
  faUserCheck,
  FaIcon,
  type FaIconDefinition,
} from "@/components/ui/fa-icon";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/lib/use-theme";
import type { SourceType, TriageView } from "@/lib/types";
import { sourceLabel } from "@/components/signal/urgency-styles";
import { cn } from "@/lib/utils";

type ViewDef = {
  id: TriageView;
  label: string;
  icon: FaIconDefinition;
  iconClass: string;
  activeIconClass: string;
};

const VIEWS: ViewDef[] = [
  {
    id: "all",
    label: "All",
    icon: faLayerGroup,
    iconClass: "text-muted-foreground/60",
    activeIconClass: "text-foreground/70",
  },
  {
    id: "needs_triage",
    label: "Needs triage",
    icon: faInbox,
    iconClass: "text-amber-500/70",
    activeIconClass: "text-amber-500",
  },
  {
    id: "assigned",
    label: "Assigned",
    icon: faUserCheck,
    iconClass: "text-blue-400/70",
    activeIconClass: "text-blue-500",
  },
  {
    id: "deferred",
    label: "Deferred",
    icon: faClock,
    iconClass: "text-muted-foreground/50",
    activeIconClass: "text-muted-foreground/80",
  },
  {
    id: "ignored",
    label: "Ignored",
    icon: faEyeSlash,
    iconClass: "text-muted-foreground/40",
    activeIconClass: "text-muted-foreground/65",
  },
  {
    id: "resolved",
    label: "Resolved",
    icon: faCircleCheck,
    iconClass: "text-emerald-500/60",
    activeIconClass: "text-emerald-500",
  },
];

type CountBadgeProps = { view: TriageView; count: number; active: boolean };

function CountBadge({ view, count, active }: CountBadgeProps) {
  if (count === 0) {
    return (
      <span className="text-[11px] tabular-nums text-muted-foreground/35">
        —
      </span>
    );
  }
  if (view === "needs_triage") {
    return (
      <span
        className={cn(
          "inline-flex min-w-[1.375rem] items-center justify-center rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums",
          active
            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
            : "bg-amber-500/12 text-amber-600/80 dark:text-amber-500/80"
        )}
      >
        {count}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex min-w-[1.375rem] items-center justify-center rounded-full px-1.5 py-px text-[10px] tabular-nums",
        active
          ? "bg-foreground/8 font-medium text-foreground/70"
          : "text-muted-foreground/45"
      )}
    >
      {count}
    </span>
  );
}

type Props = {
  view: TriageView;
  onViewChange: (v: TriageView) => void;
  counts: Record<TriageView, number>;
  sourceTypes: SourceType[];
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
    <aside className="hidden h-full w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-[1.125rem]">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-foreground/[0.08]">
          <FaIcon icon={faSignal} className="size-3.5 text-primary" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold tracking-tight">Signal</p>
          <p className="text-[11px] text-muted-foreground/60">Triage incoming work</p>
        </div>
      </div>

      {/* Hairline */}
      <div className="h-px bg-sidebar-border" />

      {/* Nav */}
      <ScrollArea className="min-h-0 flex-1">
        <nav className="flex flex-col gap-px p-2 pt-3">
          <p className="mb-1 px-2.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/45">
            Views
          </p>
          {VIEWS.map((v) => {
            const active = view === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onViewChange(v.id)}
                className={cn(
                  "group relative flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm transition-colors duration-150",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )}
              >
                {/* Left accent bar */}
                <span
                  className={cn(
                    "absolute inset-y-1.5 left-0 w-[2.5px] rounded-r-full transition-opacity duration-150",
                    active ? "opacity-100" : "opacity-0",
                    v.id === "needs_triage" && "bg-amber-500",
                    v.id === "assigned" && "bg-blue-500",
                    v.id === "resolved" && "bg-emerald-500",
                    v.id === "all" && "bg-foreground/30",
                    v.id === "deferred" && "bg-foreground/20",
                    v.id === "ignored" && "bg-foreground/15",
                  )}
                  aria-hidden
                />
                <FaIcon
                  icon={v.icon}
                  className={cn(
                    "size-3.5 shrink-0 transition-colors duration-150",
                    active ? v.activeIconClass : v.iconClass
                  )}
                />
                <span className={cn("flex-1 text-[13px] leading-none", active && "font-medium")}>
                  {v.label}
                </span>
                <CountBadge view={v.id} count={counts[v.id]} active={active} />
              </button>
            );
          })}
        </nav>

        {/* Source filter chips */}
        <div className="px-3 pb-4 pt-4">
          <p className="mb-2.5 px-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/45">
            Sources
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sourceTypes.map((t) => {
              const on = allowedSources.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onToggleSource(t)}
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-[3px] text-[11px] font-medium transition-all duration-150",
                    on
                      ? "bg-foreground/8 text-foreground/80 ring-1 ring-foreground/12 hover:bg-foreground/12"
                      : "bg-transparent text-muted-foreground/40 ring-1 ring-border/50 hover:text-muted-foreground/60"
                  )}
                >
                  {sourceLabel(t)}
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      {/* User bar */}
      <div className="h-px bg-sidebar-border" />
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/15">
            <svg
              viewBox="0 0 24 24"
              className="size-3 text-primary"
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
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-sidebar-foreground">
              Megan Flory
            </p>
            <p className="truncate text-[10px] text-muted-foreground/55">
              Vela
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          className="shrink-0 rounded-lg p-1.5 text-muted-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          title={dark ? "Light mode" : "Dark mode"}
        >
          <FaIcon icon={dark ? faSun : faMoon} className="size-3" />
        </button>
      </div>
    </aside>
  );
}
