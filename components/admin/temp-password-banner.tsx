"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Reminder for organisers who skipped setting their own password. */
export function TempPasswordBanner() {
  if (usePathname() === "/admin/account") return null;
  return (
    <p className="mb-6 rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
      You&apos;re still using the shared temporary password.{" "}
      <Link href="/admin/account" className="font-semibold underline underline-offset-2 hover:text-white">
        Set your own
      </Link>
    </p>
  );
}
