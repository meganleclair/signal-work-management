import { INITIAL_SIGNALS } from "@/lib/seed-data";
import type { Signal, SignalTag, TriageState, Workspace } from "@/lib/types";

const STORAGE_KEY = "signal-signals-v4";

function isWorkspace(v: unknown): v is Workspace {
  return (
    v === "product" ||
    v === "legal" ||
    v === "design" ||
    v === "operations" ||
    v === "sales"
  );
}

function isSignalTag(v: unknown): v is SignalTag {
  return v === "product" || v === "legal" || v === "design";
}

export function hydrateSignals(list: unknown[]): Signal[] {
  return list.map((item) => {
    const s = item as Record<string, unknown>;
    return {
      ...(s as object),
      workspace: isWorkspace(s.workspace) ? s.workspace : "product",
      signal_tag: isSignalTag(s.signal_tag) ? s.signal_tag : "product",
      sources: Array.isArray(s.sources) ? s.sources : [],
      related_inputs: Array.isArray(s.related_inputs) ? s.related_inputs : [],
    } as Signal;
  });
}

function parseSignals(raw: string | null): Signal[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return hydrateSignals(parsed);
  } catch {
    return null;
  }
}

function readLocalSignals(): Signal[] {
  if (typeof window === "undefined") return INITIAL_SIGNALS;
  const existing = parseSignals(localStorage.getItem(STORAGE_KEY));
  if (existing?.length) return existing;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SIGNALS));
  return INITIAL_SIGNALS;
}

function writeLocalSignals(signals: Signal[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
}

export async function fetchSignals(): Promise<Signal[]> {
  return readLocalSignals();
}

export type SignalPatch = Partial<
  Pick<
    Signal,
    | "triage_state"
    | "assignee"
    | "suggested_owner"
    | "urgency"
    | "why_it_matters"
  >
>;

function compactPatch(patch: SignalPatch): SignalPatch {
  const result: SignalPatch = {};
  if (patch.triage_state !== undefined) result.triage_state = patch.triage_state;
  if (patch.assignee !== undefined) result.assignee = patch.assignee;
  if (patch.suggested_owner !== undefined) result.suggested_owner = patch.suggested_owner;
  if (patch.urgency !== undefined) result.urgency = patch.urgency;
  if (patch.why_it_matters !== undefined) result.why_it_matters = patch.why_it_matters;
  return result;
}

export async function updateSignal(
  id: string,
  patch: SignalPatch
): Promise<Signal> {
  const applied = compactPatch(patch);
  const list = readLocalSignals();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Signal not found");
  const next = {
    ...list[idx],
    ...applied,
    updated_at: new Date().toISOString(),
  };
  const copy = [...list];
  copy[idx] = next;
  writeLocalSignals(copy);
  return next;
}

export async function setTriageState(
  id: string,
  triage_state: TriageState,
  assignee?: string | null
): Promise<Signal> {
  const patch: SignalPatch = { triage_state };
  if (assignee !== undefined) patch.assignee = assignee;
  return updateSignal(id, patch);
}

/** Replace one signal in storage (undo, import row). */
export async function replaceSignal(signal: Signal): Promise<Signal> {
  const list = readLocalSignals();
  const idx = list.findIndex((s) => s.id === signal.id);
  if (idx === -1) throw new Error("Signal not found");
  const next: Signal = {
    ...signal,
    sources: Array.isArray(signal.sources) ? signal.sources : [],
    related_inputs: Array.isArray(signal.related_inputs)
      ? signal.related_inputs
      : [],
    updated_at: new Date().toISOString(),
  };
  const copy = [...list];
  copy[idx] = next;
  writeLocalSignals(copy);
  return next;
}

/** Replace entire list (import). */
export async function saveAllSignals(signals: Signal[]): Promise<void> {
  writeLocalSignals(hydrateSignals(signals));
}

/** Restore seed data and clear custom local state. */
export async function resetToSeed(): Promise<Signal[]> {
  const fresh = structuredClone(INITIAL_SIGNALS);
  writeLocalSignals(fresh);
  return readLocalSignals();
}
