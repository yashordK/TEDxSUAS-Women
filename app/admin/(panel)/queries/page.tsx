import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { listQueries } from "@/lib/admin/data";
import { setQueryStatus } from "@/app/admin/actions";
import { Card, PageTitle, btnGhost, btnPrimary, fmtDate } from "@/components/admin/ui";

type SP = Promise<{ status?: string }>;
const TABS = [
  { key: "open", label: "Open" },
  { key: "resolved", label: "Resolved" },
  { key: "all", label: "All" },
];

export default async function QueriesPage({ searchParams }: { searchParams: SP }) {
  await requireAdmin();
  const { status = "open" } = await searchParams;
  const rows = await listQueries(status === "all" ? undefined : status);

  return (
    <div className="space-y-6">
      <PageTitle title="Queries" sub="Questions sent from the “Ask us anything” form on the site." />

      <nav aria-label="Filter queries" className="flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/queries?status=${t.key}`}
            aria-current={status === t.key ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              status === t.key ? "bg-white text-black" : "border border-white/20 text-white/70 hover:text-white"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {rows.length ? (
        <ul className="space-y-4">
          {rows.map((q) => (
            <li key={q.id}>
              <Card className={q.status === "open" ? "border-l-2 border-l-red" : "opacity-80"}>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-white">
                      {q.name} <span className="font-normal text-grey">· {q.email}</span>
                    </p>
                    <p className="mt-1 text-xs text-grey">{fmtDate(q.createdAt)}</p>
                    <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-white/90">{q.message}</p>
                    {q.status === "resolved" && (
                      <p className="mt-4 text-xs text-grey">
                        Resolved by {q.resolvedBy} · {fmtDate(q.resolvedAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <a
                      href={`mailto:${q.email}?subject=${encodeURIComponent("Re: your question to TEDxSUAS Women")}&body=${encodeURIComponent(`Hi ${q.name.split(" ")[0]},\n\n\n\n> ${q.message.replace(/\n/g, "\n> ")}`)}`}
                      className={btnGhost}
                    >
                      Reply
                    </a>
                    <form action={setQueryStatus}>
                      <input type="hidden" name="id" value={q.id} />
                      <input type="hidden" name="status" value={q.status === "open" ? "resolved" : "open"} />
                      <button type="submit" className={q.status === "open" ? btnPrimary : btnGhost}>
                        {q.status === "open" ? "Mark resolved" : "Reopen"}
                      </button>
                    </form>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-white/15 px-4 py-12 text-center text-sm text-grey">
          {status === "open" ? "No open queries. Everyone's been answered." : "Nothing here yet."}
        </p>
      )}
    </div>
  );
}
