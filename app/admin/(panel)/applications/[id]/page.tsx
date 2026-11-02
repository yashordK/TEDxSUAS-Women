import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getApplication } from "@/lib/admin/data";
import { ReviewForm } from "@/components/admin/forms";
import { Card, StatusBadge, btnGhost, fmtDate } from "@/components/admin/ui";

const age = (dob: string) => {
  const b = new Date(dob);
  const n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--;
  return a;
};
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const a = await getApplication(id);
  if (!a) notFound();

  const phoneDigits = a.phone.replace(/[^\d]/g, "");
  const wa = phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;

  const about: [string, React.ReactNode][] = [
    ["Email", <a key="e" href={`mailto:${a.email}`} className="text-red-text hover:text-white">{a.email}</a>],
    [
      "Phone",
      <span key="p" className="flex flex-wrap items-center gap-3">
        <a href={`tel:${a.phone}`} className="hover:text-white">{a.phone}</a>
        {a.phoneIsWhatsapp && (
          <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/25">
            WhatsApp
          </a>
        )}
      </span>,
    ],
    ["Date of birth", `${fmtDate(a.birthdate, false)} (age ${age(a.birthdate)})`],
    ["Occupation", a.occupation],
    [a.occupation === "Student" ? "University" : "Organisation", a.organisation],
    ...(a.isSymbiosisStudent !== null ? ([["Symbiosis student", a.isSymbiosisStudent ? "Yes" : "No"]] as [string, string][]) : []),
    ...(a.isSymbiosisStudent
      ? ([
          ["Programme", a.programme],
          ["Year", a.yearOfStudy],
          ["PRN", a.prn],
        ] as [string, string][])
      : []),
    ["Talk language", a.preferredLanguage],
    [
      "Demo video",
      <a key="v" href={a.demoVideoUrl} target="_blank" rel="noreferrer" className="break-all text-red-text hover:text-white">
        {a.demoVideoUrl}
      </a>,
    ],
  ];

  const long: [string, string | null][] = [
    ["The idea", a.idea],
    ["Why this idea", a.whyThisIdea],
    ["Connection to the theme", a.themeConnection],
    ["How it has impacted them", a.personalImpact],
    ["Prior speaking experience", a.priorExperience || "None mentioned (first time)"],
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin/applications" className="text-sm text-grey hover:text-white">
        ← All applications
      </Link>

      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs text-grey">{a.refCode}</p>
          <h1 className="mt-1 font-[family-name:var(--font-playfair)] text-3xl font-bold text-white md:text-4xl">{a.ideaTitle}</h1>
          <p className="mt-2 text-white/80">
            {a.fullName} <span className="text-grey">· received {fmtDate(a.createdAt)}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={a.status} />
          <a href={`mailto:${a.email}?subject=${encodeURIComponent(`Your TEDxSUAS Women application (${a.refCode})`)}`} className={btnGhost}>
            Email applicant
          </a>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Applicant</h2>
            <dl className="mt-4 divide-y divide-white/10">
              {about.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-2.5 text-sm sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <dt className="text-grey">{k}</dt>
                  <dd className="text-white">{v || "-"}</dd>
                </div>
              ))}
            </dl>
          </Card>

          {long.map(([k, v]) => (
            <Card key={k}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-red-text">{k}</h2>
                {v && <span className="text-[10px] text-grey">{words(v)} words</span>}
              </div>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-white/90">{v}</p>
            </Card>
          ))}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-8 xl:self-start">
          <Card>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Review</h2>
            <ReviewForm key={`${a.status}:${a.updatedAt?.toISOString() ?? ""}`} id={a.id} status={a.status} notes={a.notes ?? ""} />
            {a.updatedBy && (
              <p className="mt-4 text-xs text-grey">
                Last updated by {a.updatedBy} · {fmtDate(a.updatedAt)}
              </p>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
