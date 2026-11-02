import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin/auth";
import { LoginForm } from "@/components/admin/forms";

export const metadata: Metadata = { title: "Organiser sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const admin = await getAdmin();
  if (admin) redirect("/admin");

  return (
    <main id="main" className="relative flex min-h-svh items-center justify-center overflow-hidden bg-black px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(235_0_40/0.18),transparent)]"
      />
      <div className="relative w-full max-w-sm">
        <Image src="/brand/logo-white.png" alt="TEDxSUAS Women" width={2744} height={440} sizes="200px" className="h-7 w-auto" priority />
        <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-red-text">Organiser dashboard</p>
        <h1 className="mt-10 font-[family-name:var(--font-playfair)] text-4xl font-bold text-white">Sign in</h1>
        <p className="mb-8 mt-2 text-sm text-grey">For the TEDxSUAS Women organising team only.</p>
        <LoginForm />
        <p className="mt-8 text-xs text-grey">Forgot your password? Ask another organiser to reset it from Team access.</p>
      </div>
    </main>
  );
}
