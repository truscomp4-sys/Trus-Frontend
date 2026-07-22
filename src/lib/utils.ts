'use client'

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Same fallback the login page uses, so the refresh call hits the same API host.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.truscomp.com/api/v1";

// ---------------------------------------------------------------------------
// Token storage — cookie based (no localStorage).
// The `adminToken` cookie is the single source of truth: it is what the Next.js
// route guard (src/middleware.ts) reads to protect /admin routes, and what we
// attach as the Authorization header for API calls.
// ---------------------------------------------------------------------------
const TOKEN_KEY = "adminToken";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days (marker; the JWT itself is short-lived and refreshed)

export const getToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_KEY}=([^;]*)`));
  return match ? match[1] : null;
};

export const setToken = (token: string) => {
  if (typeof document === "undefined") return;
  // `Secure` only on https so it still works on http://localhost during dev.
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${TOKEN_MAX_AGE}; SameSite=Lax${secure}`;
};

export const clearToken = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

// De-duplicate concurrent refreshes: if several requests get a 401 at the same
// time (e.g. a dashboard firing many calls), they all share one refresh call.
let refreshPromise: Promise<boolean> | null = null;

const tryRefresh = (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      // Uses the httpOnly 30-day refreshToken cookie (same-site, sent via credentials).
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return false;

      const data = await res.json().catch(() => ({} as any));
      if (data && data.accessToken) {
        setToken(data.accessToken);
      }
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const doFetch = () => {
    const token = getToken();
    const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(url, { ...options, headers, credentials: "include" });
  };

  let response = await doFetch();

  // Access token expired → try a silent refresh once, then retry the request.
  if (response.status === 401 || response.status === 403) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      response = await doFetch();
    }
  }

  // Still unauthorized after the refresh attempt → the session is genuinely over.
  if (
    (response.status === 401 || response.status === 403) &&
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin")
  ) {
    console.error(`Auth Error ${response.status} - session could not be refreshed`);
    clearToken();
    toast.error("Session expired. Please login again.");

    // Short delay so the toast can be seen before redirect
    setTimeout(() => {
      window.location.href = "/admin/login";
    }, 1500);
  }

  return response;
};
