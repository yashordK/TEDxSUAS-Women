import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { getOverview, STATUS_LABEL, type ApplicationStatus } from "@/lib/admin/data";
import { Card, PageTitle, StatusBadge, fmtDate } from "@/components/admin/ui";

export default async function OverviewPage() {
  const admin = await requireAdmin();
  const o = await getOverview();
  const max = Math.max(1, ...o.series.map((s) => s.n));
  const hour = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()));
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const stats = [
    { label: "Applications", value: o.total, sub: `${o.thisWeek} this week`, href: "/admin/applications" },
    { label: "Pending review", value: o.statusCounts.new, sub: "Waiting for a decision", href: "/admin/applications?status=new", accent: o.statusCounts.new > 0 },
    { label: "Shortlisted", value: o.statusCounts.shortlisted, sub: `${o.statusCounts.confirmed} confirmed`, href: "/admin/applications?status=shortlisted" },
    { label: "Open queries", value: o.openQueries, sub: "Questions from visitors", href: "/admin/queries", accent: o.openQueries > 0 },
  ];

  return (
    <div className="space-y-8">
      <PageTitle title={`${greet}, ${admin.name.split(" ")[0]}`} sub="Here's where the call for speakers stands." />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group">
            <Card className={`h-full transition-colors group-hover:border-white/25 ${s.accent ? "border-red/50" : ""}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{s.label}</p>
              <p className={`mt-3 text-4xl font-bold tabular-nums ${s.accent ? "text-red-text" : "text-white"}`}>{s.value}</p>
              <p className="mt-1 text-xs text-grey">{s.sub}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="text-sm font-semibold text-white">Applications, last 14 days</h2>
          <div className="mt-6 flex h-40 items-end gap-1.5" role="img" aria-label="Daily applications over the last 14 days">
            {o.series.map((s) => (
              <div key={s.day} className="group relative flex h-full flex-1 flex-col justify-end">
                <div
                  className="w-full rounded-t bg-red/70 transition-colors group-hover:bg-red"
                  style={{ height: `${Math.max(s.n ? 6 : 2, (s.n / max) * 100)}%`, opacity: s.n ? 1 : 0.25 }}
                />
                <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-black group-hover:block">
                  {s.n} · {s.day.slice(5)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-grey">
            <span>{o.series[0]?.day.slice(5)}</span>
            <span>Today</span>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-white">By status</h2>
          <ul className="mt-5 space-y-3">
            {(Object.keys(o.statusCounts) as ApplicationStatus[]).map((s) => (
              <li key={s}>
                <Link href={`/admin/applications?status=${s}`} className="flex items-center justify-between gap-3 text-sm hover:text-white">
                  <span className="text-white/80">{STATUS_LABEL[s]}</span>
                  <span className="font-semibold tabular-nums text-white">{o.statusCounts[s]}</span>
                </Link>
                <div className="mt-1.5 h-1 rounded bg-white/10">
                  <div className="h-1 rounded bg-red" style={{ width: `${o.total ? (o.statusCounts[s] / o.total) * 100 : 0}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Breakdown
          title="Who's applying"
          rows={[
            { label: "Symbiosis students", n: o.symbiosis.yes },
            { label: "Other students", n: o.symbiosis.otherStudents },
            { label: "Non-students", n: o.symbiosis.nonStudents },
          ]}
          total={o.total}
        />
        <Breakdown title="Talk language" rows={o.languages} total={o.total} />
        <Breakdown title="Occupation" rows={o.occupations.slice(0, 5)} total={o.total} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Latest applications</h2>
            <Link href="/admin/applications" className="text-xs text-red-text hover:text-white">
              View all
            </Link>
          </div>
          {o.recent.length ? (
            <ul className="mt-4 divide-y divide-white/10">
              {o.recent.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/applications/${r.id}`} className="flex items-center justify-between gap-4 py-3 hover:text-white">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-white">{r.fullName}</span>
                      <span className="block truncate text-xs text-grey">{r.ideaTitle}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge status={r.status} />
                      <span className="text-[10px] text-grey">{fmtDate(r.createdAt)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No applications yet. They&apos;ll appear here the moment someone applies.</Empty>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Open queries</h2>
            <Link href="/admin/queries" className="text-xs text-red-text hover:text-white">
              View all
            </Link>
          </div>
          {o.recentQueries.length ? (
            <ul className="mt-4 divide-y divide-white/10">
              {o.recentQueries.map((q) => (
                <li key={q.id} className="py-3">
                  <p className="text-sm font-medium text-white">{q.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-grey">{q.message}</p>
                  <p className="mt-1 text-[10px] text-grey">{fmtDate(q.createdAt)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No open questions. Nice.</Empty>
          )}
        </Card>
      </div>
    </div>
  );
}

function Breakdown({ title, rows, total }: { title: string; rows: { label: string; n: number }[]; total: number }) {
  return (
    <Card>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {total ? (
        <ul className="mt-4 space-y-2.5">
          {rows.map((r) => (
            <li key={r.label} className="text-sm">
              <div className="flex justify-between gap-3">
                <span className="truncate text-white/80">{r.label}</span>
                <span className="tabular-nums text-white">
                  {r.n} <span className="text-grey">· {Math.round((r.n / total) * 100)}%</span>
                </span>
              </div>
              <div className="mt-1 h-1 rounded bg-white/10">
                <div className="h-1 rounded bg-white/60" style={{ width: `${(r.n / total) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>Nothing to show yet.</Empty>
      )}
    </Card>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 rounded-lg border border-dashed border-white/15 px-4 py-6 text-center text-sm text-grey">{children}</p>;
}
