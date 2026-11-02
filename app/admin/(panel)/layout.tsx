import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { getNavCounts } from "@/lib/admin/data";
import Link from "next/link";
import { Sidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: "Organiser dashboard",
  robots: { index: false, follow: false },
};

// Always fresh: this is live operational data.
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const counts = await getNavCounts();

  return (
    <div className="min-h-svh bg-black text-white lg:flex">
      <Sidebar admin={admin} counts={counts} />
      <main id="main" className="min-w-0 flex-1 px-4 py-8 md:px-8 lg:px-12 lg:py-10">
        {admin.mustChangePassword && (
          <p className="mb-6 rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            You&apos;re using the shared temporary password.{" "}
            <Link href="/admin/account" className="font-semibold underline underline-offset-2 hover:text-white">
              Set your own
            </Link>{" "}
            whenever you like. It&apos;s optional.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
