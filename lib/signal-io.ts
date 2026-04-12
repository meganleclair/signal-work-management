import { hydrateSignals } from "@/lib/signal-service";
import type { Signal, TriageState, Urgency, Workspace } from "@/lib/types";

const TRIAGE: TriageState[] = [
  "needs_triage",
  "assigned",
  "deferred",
  "ignored",
  "resolved",
];
const URGENCY: Urgency[] = ["low", "medium", "high", "critical"];
const WORKSPACE: Workspace[] = [
  "product",
  "legal",
  "design",
  "operations",
  "sales",
];

/**
 * Parse and validate an imported JSON array of signals.
 * @throws Error with a short message if invalid.
 */
export function validateSignalsPayload(data: unknown): Signal[] {
  if (!Array.isArray(data)) {
    throw new Error("The file must be a JSON array of signals.");
  }
  if (data.length === 0) {
    throw new Error("That file doesn’t contain any signals.");
  }
  const hydrated = hydrateSignals(data as Signal[]);
  for (let i = 0; i < hydrated.length; i++) {
    const s = hydrated[i];
    if (typeof s.id !== "string" || !s.id.trim()) {
      throw new Error(`Signal at index ${i} needs a non-empty id.`);
    }
    if (typeof s.title !== "string" || !s.title.trim()) {
      throw new Error(`Signal “${s.id}” needs a title.`);
    }
    if (typeof s.why_it_matters !== "string") {
      throw new Error(`Signal “${s.id}” needs why_it_matters text.`);
    }
    if (!URGENCY.includes(s.urgency)) {
      throw new Error(`Signal “${s.id}” has an invalid urgency.`);
    }
    if (!TRIAGE.includes(s.triage_state)) {
      throw new Error(`Signal “${s.id}” has an invalid triage state.`);
    }
    if (!WORKSPACE.includes(s.workspace)) {
      throw new Error(`Signal “${s.id}” has an invalid workspace.`);
    }
    if (!Array.isArray(s.sources)) {
      throw new Error(`Signal “${s.id}” needs a sources array.`);
    }
    if (!Array.isArray(s.related_inputs)) {
      throw new Error(`Signal “${s.id}” needs a related_inputs array.`);
    }
  }
  return hydrated;
}
