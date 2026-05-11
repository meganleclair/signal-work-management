"use client";

import React, { useMemo, useState } from "react";
import {
  faArrowRotateLeft,
  faBolt,
  faClock,
  faEyeSlash,
  faUserPlus,
  FaIcon,
} from "@/components/ui/fa-icon";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Signal } from "@/lib/types";
import {
  formatUrgencyLabel,
  signalTagLabel,
  sourceClasses,
  sourceLabel,
  workspaceLabel,
} from "@/components/signal/urgency-styles";
import { cn } from "@/lib/utils";

const TEAM = [
  "Alex Rivera",
  "Jordan Lee",
  "Sam Okonkwo",
  "Taylor Chen",
  "Morgan Patel",
];

type Props = {
  signal: Signal | null;
  busy: boolean;
  onActNow: () => void;
  /** Resolved, ignored, or deferred → back to Needs triage */
  onReturnToNeedsTriage: () => void;
  onAssign: (assignee: string) => void;
  onDefer: () => void;
  onIgnore: () => void;
};

function ReturnButton({
  label,
  description,
  busy,
  onClick,
}: {
  label: string;
  description: React.ReactNode;
  busy: boolean;
  onClick: () => void;
}) {
  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="justify-start gap-2"
        disabled={busy}
        onClick={onClick}
      >
        <FaIcon icon={faArrowRotateLeft} className="size-3.5" />
        {label}
      </Button>
      <p className="text-[11px] leading-snug text-muted-foreground/90">
        {description}
      </p>
    </>
  );
}

const PANEL_LABEL =
  "text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/85";

