export type Urgency = "low" | "medium" | "high" | "critical";

export type TriageState =
  | "needs_triage"
  | "assigned"
  | "deferred"
  | "ignored"
  | "resolved";

export type SourceType =
  | "slack"
  | "email"
  | "calendar"
  | "doc"
  | "chat"
  | "form";

export type TriageView =
  | "all"
  | "needs_triage"
  | "assigned"
  | "deferred"
  | "ignored"
  | "resolved";

/** Which team area owns the signal in this app (filters the feed). */
export type Workspace =
  | "product"
  | "legal"
  | "design"
  | "operations"
  | "sales";

/** Subtle on-card label (not every workspace — scoping lens). */
export type SignalTag = "product" | "legal" | "design";

export interface SignalSource {
  type: SourceType;
  label: string;
}

export interface RelatedInput {
  snippet: string;
  from: string;
  at?: string;
}

export interface Signal {
  id: string;
  title: string;
  why_it_matters: string;
  urgency: Urgency;
  suggested_owner: string | null;
  assignee: string | null;
  triage_state: TriageState;
  /** Team / function area (workspace switcher). */
  workspace: Workspace;
  /** Small card label: Product, Legal, or Design. */
  signal_tag: SignalTag;
  sources: SignalSource[];
  related_inputs: RelatedInput[];
  created_at?: string;
  updated_at?: string;
}

export const SOURCE_TYPE_ORDER: SourceType[] = [
  "slack",
  "email",
  "calendar",
  "doc",
  "chat",
  "form",
];

export const URGENCY_ORDER: Urgency[] = ["critical", "high", "medium", "low"];

export const WORKSPACES: { id: Workspace; label: string }[] = [
  { id: "product", label: "Product" },
  { id: "legal", label: "Legal" },
  { id: "design", label: "Design" },
  { id: "operations", label: "Operations" },
  { id: "sales", label: "Sales" },
];
