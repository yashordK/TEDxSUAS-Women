"use client";

import { usePathname } from "next/navigation";

/** Keeps public-site chrome (footer etc.) out of the organiser dashboard. */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  return usePathname().startsWith("/admin") ? null : children;
}
