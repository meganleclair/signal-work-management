import type { Signal, SignalTag, SourceType, TriageView, Workspace } from "@/lib/types";
import { SOURCE_TYPE_ORDER, URGENCY_ORDER } from "@/lib/types";

export function filterByWorkspace(
  signals: Signal[],
  workspace: Workspace
): Signal[] {
  return signals.filter((s) => s.workspace === workspace);
}

/** Lens tag on feed cards — hide when it only repeats the global workspace (Product/Legal/Design). */
export function showFeedLensTag(
  workspace: Workspace,
  tag: SignalTag
): boolean {
  if (workspace === "product" && tag === "product") return false;
  if (workspace === "legal" && tag === "legal") return false;
  if (workspace === "design" && tag === "design") return false;
  return true;
}

export function filterByView(signals: Signal[], view: TriageView): Signal[] {
  if (view === "all") return signals;
  return signals.filter((s) => s.triage_state === view);
}

/** Case-insensitive match on title and why_it_matters. */
export function filterBySearchQuery(signals: Signal[], q: string): Signal[] {
  const t = q.trim().toLowerCase();
  if (!t) return signals;
  return signals.filter((s) => {
    const hay = `${s.title} ${s.why_it_matters}`.toLowerCase();
    return hay.includes(t);
  });
}

export function filterBySources(
  signals: Signal[],
  allowedTypes: SourceType[]
): Signal[] {
  // No types selected = show everything (avoids a "dead" feed from over-filtering).
  if (!allowedTypes.length) return signals;
  const allow = new Set(allowedTypes);
  return signals.filter((s) =>
    (s.sources ?? []).some((src) => allow.has(src.type))
  );
}

export function groupByUrgency(signals: Signal[]): Map<string, Signal[]> {
  const map = new Map<string, Signal[]>();
  for (const u of URGENCY_ORDER) map.set(u, []);
  for (const s of signals) {
    map.get(s.urgency)?.push(s);
  }
  for (const u of URGENCY_ORDER) {
    const list = map.get(u) ?? [];
    list.sort((a, b) => a.title.localeCompare(b.title));
  }
  return map;
}

export function allSourceTypesPresent(signals: Signal[]): SourceType[] {
  const found = new Set<SourceType>();
  for (const s of signals) {
    for (const src of s.sources ?? []) found.add(src.type);
  }
  return SOURCE_TYPE_ORDER.filter((t) => found.has(t));
}
