import { INITIAL_SIGNALS } from "@/lib/seed-data";
import type { Signal, SignalTag, TriageState, Workspace } from "@/lib/types";

const STORAGE_KEY = "signal-signals-v3";

function parseSignals(raw: string | null): Signal[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return hydrateSignals(parsed as Signal[]);
  } catch {
    return null;
  }
}

export function hydrateSignals(list: Signal[]): Signal[] {
  return list.map((s) => ({
    ...s,
    workspace: (s.workspace as Workspace | undefined) ?? "product",
    signal_tag: (s.signal_tag as SignalTag | undefined) ?? "product",
    sources: Array.isArray(s.sources) ? s.sources : [],
    related_inputs: Array.isArray(s.related_inputs) ? s.related_inputs : [],
  }));
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
  return Object.fromEntries(
    Object.entries(patch).filter(([, v]) => v !== undefined)
  ) as SignalPatch;
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
