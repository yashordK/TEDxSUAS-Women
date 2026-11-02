import Link from "next/link";
import type { ActivityRow } from "@/lib/db/schema";
import { fmtDate } from "./ui";

const TONE: Record<string, string> = {
  application_submitted: "bg-sky-400",
  query_raised: "bg-sky-400",
  status_changed: "bg-red",
  query_resolved: "bg-emerald-400",
  admin_added: "bg-amber-400",
  admin_removed: "bg-amber-400",
  admin_reset: "bg-amber-400",
};

function href(r: ActivityRow) {
  if (r.targetType === "application" && r.targetId) return `/admin/applications/${r.targetId}`;
  if (r.targetType === "query") return "/admin/queries?status=all";
  return null;
}

export function ActivityList({ rows, compact = false }: { rows: ActivityRow[]; compact?: boolean }) {
  if (!rows.length) return <p className="text-sm text-grey">Nothing logged yet.</p>;
  return (
    <ol className="divide-y divide-white/10">
      {rows.map((r) => {
        const link = compact ? null : href(r);
        return (
          <li key={r.id} className="flex gap-3 py-3 text-sm">
            <span aria-hidden className={`mt-1.5 size-2 shrink-0 rounded-full ${TONE[r.action] ?? "bg-white/30"}`} />
            <div className="min-w-0 flex-1">
              <p className="text-white">
                <span className="font-semibold">{r.actorName}</span>{" "}
                {link ? (
                  <Link href={link} className="text-white/80 hover:text-white hover:underline">
                    {r.summary}
                  </Link>
                ) : (
                  <span className="text-white/80">{r.summary}</span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-grey">
                {fmtDate(r.at)}
                {r.actor !== "public" && !compact && <> · {r.actor}</>}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
