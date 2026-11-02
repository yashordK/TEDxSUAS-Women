import { requireAdmin } from "@/lib/admin/auth";
import { listAdmins } from "@/lib/admin/data";
import { removeAdmin, resetAdmin } from "@/app/admin/actions";
import { AddAdminForm, ConfirmButton } from "@/components/admin/forms";
import { Card, PageTitle, btn, fmtDate } from "@/components/admin/ui";

export default async function TeamPage() {
  const me = await requireAdmin();
  const admins = await listAdmins();

  return (
    <div className="space-y-6">
      <PageTitle title="Team access" sub="Everyone here can see all applications and queries." />

      <Card>
        <h2 className="mb-1 text-sm font-semibold text-white">Give someone access</h2>
        <p className="mb-5 text-xs text-grey">
          They sign in with the shared temporary password and are asked to set their own straight away. Share the temporary
          password with them privately.
        </p>
        <AddAdminForm />
      </Card>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.15em] text-white/60">
            <tr>
              <th className="px-4 py-3 font-semibold">Organiser</th>
              <th className="px-4 py-3 font-semibold">Password</th>
              <th className="px-4 py-3 font-semibold">Last sign-in</th>
              <th className="px-4 py-3 font-semibold">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {admins.map((a) => {
              const isMe = a.id === me.id;
              return (
                <tr key={a.id}>
                  <td className="px-4 py-3">
                    <span className="font-medium text-white">{a.name}</span>
                    {isMe && <span className="ml-2 text-xs text-red-text">(you)</span>}
                    <span className="block text-xs text-grey">{a.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    {a.mustChangePassword ? (
                      <span className="text-xs text-amber-200">Temporary, not set yet</span>
                    ) : (
                      <span className="text-xs text-emerald-200">Set</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-grey">{a.lastLoginAt ? fmtDate(a.lastLoginAt) : "Never"}</td>
                  <td className="px-4 py-3">
                    {!isMe && (
                      <div className="flex justify-end gap-2">
                        <form action={resetAdmin}>
                          <input type="hidden" name="id" value={a.id} />
                          <ConfirmButton
                            message={`Reset ${a.name}'s password to the temporary one? They'll be signed out everywhere.`}
                            className={`${btn} border border-white/20 text-white hover:bg-white/5`}
                          >
                            Reset password
                          </ConfirmButton>
                        </form>
                        <form action={removeAdmin}>
                          <input type="hidden" name="id" value={a.id} />
                          <ConfirmButton
                            message={`Remove ${a.name}'s access to the dashboard?`}
                            className={`${btn} border border-red/50 text-red-text hover:bg-red/10`}
                          >
                            Remove
                          </ConfirmButton>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
