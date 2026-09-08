'use client'

import React, { useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// The chrome every page-content manager shares: a header that stays put while
// you scroll a long form, jump links to each section, and a guard so edits are
// not lost by navigating away.

export interface ShellSection {
    id: string;
    label: string;
}

/**
 * Warns before leaving with unsaved edits — both a browser reload/close and an
 * in-app link (the admin sidebar renders plain anchors, so a capture-phase click
 * listener catches those before the router runs).
 */
function useUnsavedChangesWarning(isDirty: boolean) {
    useEffect(() => {
        if (!isDirty) return;

        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };

        const onClick = (e: MouseEvent) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            const anchor = (e.target as HTMLElement | null)?.closest?.("a");
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href || href.startsWith("#") || anchor.target === "_blank") return;

            const destination = new URL(href, window.location.href);
            if (destination.origin !== window.location.origin) return;
            if (destination.pathname === window.location.pathname) return;

            const leave = window.confirm("You have unsaved changes. Leave without saving?");
            if (!leave) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        window.addEventListener("beforeunload", onBeforeUnload);
        document.addEventListener("click", onClick, true);

        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            document.removeEventListener("click", onClick, true);
        };
    }, [isDirty]);
}

export const ContentManagerShell = ({
    icon: Icon,
    title,
    subtitle,
    note,
    sections,
    isLoading,
    isSaving,
    isDirty,
    onRefresh,
    onSave,
    children,
}: {
    icon: any;
    title: string;
    subtitle: string;
    note?: string;
    sections: ShellSection[];
    isLoading: boolean;
    isSaving: boolean;
    isDirty: boolean;
    onRefresh: () => void;
    onSave: () => void;
    children: React.ReactNode;
}) => {
    useUnsavedChangesWarning(isDirty && !isSaving);

    const jumpTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="pb-10">
            {/* Sticky header — stays reachable however long the form runs */}
            <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-slate-200 bg-white/90 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold text-slate-900 truncate">{title}</h1>
                                    {isDirty && !isLoading && (
                                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                                            Unsaved
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 truncate">{subtitle}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" onClick={onRefresh} disabled={isLoading || isSaving}>
                                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                            </Button>
                            <Button onClick={onSave} disabled={isSaving || isLoading}>
                                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span className="ml-2">Save Changes</span>
                            </Button>
                        </div>
                    </div>

                    {/* Jump links — horizontal so they work at every width */}
                    {!isLoading && sections.length > 1 && (
                        <div className="flex gap-1.5 overflow-x-auto pb-2.5 -mb-px custom-scrollbar">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => jumpTo(section.id)}
                                    className="shrink-0 text-xs font-medium text-slate-500 hover:text-primary hover:bg-primary/5 border border-slate-200 hover:border-primary/30 rounded-full px-3 py-1 transition-colors"
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                {note && <p className="text-xs text-slate-400 mb-6">{note}</p>}

                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading…
                    </div>
                ) : (
                    <div className="space-y-6">{children}</div>
                )}
            </div>
        </div>
    );
};
