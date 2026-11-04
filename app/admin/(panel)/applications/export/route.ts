import { NextResponse, type NextRequest } from "next/server";
import { getAdmin } from "@/lib/admin/auth";
import { exportApplications } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

const COLUMNS: [string, string][] = [
  ["refCode", "Reference"],
  ["createdAt", "Received"],
  ["status", "Status"],
  ["fullName", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["phoneIsWhatsapp", "WhatsApp"],
  ["birthdate", "Date of birth"],
  ["occupation", "Occupation"],
  ["organisation", "University / organisation"],
  ["isSymbiosisStudent", "Symbiosis student"],
  ["programme", "Programme"],
  ["yearOfStudy", "Year"],
  ["prn", "PRN"],
  ["ideaTitle", "Idea title"],
  ["idea", "Idea"],
  ["whyThisIdea", "Why this idea"],
  ["themeConnection", "Theme connection"],
  ["personalImpact", "Personal impact"],
  ["priorExperience", "Prior experience"],
  ["preferredLanguage", "Language"],
  ["demoVideoUrl", "Demo video"],
  ["notes", "Organiser notes"],
  ["updatedBy", "Last updated by"],
];

function cell(v: unknown) {
  if (v === null || v === undefined) return "";
  const s = v instanceof Date ? v.toISOString() : typeof v === "boolean" ? (v ? "Yes" : "No") : String(v);
  // Neutralise spreadsheet formulas, then quote.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });
  const p = req.nextUrl.searchParams;
  const rows = await exportApplications({
    q: p.get("q") ?? undefined,
    status: p.get("status") ?? undefined,
    symbiosis: p.get("symbiosis") ?? undefined,
  });

  const lines = [
    COLUMNS.map(([, h]) => cell(h)).join(","),
    ...rows.map((r) => COLUMNS.map(([k]) => cell((r as Record<string, unknown>)[k])).join(",")),
  ];
  const stamp = new Date().toISOString().slice(0, 10);
  // BOM so Excel opens UTF-8 (Hindi names etc.) correctly.
  return new NextResponse("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tedxsuas-women-applications-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
