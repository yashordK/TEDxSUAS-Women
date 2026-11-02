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
        sub={first ? "You can keep using the temporary password, or set one only you know." : admin.email}
      />
      {first && (
        <p className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          You&apos;re signed in with the shared temporary password. Anyone who knows it can sign in as you, so setting your own is recommended, but it&apos;s up to you.
        </p>
      )}
      <Card>
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
          {first ? "Set your password" : "Change password"}
        </h2>
        <ChangePasswordForm first={first} />
      </Card>
    </div>
  );
}
