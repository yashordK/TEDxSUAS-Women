import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { getNavCounts } from "@/lib/admin/data";
import { Sidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: "Organiser dashboard",
  robots: { index: false, follow: false },
};

// Always fresh: this is live operational data.
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin({ allowTemporaryPassword: true });
  const counts = await getNavCounts();

  return (
    <div className="min-h-svh bg-black text-white lg:flex">
      <Sidebar admin={admin} counts={counts} locked={admin.mustChangePassword} />
      <main id="main" className="min-w-0 flex-1 px-4 py-8 md:px-8 lg:px-12 lg:py-10">
        {children}
      </main>
    </div>
  );
}