export function SignalDetailPanel({
  signal,
  busy,
  onActNow,
  onReturnToNeedsTriage,
  onAssign,
  onDefer,
  onIgnore,
}: Props) {
  /** Remember dropdown choice per signal id (no effect needed when switching cards). */
  const [assignPick, setAssignPick] = useState<Record<string, string>>({});

  const defaultAssignee = useMemo(() => {
    if (!signal) return TEAM[0];
    if (signal.assignee && TEAM.includes(signal.assignee)) {
      return signal.assignee;
    }
    if (signal.suggested_owner && TEAM.includes(signal.suggested_owner)) {
      return signal.suggested_owner;
    }
    return TEAM[0];
  }, [signal]);

  const assignValue = useMemo(() => {
    if (!signal) return TEAM[0];
    const raw = assignPick[signal.id] ?? defaultAssignee;
    return TEAM.includes(raw) ? raw : TEAM[0];
  }, [signal, assignPick, defaultAssignee]);

  if (!signal) {
    return (
      <aside className="hidden h-full w-[320px] shrink-0 flex-col border-l border-border/50 bg-card/20 md:flex lg:w-[380px]">
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-sm font-medium text-foreground">No signal selected</p>
          <p className="text-sm text-muted-foreground">
            Select a card in the feed for full context, sources, and actions.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "hidden h-full w-[320px] shrink-0 flex-col bg-card/25 md:flex lg:w-[380px]",
        "border-l border-border/45"
      )}
    >
      <div className="border-b border-border/50 px-5 py-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="pr-2 text-base font-semibold leading-snug tracking-tight text-foreground">
            {signal.title}
          </h2>
          <span className="shrink-0 rounded-md border border-border/40 bg-muted/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {formatUrgencyLabel(signal.urgency)}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground/85">
          {workspaceLabel(signal.workspace)} ·{" "}
          <span className="text-muted-foreground/75">
            {signalTagLabel(signal.signal_tag)}
          </span>
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">
          <span className="text-muted-foreground/80">Status</span>{" "}
          <span className="font-medium capitalize text-foreground/88">
            {signal.triage_state.replace(/_/g, " ")}
          </span>
          {signal.assignee ? (
            <>
              {" "}
              <span className="text-muted-foreground/80">· Owner</span>{" "}
              <span className="font-medium text-foreground/88">
                {signal.assignee}
              </span>
            </>
          ) : null}
        </p>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-6 px-5 py-5">
          <section className="space-y-2">
            <h3 className={PANEL_LABEL}>Why it matters</h3>
            <p className="text-sm leading-relaxed text-foreground/88">
              {signal.why_it_matters}
            </p>
          </section>

          <section className="space-y-2">
            <h3 className={PANEL_LABEL}>Sources</h3>
            <div className="flex flex-wrap gap-1.5">
              {signal.sources.map((src, i) => (
                <span
                  key={`${signal.id}-d-${i}`}
                  className={cn(
                    "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
                    sourceClasses(src.type)
                  )}
                >
                  {sourceLabel(src.type)}
                  <span className="ml-1 opacity-80">· {src.label}</span>
                </span>
              ))}
            </div>
          </section>

          <Separator className="bg-border/50" />

          <section className="space-y-3">
            <h3 className={PANEL_LABEL}>Related inputs</h3>
            <ul className="space-y-3">
              {signal.related_inputs.map((r, i) => (
                <li
                  key={`${signal.id}-rel-${i}`}
                  className="rounded-xl border border-border/45 bg-background/55 p-3 text-sm"
                >
                  <p className="leading-relaxed text-foreground/88">
                    {r.snippet}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {r.from}
                    {r.at ? ` · ${r.at}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </ScrollArea>

      <div className="border-t border-border/50 bg-card/35 p-4">
        <p className={cn("mb-3", PANEL_LABEL)}>Actions</p>
        <div className="flex flex-col gap-2">
          <div className="space-y-1.5">
            {signal.triage_state === "resolved" ? (
              <ReturnButton
                label="Mark as unresolved"
                busy={busy}
                onClick={onReturnToNeedsTriage}
                description={
                  <>
                    Sends this back to{" "}
                    <span className="font-medium text-foreground/85">Needs triage</span>{" "}
                    if you still need to track it.
                  </>
                }
              />
            ) : signal.triage_state === "ignored" ? (
              <ReturnButton
                label="Stop ignoring"
                busy={busy}
                onClick={onReturnToNeedsTriage}
                description={
                  <>
                    Brings this back into{" "}
                    <span className="font-medium text-foreground/85">Needs triage</span>{" "}
                    so it shows in your queue again.
                  </>
                }
              />
            ) : signal.triage_state === "deferred" ? (
              <ReturnButton
                label="Resume triage"
                busy={busy}
                onClick={onReturnToNeedsTriage}
                description={
                  <>
                    Undoes defer and returns this to{" "}
                    <span className="font-medium text-foreground/85">Needs triage</span>.
                  </>
                }
              />
            ) : (
              <>
                <Button
                  type="button"
                  className="justify-start gap-2"
                  disabled={busy}
                  onClick={onActNow}
                >
                  <FaIcon icon={faBolt} className="size-3.5" />
                  Act now
                </Button>
                <p className="text-[11px] leading-snug text-muted-foreground/90">
                  Confirms you’re acting on this. It moves to{" "}
                  <span className="font-medium text-foreground/85">Resolved</span>.
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/25 p-3">
            <div className="flex items-center gap-2">
              <FaIcon
                icon={faUserPlus}
                className="size-3.5 text-muted-foreground"
              />
              <Select
                key={signal.id}
                value={assignValue}
                onValueChange={(v) => {
                  if (v)
                    setAssignPick((prev) => ({ ...prev, [signal.id]: v }));
                }}
              >
                <SelectTrigger className="h-9 flex-1 bg-background">
                  <SelectValue placeholder="Assign to" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              disabled={busy}
              onClick={() => onAssign(assignValue)}
            >
              Assign
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={busy || signal.triage_state === "deferred"}
              onClick={onDefer}
            >
              <FaIcon icon={faClock} className="size-3.5" />
              Defer
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={busy || signal.triage_state === "ignored"}
              onClick={onIgnore}
            >
              <FaIcon icon={faEyeSlash} className="size-3.5" />
              Ignore
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
