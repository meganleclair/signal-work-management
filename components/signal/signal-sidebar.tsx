"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faClock,
  faEyeSlash,
  faFilter,
  faInbox,
  faLayerGroup,
  faSignal,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { SourceType, TriageView } from "@/lib/types";
import { sourceLabel } from "@/components/signal/urgency-styles";
import { cn } from "@/lib/utils";

const VIEWS: { id: TriageView; label: string; icon: typeof faLayerGroup }[] = [
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
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border/50 bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-4 py-5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/5 ring-1 ring-foreground/10">
          <FontAwesomeIcon icon={faSignal} className="size-4 text-primary" />
        </span>
        <div>
          <p className="text-sm font-semibold tracking-tight">Signal</p>
          <p className="text-xs text-muted-foreground">Triage incoming work</p>
        </div>
      </div>
      <Separator />
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
                <FontAwesomeIcon
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
        <Separator className="my-2" />
        <div className="px-2 pb-4">
          <p className="flex items-center gap-1.5 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/85">
            <FontAwesomeIcon icon={faFilter} className="size-3" />
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
    </aside>
  );
}
