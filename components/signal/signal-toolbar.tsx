"use client";

import { useEffect, useRef, useState } from "react";
import {
  faDownload,
  faRotateRight,
  faSearch,
  faUpload,
  faXmark,
  FaIcon,
} from "@/components/ui/fa-icon";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
  onResetDemo: () => void;
  className?: string;
};

export function SignalToolbar({
  searchQuery,
  onSearchChange,
  onExport,
  onImportFile,
  onResetDemo,
  className,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!searchOpen) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const el = overlayRef.current;
      if (el && !el.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [searchOpen]);

  const searchActive = Boolean(searchQuery.trim());

  return (
    <div
      className={cn(
        "relative border-b border-border/50 bg-background/80 px-6 py-3",
        className
      )}
    >
      <div
        className={cn(
          "flex min-h-9 flex-wrap items-center gap-2 sm:justify-end",
          searchOpen && "invisible pointer-events-none"
        )}
        aria-hidden={searchOpen}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onExport}
        >
          <FaIcon icon={faDownload} className="size-3.5" />
          Export
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => fileRef.current?.click()}
        >
          <FaIcon icon={faUpload} className="size-3.5" />
          Import
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImportFile(f);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onResetDemo}
        >
          <FaIcon icon={faRotateRight} className="size-3.5" />
          Reset demo
        </Button>
        <Button
          type="button"
          variant={searchActive ? "secondary" : "outline"}
          size="icon-sm"
          onClick={() => setSearchOpen(true)}
          aria-expanded={searchOpen}
          aria-label={
            searchActive
              ? "Expand search (filter is active)"
              : "Search signals"
          }
        >
          <FaIcon icon={faSearch} className="size-3.5" />
        </Button>
      </div>

      {searchOpen ? (
        <div
          ref={overlayRef}
          className="absolute inset-x-6 inset-y-3 z-20 flex min-h-9 items-center gap-2 rounded-lg border border-border/60 bg-background/95 px-2 shadow-sm ring-1 ring-foreground/[0.06] backdrop-blur-sm dark:bg-background/98"
        >
          <FaIcon
            icon={faSearch}
            className="ml-1 size-3.5 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <Input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search titles and context…"
            className="h-9 min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            aria-label="Search signals"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          >
            <FaIcon icon={faXmark} className="size-3.5" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
