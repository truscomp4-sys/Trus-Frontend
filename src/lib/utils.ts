'use client'

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    console.log("Token present: true");
    options.headers = {
      ...options.headers,
      "Authorization": `Bearer ${token}`
    };
  } else {
    console.log("Token present: false");
  }

  // Ensure credentials include for cookies (if still needed)
  options.credentials = "include";

  const response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    console.error(`Auth Error ${response.status} - Token invalid or expired`);
    
    // Only redirect if we are in an admin route to avoid annoying public users
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem("adminToken");
      toast.error("Session expired. Please login again.");
      
      // Short delay so the toast can be seen before redirect
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 1500);
    }
  }

  return response;
};
