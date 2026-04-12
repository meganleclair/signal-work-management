"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";

import type { FeedEmptyInfo } from "@/components/signal/signal-feed";
import { SignalSidebar } from "@/components/signal/signal-sidebar";
import { SignalFeed } from "@/components/signal/signal-feed";
import { SignalDetailPanel } from "@/components/signal/signal-detail-panel";
import { SignalToolbar } from "@/components/signal/signal-toolbar";
import { WorkspaceBar } from "@/components/signal/workspace-bar";
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
import { SOURCE_TYPE_ORDER, WORKSPACES } from "@/lib/types";

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

  const signalsRef = useRef<Signal[]>([]);
  useEffect(() => {
    signalsRef.current = signals;
  }, [signals]);

  const workspaceLabel =
    WORKSPACES.find((w) => w.id === workspace)?.label ?? workspace;

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

  const resetDemo = useCallback(async () => {
    if (
      !window.confirm(
        "Reset all triage data to the original demo set? Your current data will be replaced."
      )
    ) {
      return;
    }
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
      <div className="flex min-h-0 flex-1">
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
                  onSelect={setSelectedId}
                  emptyInfo={emptyInfo}
                />
              </div>
            </div>
          )}
        </main>
        <SignalDetailPanel
          signal={selected}
          busy={busyId === selected?.id}
          onActNow={() => {
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
          }}
          onReturnToNeedsTriage={() => {
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
          }}
          onAssign={(assignee) => {
            if (!selected) return;
            void runAction(selected.id, () =>
              setTriageState(selected.id, "assigned", assignee)
            );
          }}
          onDefer={() => {
            if (!selected) return;
            void runAction(selected.id, () =>
              setTriageState(selected.id, "deferred", null)
            );
          }}
          onIgnore={() => {
            if (!selected) return;
            void runAction(selected.id, () =>
              setTriageState(selected.id, "ignored", null)
            );
          }}
        />
      </div>
    </div>
  );
}
