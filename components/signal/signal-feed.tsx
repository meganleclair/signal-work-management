"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Signal, TriageView, Workspace } from "@/lib/types";
import { URGENCY_ORDER } from "@/lib/types";
import { groupByUrgency, showFeedLensTag } from "@/lib/filter-signals";
import {
  feedSourcePillClass,
  formatUrgencyLabel,
  signalTagLabel,
  sourceLabel,
  urgencyFeedCardChrome,
  urgencyLeftAccent,
  urgencySectionDot,
} from "@/components/signal/urgency-styles";
import { cn } from "@/lib/utils";

export type FeedEmptyInfo =
  | { kind: "search"; query: string }
  | { kind: "sources" }
  | { kind: "view"; view: TriageView; workspaceLabel: string }
  | { kind: "workspace"; workspaceLabel: string }
  | { kind: "generic" };

type Props = {
  workspace: Workspace;
  view: TriageView;
  signals: Signal[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  emptyInfo: FeedEmptyInfo | null;
};

function feedTitle(view: TriageView): string {
  switch (view) {
    case "all": return "All signals";
    case "needs_triage": return "Needs triage";
    case "assigned": return "Assigned";
    case "deferred": return "Deferred";
    case "ignored": return "Ignored";
    case "resolved": return "Resolved";
    default: return "Signals";
  }
}

const MAX_SOURCES_VISIBLE = 2;

function emptyCopy(info: FeedEmptyInfo): { title: string; body: string } {
  switch (info.kind) {
    case "search":
      return {
        title: `No matches for “${info.query}”`,
        body: "Try another keyword or clear search.",
      };
    case "sources":
      return {
        title: "No signals match the source filters",
        body: "Turn a source type back on in the sidebar to see cards again.",
      };
    case "view":
      return viewEmptyMessage(info.view, info.workspaceLabel);
    case "workspace":
      return {
        title: `No signals in ${info.workspaceLabel}`,
        body: "Import a backup or reset the demo data to load the sample set.",
      };
    default:
      return {
        title: "Nothing to show",
        body: "Adjust the sidebar or clear search.",
      };
  }
}

function viewEmptyMessage(
  view: TriageView,
  workspaceLabel: string
): { title: string; body: string } {
  const w = workspaceLabel;
  switch (view) {
    case "all":
      return {
        title: `No signals in ${w}`,
        body: "Try another workspace or import a backup.",
      };
    case "needs_triage":
      return {
        title: `Nothing needs triage in ${w}`,
        body: "You’re caught up here, or try another view.",
      };
    case "assigned":
      return {
        title: `Nothing assigned in ${w}`,
        body: "Assign a card from Needs triage, or pick another view.",
      };
    case "deferred":
      return {
        title: `No deferred items in ${w}`,
        body: "Deferred work will show up here when you defer a card.",
      };
    case "ignored":
      return {
        title: `No ignored signals in ${w}`,
        body: "Ignored items appear here when you choose Ignore on a card.",
      };
    case "resolved":
      return {
        title: `Nothing resolved in ${w} yet`,
        body: "Resolved items land here after you act on them.",
      };
    default:
      return { title: "Nothing here", body: "Try another view or filter." };
  }
}

export function SignalFeed({
  workspace,
  view,
  signals,
  selectedId,
  onSelect,
  emptyInfo,
}: Props) {
  const grouped = groupByUrgency(signals);
  const empty =
    signals.length === 0 && emptyInfo ? emptyCopy(emptyInfo) : null;

  return (
    <ScrollArea className="h-full min-h-0">
      <div className="flex flex-col gap-10 px-6 py-8 pb-20">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {feedTitle(view)}
          </h1>
        </header>

        {empty ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card/35 px-5 py-12 text-center">
            <p className="text-sm font-medium text-foreground">{empty.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{empty.body}</p>
          </div>
        ) : signals.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/60 bg-card/35 px-5 py-12 text-center text-sm text-muted-foreground">
            Nothing to show. Adjust filters or search.
          </p>
        ) : (
          URGENCY_ORDER.map((u) => {
            const list = grouped.get(u) ?? [];
            if (!list.length) return null;
            return (
              <section key={u} className="space-y-5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      urgencySectionDot(u)
                    )}
                    aria-hidden
                  />
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {formatUrgencyLabel(u)}
                  </h2>
                  <span className="text-[11px] text-muted-foreground/80">
                    {list.length}
                  </span>
                </div>
                <div className="flex flex-col gap-5">
                  {list.map((s) => {
                    const active = s.id === selectedId;
                    const showLens = showFeedLensTag(workspace, s.signal_tag);
                    const srcs = s.sources ?? [];
                    const visible = srcs.slice(0, MAX_SOURCES_VISIBLE);
                    const rest = Math.max(0, srcs.length - MAX_SOURCES_VISIBLE);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onSelect(s.id)}
                        className={cn(
                          "text-left rounded-xl transition-colors duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        )}
                      >
                        <Card
                          size="sm"
                          className={cn(
                            "border-0",
                            urgencyFeedCardChrome(s.urgency, active),
                            "shadow-[0_1px_2px_-0.5px_rgba(15,23,42,0.035)]",
                            "dark:shadow-[0_1px_2px_-0.5px_rgba(0,0,0,0.28)]",
                            "transition-[background-color,box-shadow] duration-200",
                            !active &&
                              "ring-0 hover:shadow-[0_1px_3px_-1px_rgba(15,23,42,0.045)] dark:hover:shadow-[0_1px_3px_-1px_rgba(0,0,0,0.32)]",
                            active &&
                              "ring-1 ring-inset ring-foreground/[0.07] dark:ring-foreground/12",
                            urgencyLeftAccent(s.urgency)
                          )}
                        >
                          <CardContent className="space-y-3 px-5 py-5">
                            <div className="space-y-1.5">
                              <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-foreground">
                                {s.title}
                              </h3>
                              <p className="line-clamp-1 text-sm leading-snug text-muted-foreground/72">
                                {s.why_it_matters}
                              </p>
                            </div>

                            <div className="flex flex-col gap-2.5 pt-0.5">
                              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[10px] text-muted-foreground/65">
                                {showLens ? (
                                  <>
                                    <span className="font-medium tracking-wide">
                                      {signalTagLabel(s.signal_tag)}
                                    </span>
                                    <span className="hidden text-border/70 sm:inline">
                                      ·
                                    </span>
                                  </>
                                ) : null}
                                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                                  {visible.map((src, i) => (
                                    <span
                                      key={`${s.id}-src-${i}`}
                                      className={cn(
                                        "inline-flex max-w-[200px] truncate rounded-md px-1.5 py-0.5 font-normal",
                                        feedSourcePillClass()
                                      )}
                                      title={`${sourceLabel(src.type)} · ${src.label}`}
                                    >
                                      <span className="shrink-0 opacity-95">
                                        {sourceLabel(src.type)}
                                      </span>
                                      <span className="ml-1 min-w-0 truncate opacity-75">
                                        · {src.label}
                                      </span>
                                    </span>
                                  ))}
                                  {rest > 0 ? (
                                    <span className="text-[10px] font-medium text-muted-foreground/70">
                                      +{rest} more
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}
