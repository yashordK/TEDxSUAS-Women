import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { listActivity, listActivityActors } from "@/lib/admin/data";
import { ActivityList } from "@/components/admin/activity-list";
import { Card, PageTitle, btnGhost, input } from "@/components/admin/ui";

type SP = Promise<{ actor?: string; type?: string; page?: string }>;

const TYPES = [
  { key: "", label: "Everything" },
  { key: "application", label: "Applications" },
  { key: "query", label: "Queries" },
  { key: "admin", label: "Team access" },
];

export default async function ActivityPage({ searchParams }: { searchParams: SP }) {
  await requireAdmin();
  const sp = await searchParams;
  const actor = sp.actor || undefined;
  const type = TYPES.some((t) => t.key === sp.type) ? sp.type || undefined : undefined;
  const [{ rows, hasMore, page }, actors] = await Promise.all([
    listActivity({ actor, type, page: Number(sp.page) || 1 }),
    listActivityActors(),
  ]);

  const qs = (p: number) => {
    const u = new URLSearchParams();
    if (actor) u.set("actor", actor);
    if (type) u.set("type", type);
    if (p > 1) u.set("page", String(p));
    return `/admin/activity${u.size ? `?${u}` : ""}`;
  };

  return (
    <div className="max-w-4xl space-y-6">
      <PageTitle title="Activity log" sub="Who did what: new applications and questions, reviews, and team changes." />

      <form className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Who</span>
          <select name="actor" defaultValue={actor ?? ""} className={`${input} [&>option]:bg-black`}>
            <option value="">Anyone</option>
            {actors.map((a) => (
              <option key={a.actor} value={a.actor}>
                {a.actor === "public" ? "Visitors (public forms)" : `${a.actorName} (${a.actor})`}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">About</span>
          <select name="type" defaultValue={type ?? ""} className={`${input} [&>option]:bg-black`}>
            {TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={btnGhost}>
          Filter
        </button>
        {(actor || type) && (
          <Link href="/admin/activity" className="pb-2.5 text-sm text-grey hover:text-white">
            Clear
          </Link>
        )}
      </form>

      <Card>
        <ActivityList rows={rows} />
      </Card>

      {(page > 1 || hasMore) && (
        <div className="flex justify-between text-sm">
          {page > 1 ? <Link href={qs(page - 1)} className="text-grey hover:text-white">← Newer</Link> : <span />}
          {hasMore && <Link href={qs(page + 1)} className="text-grey hover:text-white">Older →</Link>}
        </div>
      )}
    </div>
  );
}
