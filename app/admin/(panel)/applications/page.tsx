import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { listApplications, STATUS_LABEL } from "@/lib/admin/data";
import { APPLICATION_STATUSES } from "@/lib/admin/status";
import { PageTitle, StatusBadge, btnGhost, btnPrimary, fmtDate, input } from "@/components/admin/ui";

type SP = Promise<{ q?: string; status?: string; symbiosis?: string }>;

export default async function ApplicationsPage({ searchParams }: { searchParams: SP }) {
  await requireAdmin();
  const sp = await searchParams;
  const rows = await listApplications(sp);
  const qs = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]).toString();
  const filtered = Boolean(sp.q || sp.status || sp.symbiosis);

  return (
    <div className="space-y-6">
      <PageTitle title="Applications" sub={`${rows.length} ${filtered ? "matching" : "total"}`}>
        <a href={`/admin/applications/export${qs ? `?${qs}` : ""}`} className={btnGhost}>
          Export CSV
        </a>
      </PageTitle>

      {/* Filters: plain GET form, so filtered views are shareable links */}
      <form className="grid gap-3 md:grid-cols-[1fr_200px_200px_auto_auto]" role="search">
        <input
          name="q"
          defaultValue={sp.q}
          placeholder="Search name, email, ref ID, idea, university, phone"
          aria-label="Search applications"
          className={input}
        />
        <select name="status" defaultValue={sp.status ?? ""} aria-label="Status" className={`${input} [&>option]:bg-black`}>
          <option value="">All statuses</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <select name="symbiosis" defaultValue={sp.symbiosis ?? ""} aria-label="Applicant type" className={`${input} [&>option]:bg-black`}>
          <option value="">All applicants</option>
          <option value="yes">Symbiosis students</option>
        </select>
        <button type="submit" className={btnPrimary}>
          Filter
        </button>
        {filtered && (
          <Link href="/admin/applications" className={btnGhost}>
            Clear
          </Link>
        )}
      </form>

      {rows.length ? (
        <div className="overflow-x-auto rounded-xl border border-white/10" data-lenis-prevent>
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.15em] text-white/60">
              <tr>
                <th className="px-4 py-3 font-semibold">Applicant</th>
                <th className="px-4 py-3 font-semibold">Idea</th>
                <th className="px-4 py-3 font-semibold">University / org</th>
                <th className="px-4 py-3 font-semibold">Lang</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((r) => (
                <tr key={r.id} className="group relative hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/applications/${r.id}`} className="font-medium text-white after:absolute after:inset-0">
                      {r.fullName}
                    </Link>
                    <span className="block text-xs text-grey">{r.email}</span>
                    <span className="block font-mono text-[10px] text-grey">{r.refCode}</span>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-white/85">
                    <span className="line-clamp-2">{r.ideaTitle}</span>
                  </td>
                  <td className="px-4 py-3 text-white/70">
                    {r.organisation}
                    {r.isSymbiosisStudent && <span className="ml-2 rounded bg-red/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-text">SYMBI</span>}
                  </td>
                  <td className="px-4 py-3 text-white/70">{r.preferredLanguage}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-grey">{fmtDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-white/15 px-4 py-12 text-center text-sm text-grey">
          {filtered ? "Nothing matches these filters." : "No applications yet."}
        </p>
      )}
    </div>
  );
}
