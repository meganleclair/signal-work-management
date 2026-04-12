import type { SignalTag, SourceType, Urgency, Workspace } from "@/lib/types";

export function urgencyClasses(u: Urgency): string {
  switch (u) {
    case "critical":
      return "border-rose-200/80 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-100";
    case "high":
      return "border-amber-200/80 bg-amber-50 text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/35 dark:text-amber-50";
    case "medium":
      return "border-sky-200/80 bg-sky-50 text-sky-950 dark:border-sky-900/40 dark:bg-sky-950/35 dark:text-sky-50";
    case "low":
    default:
      return "border-border bg-muted/50 text-muted-foreground";
  }
}

export function sourceClasses(type: SourceType): string {
  switch (type) {
    case "slack":
      return "border-violet-200/80 bg-violet-50 text-violet-900 dark:border-violet-900/40 dark:bg-violet-950/40 dark:text-violet-100";
    case "email":
      return "border-blue-200/80 bg-blue-50 text-blue-950 dark:border-blue-900/40 dark:bg-blue-950/35 dark:text-blue-50";
    case "calendar":
      return "border-emerald-200/80 bg-emerald-50 text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-950/35 dark:text-emerald-50";
    case "doc":
      return "border-orange-200/80 bg-orange-50 text-orange-950 dark:border-orange-900/40 dark:bg-orange-950/35 dark:text-orange-50";
    case "chat":
      return "border-fuchsia-200/80 bg-fuchsia-50 text-fuchsia-950 dark:border-fuchsia-900/40 dark:bg-fuchsia-950/35 dark:text-fuchsia-50";
    case "form":
    default:
      return "border-teal-200/80 bg-teal-50 text-teal-950 dark:border-teal-900/40 dark:bg-teal-950/35 dark:text-teal-50";
  }
}

/**
 * Left stripe — primary at-a-glance urgency cue.
 * Critical: wider + deeper rose (clearly stronger than High).
 */
export function urgencyLeftAccent(u: Urgency): string {
  switch (u) {
    case "critical":
      return "border-l-[4px] border-l-rose-600";
    case "high":
      return "border-l-[3px] border-l-amber-400/90";
    case "medium":
      return "border-l-[3px] border-l-sky-400/80";
    case "low":
    default:
      return "border-l-[3px] border-l-muted-foreground/28";
  }
}

/** Feed card fill: light tints — left accent carries urgency; backgrounds stay breathable. */
export function urgencyFeedCardChrome(u: Urgency, active: boolean): string {
  switch (u) {
    case "critical":
      if (active) {
        return "bg-rose-50/55 dark:bg-rose-950/26";
      }
      return "bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/60 dark:hover:bg-rose-950/30";
    case "high":
      if (active) {
        return "bg-amber-50/30 dark:bg-amber-950/14";
      }
      return "bg-amber-50/18 dark:bg-amber-950/10 hover:bg-amber-50/32 dark:hover:bg-amber-950/15";
    case "medium":
      if (active) {
        return "bg-muted/28";
      }
      return "bg-card/50 hover:bg-muted/25";
    case "low":
    default:
      if (active) {
        return "bg-muted/28";
      }
      return "bg-card/50 hover:bg-muted/25";
  }
}

/** Small dot next to section label — reinforces stripe colors without reading text. */
export function urgencySectionDot(u: Urgency): string {
  switch (u) {
    case "critical":
      return "bg-rose-600";
    case "high":
      return "bg-amber-400";
    case "medium":
      return "bg-sky-500/85";
    case "low":
    default:
      return "bg-muted-foreground/35";
  }
}

/** Tertiary source chips — quiet vs title and urgency stripe. */
export function feedSourcePillClass(): string {
  return "border-0 bg-muted/22 text-muted-foreground/75 text-[10px]";
}

export function signalTagLabel(tag: SignalTag): string {
  switch (tag) {
    case "legal":
      return "Legal";
    case "design":
      return "Design";
    case "product":
    default:
      return "Product";
  }
}

export function workspaceLabel(id: Workspace): string {
  switch (id) {
    case "legal":
      return "Legal";
    case "design":
      return "Design";
    case "operations":
      return "Operations";
    case "sales":
      return "Sales";
    case "product":
    default:
      return "Product";
  }
}

export function sourceLabel(type: SourceType): string {
  switch (type) {
    case "slack":
      return "Slack";
    case "email":
      return "Email";
    case "calendar":
      return "Calendar";
    case "doc":
      return "Doc";
    case "chat":
      return "Chat";
    case "form":
    default:
      return "Form";
  }
}
