import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { ChangePasswordForm } from "@/components/admin/forms";
import { Card, PageTitle } from "@/components/admin/ui";

export default async function AccountPage() {
  const admin = await requireAdmin();
  const first = admin.mustChangePassword;

  return (
    <div className="max-w-3xl space-y-8">
      <PageTitle
        title={first ? `Welcome, ${admin.name.split(" ")[0]}` : "My account"}
        sub={first ? "You're signed in with the shared temporary password. Set one only you know, or skip and do it later." : admin.email}
      />
      {first && (
        <p className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Everyone on the team knows the temporary password, so anyone could sign in as you, and the activity log
          would show your name. Setting your own is recommended.
        </p>
      )}
      <Card>
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
          {first ? "Set your password" : "Change password"}
        </h2>
        <ChangePasswordForm first={first} />
      </Card>
      {first && (
        <Link href="/admin" className="inline-block text-sm text-grey underline underline-offset-4 hover:text-white">
          Skip for now, I&apos;ll set it later →
        </Link>
      )}
    </div>
  );
}
