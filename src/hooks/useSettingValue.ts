'use client'

import { useMemo } from "react";
import { useSettings } from "./useSettings";

/**
 * Reads one admin-managed settings record (the same key/value store behind
 * `home_faqs`).
 *
 * It reads from the single `/settings` response that the header and footer
 * already load, rather than requesting `/settings/<key>` on its own: one shared,
 * cached request instead of one per section, and a key that has never been saved
 * is simply absent rather than a 404.
 *
 * The shipped copy is returned while the request is in flight and on any error,
 * so a section never renders blank. Stored values are merged over the fallback,
 * so a record saved before a new field existed still picks that field up.
 */
export function useSettingValue<T extends object>(key: string, fallback: T): T {
    const { data: settings } = useSettings();

    return useMemo(() => {
        const stored = (settings as Record<string, unknown> | undefined)?.[key];

        if (stored && typeof stored === "object" && !Array.isArray(stored)) {
            return { ...fallback, ...(stored as Partial<T>) };
        }

        return fallback;
        // `fallback` is a module-level constant at every call site.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings, key]);
}
