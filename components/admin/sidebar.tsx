"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/admin/actions";

type Props = {
  admin: { name: string; email: string };
  counts: { pending: number; openQueries: number };
};

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/applications", label: "Applications", badge: "pending" as const },
  { href: "/admin/queries", label: "Queries", badge: "openQueries" as const },
  { href: "/admin/activity", label: "Activity log" },
  { href: "/admin/team", label: "Team access" },
  { href: "/admin/account", label: "My account" },
];

export function Sidebar({ admin, counts }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = (
    <nav aria-label="Dashboard" className="flex flex-col gap-1">
      {NAV.map((n) => {
        const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
        const badge = n.badge ? counts[n.badge] : 0;
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-red/15 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            {n.label}
            {badge > 0 && (
              <span className="min-w-6 rounded-full bg-red px-1.5 text-center text-xs font-bold text-white">{badge}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* mobile bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 lg:hidden">
        <Image src="/brand/logo-white.png" alt="TEDxSUAS Women" width={2744} height={440} sizes="140px" priority className="h-5 w-auto" />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div className="border-b border-white/10 p-4 lg:hidden">
          {links}
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
            <span className="truncate text-grey">{admin.email}</span>
            <form action={logout}>
              <button type="submit" className="font-semibold text-red-text">
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}

      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-white/10 p-5 lg:flex">
        <Link href="/admin" className="block">
          <Image src="/brand/logo-white.png" alt="TEDxSUAS Women" width={2744} height={440} sizes="160px" className="h-6 w-auto" />
          <span className="mt-2 block text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-red-text">Organiser dashboard</span>
        </Link>
        <div className="mt-10">{links}</div>
        <div className="mt-auto border-t border-white/10 pt-4">
          <p className="truncate text-sm font-semibold text-white">{admin.name}</p>
          <p className="truncate text-xs text-grey">{admin.email}</p>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <Link href="/" className="text-grey hover:text-white">
              View site
            </Link>
            <form action={logout}>
              <button type="submit" className="text-red-text hover:text-white">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
