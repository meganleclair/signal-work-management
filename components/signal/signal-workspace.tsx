"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faBolt,
  faClock,
  faEyeSlash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import type { FeedEmptyInfo } from "@/components/signal/signal-feed";
import { SignalSidebar } from "@/components/signal/signal-sidebar";
import { SignalFeed } from "@/components/signal/signal-feed";
import { SignalDetailPanel } from "@/components/signal/signal-detail-panel";
import { SignalToolbar } from "@/components/signal/signal-toolbar";
import { WorkspaceBar } from "@/components/signal/workspace-bar";
import {
  sourceLabel,
  workspaceLabel as getWorkspaceLabel,
} from "@/components/signal/urgency-styles";
import { Button } from "@/components/ui/button";
import {
  filterBySearchQuery,
  filterBySources,
  filterByView,
  filterByWorkspace,
} from "@/lib/filter-signals";
import { validateSignalsPayload } from "@/lib/signal-io";
import {
  fetchSignals,
  replaceSignal,
  resetToSeed,
  saveAllSignals,
  setTriageState,
} from "@/lib/signal-service";
import type { Signal, SourceType, TriageView, Workspace } from "@/lib/types";
import { SOURCE_TYPE_ORDER } from "@/lib/types";

type TriageActionsProps = {
  signal: Signal;
  busy: boolean;
  onActNow: () => void;
  onReturnToNeedsTriage: () => void;
  onDefer: () => void;
  onIgnore: () => void;
  afterAction?: () => void;
};

function SignalTriageActions({
  signal,
  busy,
  onActNow,
  onReturnToNeedsTriage,
  onDefer,
  onIgnore,
  afterAction,
}: TriageActionsProps) {
  const isPrimary =
    signal.triage_state === "needs_triage" ||
    signal.triage_state === "assigned";
  return (
    <div className="flex flex-col gap-2">
      {isPrimary ? (
        <Button
          type="button"
          className="justify-start gap-2"
          disabled={busy}
          onClick={() => {
            onActNow();
            afterAction?.();
          }}
        >
          <FontAwesomeIcon icon={faBolt} className="size-3.5" />
          Act now
        </Button>
      ) : (
        <Button
          type="button"
          variant="secondary"
          className="justify-start gap-2"
          disabled={busy}
          onClick={() => {
            onReturnToNeedsTriage();
            afterAction?.();
          }}
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} className="size-3.5" />
          Return to triage
        </Button>
      )}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={busy || signal.triage_state === "deferred"}
          onClick={() => {
            onDefer();
            afterAction?.();
          }}
        >
          <FontAwesomeIcon icon={faClock} className="size-3.5" />
          Defer
        </Button>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={busy || signal.triage_state === "ignored"}
          onClick={() => {
            onIgnore();
            afterAction?.();
          }}
        >
          <FontAwesomeIcon icon={faEyeSlash} className="size-3.5" />
          Ignore
        </Button>
      </div>
    </div>
  );
}

