import { STATUS_LABEL, type ApplicationStatus } from "@/lib/admin/status";

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  new: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  shortlisted: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  confirmed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  rejected: "border-white/15 bg-white/5 text-white/60",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function PageTitle({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-white md:text-4xl">{title}</h1>
        {sub && <p className="mt-2 text-sm text-grey">{sub}</p>}
      </div>
      {children}
    </header>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-white/10 bg-white/[0.03] p-5 ${className}`}>{children}</div>;
}

export const fmtDate = (d: Date | string | null | undefined, withTime = true) =>
  d
    ? new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      }).format(new Date(d))
    : "-";

export const btn =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60";
export const btnPrimary = `${btn} bg-red text-white hover:bg-[#ff0a35]`;
export const btnGhost = `${btn} border border-white/20 text-white hover:border-white hover:bg-white/5`;
export const input =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-red focus:outline-none";