export function SignalWorkspace() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState<Workspace>("product");
  const [view, setView] = useState<TriageView>("needs_triage");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allowedSources, setAllowedSources] = useState<SourceType[]>(() => [
    ...SOURCE_TYPE_ORDER,
  ]);
  const [lastUndo, setLastUndo] = useState<{ snapshot: Signal } | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [resetPending, setResetPending] = useState(false);

  const signalsRef = useRef<Signal[]>([]);
  useEffect(() => {
    signalsRef.current = signals;
  }, [signals]);

  // Close mobile sheet if the selected signal disappears from the filtered list.
  useEffect(() => {
    if (!selectedId) setMobileSheetOpen(false);
  }, [selectedId]);

  const workspaceLabel = getWorkspaceLabel(workspace);

  const reload = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchSignals();
      setSignals(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load signals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    setAllowedSources([...SOURCE_TYPE_ORDER]);
  }, [workspace]);

  const scopedSignals = useMemo(
    () => filterByWorkspace(signals, workspace),
    [signals, workspace]
  );

  const viewOnly = useMemo(
    () => filterByView(scopedSignals, view),
    [scopedSignals, view]
  );

  const afterSources = useMemo(
    () => filterBySources(viewOnly, allowedSources),
    [viewOnly, allowedSources]
  );

  const filtered = useMemo(
    () => filterBySearchQuery(afterSources, searchQuery),
    [afterSources, searchQuery]
  );

  const emptyInfo = useMemo((): FeedEmptyInfo | null => {
    if (filtered.length > 0) return null;
    if (scopedSignals.length === 0) {
      return { kind: "workspace", workspaceLabel };
    }
    if (viewOnly.length === 0) {
      return { kind: "view", view, workspaceLabel };
    }
    if (afterSources.length === 0) {
      return { kind: "sources" };
    }
    if (searchQuery.trim() && afterSources.length > 0) {
      return { kind: "search", query: searchQuery.trim() };
    }
    return { kind: "generic" };
  }, [
    filtered,
    scopedSignals.length,
    viewOnly.length,
    afterSources.length,
    searchQuery,
    workspaceLabel,
    view,
  ]);

  const counts = useMemo(() => {
    const base: Record<TriageView, number> = {
      all: scopedSignals.length,
      needs_triage: 0,
      assigned: 0,
      deferred: 0,
      ignored: 0,
      resolved: 0,
    };
    for (const s of scopedSignals) {
      base[s.triage_state]++;
    }
    return base;
  }, [scopedSignals]);

  useEffect(() => {
    setSelectedId((cur) => {
      if (cur && filtered.some((s) => s.id === cur)) return cur;
      return filtered[0]?.id ?? null;
    });
  }, [filtered]);

  const selected = useMemo(
    () => signals.find((s) => s.id === selectedId) ?? null,
    [signals, selectedId]
  );

  const toggleSource = useCallback((t: SourceType) => {
    setAllowedSources((prev) => {
      if (prev.includes(t)) {
        if (prev.length <= 1) return prev;
        return prev.filter((x) => x !== t);
      }
      return [...prev, t].sort(
        (a, b) =>
          SOURCE_TYPE_ORDER.indexOf(a) - SOURCE_TYPE_ORDER.indexOf(b)
      );
    });
  }, []);

  const runAction = useCallback(
    async (
      id: string,
      fn: () => Promise<Signal>,
      afterSuccess?: (updated: Signal) => void
    ) => {
      const before = signalsRef.current.find((s) => s.id === id);
      setBusyId(id);
      setError(null);
      try {
        const updated = await fn();
        setSignals((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
        if (before) {
          setLastUndo({ snapshot: structuredClone(before) });
        }
        afterSuccess?.(updated);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Action failed.");
      } finally {
        setBusyId(null);
      }
    },
    []
  );

  // ── Named action handlers — shared by desktop detail panel + mobile sheet ──

  const handleActNow = useCallback(() => {
    if (!selected) return;
    const viewBefore = view;
    void runAction(
      selected.id,
      () => setTriageState(selected.id, "resolved", null),
      (updated) => {
        if (viewBefore === "needs_triage") {
          setView("resolved");
          setSelectedId(updated.id);
        }
      }
    );
  }, [selected, view, runAction]);

  const handleReturnToNeedsTriage = useCallback(() => {
    if (!selected) return;
    const viewBefore = view;
    void runAction(
      selected.id,
      () => setTriageState(selected.id, "needs_triage", null),
      (updated) => {
        if (
          viewBefore === "resolved" ||
          viewBefore === "ignored" ||
          viewBefore === "deferred"
        ) {
          setView("needs_triage");
          setSelectedId(updated.id);
        }
      }
    );
  }, [selected, view, runAction]);

  const handleAssign = useCallback(
    (assignee: string) => {
      if (!selected) return;
      void runAction(selected.id, () =>
        setTriageState(selected.id, "assigned", assignee)
      );
    },
    [selected, runAction]
  );

  const handleDefer = useCallback(() => {
    if (!selected) return;
    void runAction(selected.id, () =>
      setTriageState(selected.id, "deferred", null)
    );
  }, [selected, runAction]);

  const handleIgnore = useCallback(() => {
    if (!selected) return;
    void runAction(selected.id, () =>
      setTriageState(selected.id, "ignored", null)
    );
  }, [selected, runAction]);

  // ────────────────────────────────────────────────────────────────────────────

  const handleUndo = useCallback(async () => {
    if (!lastUndo) return;
    setError(null);
    try {
      const restored = await replaceSignal(lastUndo.snapshot);
      setSignals((prev) =>
        prev.map((s) => (s.id === restored.id ? restored : s))
      );
      setLastUndo(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not undo.");
    }
  }, [lastUndo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key !== "z" || e.shiftKey) return;
      const el = e.target;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      ) {
        return;
      }
      if (!lastUndo) return;
      e.preventDefault();
      void handleUndo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lastUndo, handleUndo]);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(signals, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `signal-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [signals]);

  const importJson = useCallback(
    async (file: File) => {
      setError(null);
      try {
        const text = await file.text();
        const raw: unknown = JSON.parse(text);
        const validated = validateSignalsPayload(raw);
        await saveAllSignals(validated);
        const next = await fetchSignals();
        setSignals(next);
        setLastUndo(null);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Could not import that file."
        );
      }
    },
    []
  );

  const resetDemo = useCallback(() => {
    setResetPending(true);
  }, []);

  const confirmReset = useCallback(async () => {
    setResetPending(false);
    setError(null);
    try {
      const next = await resetToSeed();
      setSignals(next);
      setLastUndo(null);
      setSearchQuery("");
      setAllowedSources([...SOURCE_TYPE_ORDER]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reset.");
    }
  }, []);

  /** Selects a signal and opens the mobile bottom sheet. */
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setMobileSheetOpen(true);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {error ? (
        <div className="border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-center text-xs text-destructive">
          {error}
        </div>
      ) : null}
      <WorkspaceBar value={workspace} onChange={setWorkspace} />
      {lastUndo ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 bg-muted/30 px-4 py-2 text-sm text-muted-foreground sm:px-6">
          <span>Last triage change can be undone.</span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-1.5"
            onClick={() => void handleUndo()}
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} className="size-3.5" />
            Undo
          </Button>
        </div>
      ) : null}
      {resetPending ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-destructive/25 bg-destructive/8 px-4 py-2 text-sm sm:px-6">
          <span className="text-foreground/90">
            Reset all triage data to the original demo set?{" "}
            <span className="text-muted-foreground">This cannot be undone.</span>
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setResetPending(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => void confirmReset()}
            >
              Reset
            </Button>
          </div>
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SignalSidebar
          view={view}
          onViewChange={setView}
          counts={counts}
          sourceTypes={SOURCE_TYPE_ORDER}
          allowedSources={allowedSources}
          onToggleSource={toggleSource}
        />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading signals…
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <SignalToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onExport={exportJson}
                onImportFile={(f) => void importJson(f)}
                onResetDemo={() => void resetDemo()}
              />
              <div className="min-h-0 flex-1">
                <SignalFeed
                  workspace={workspace}
                  signals={filtered}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  emptyInfo={emptyInfo}
                />
              </div>
            </div>
          )}
        </main>
        <SignalDetailPanel
          signal={selected}
          busy={busyId === selected?.id}
          onActNow={handleActNow}
          onReturnToNeedsTriage={handleReturnToNeedsTriage}
          onAssign={handleAssign}
          onDefer={handleDefer}
          onIgnore={handleIgnore}
        />
      </div>

      {/* ── Mobile bottom sheet ─────────────────────────────────────────────
          Shown only on screens < md. Slides up when a signal card is tapped.
          The desktop detail panel (hidden md:flex) takes over at md+.        */}
      {mobileSheetOpen && selected ? (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSheetOpen(false)}
        >
          <div
            className="max-h-[88vh] overflow-y-auto rounded-t-2xl bg-background ring-1 ring-border/50"
            style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.12)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center py-3">
              <div className="h-1 w-10 rounded-full bg-border/60" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-border/40 px-5 pb-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {selected.urgency}
                </p>
                <h2 className="mt-0.5 text-[17px] font-semibold leading-snug tracking-tight text-foreground">
                  {selected.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setMobileSheetOpen(false)}
                className="mt-0.5 shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 px-5 py-5">
              <p className="text-sm leading-relaxed text-foreground/88">
                {selected.why_it_matters}
              </p>
              {selected.sources.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selected.sources.map((src, i) => (
                    <span
                      key={`mob-${selected.id}-${i}`}
                      className="inline-flex items-center rounded-md border border-border/45 bg-muted/25 px-2 py-0.5 text-[11px] font-medium text-foreground/80"
                    >
                      {sourceLabel(src.type)}
                      <span className="ml-1 opacity-70">· {src.label}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-border/40 px-5 py-4 pb-8">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/85">
                Actions
              </p>
              <SignalTriageActions
                signal={selected}
                busy={busyId === selected.id}
                onActNow={handleActNow}
                onReturnToNeedsTriage={handleReturnToNeedsTriage}
                onDefer={handleDefer}
                onIgnore={handleIgnore}
                afterAction={() => setMobileSheetOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
