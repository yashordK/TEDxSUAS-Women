import "server-only";
import { and, count, desc, eq, gte, ilike, or, sql, type SQL } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { APPLICATION_STATUSES, QUERY_STATUSES } from "@/lib/db/schema";
import { requireAdmin } from "./auth";

const A = schema.speakerApplications;
const Q = schema.queries;

function dbOrThrow() {
  if (!db) throw new Error("DATABASE_URL is not configured");
  return db;
}

import type { ApplicationStatus, QueryStatus } from "./status";
export { STATUS_LABEL, type ApplicationStatus, type QueryStatus } from "./status";

/* ------------------------------ overview ------------------------------ */

export async function getOverview() {
  await requireAdmin();
  const d = dbOrThrow();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [byStatus, [{ total }], [{ thisWeek }], bySymbi, byLang, byOcc, perDay, recent, [{ openQueries }], recentQueries] =
    await Promise.all([
      d.select({ status: A.status, n: count() }).from(A).groupBy(A.status),
      d.select({ total: count() }).from(A),
      d.select({ thisWeek: count() }).from(A).where(gte(A.createdAt, weekAgo)),
      d
        .select({ symbi: A.isSymbiosisStudent, n: count() })
        .from(A)
        .groupBy(A.isSymbiosisStudent),
      d.select({ lang: A.preferredLanguage, n: count() }).from(A).groupBy(A.preferredLanguage),
      d.select({ occ: A.occupation, n: count() }).from(A).groupBy(A.occupation).orderBy(desc(count())),
      d
        .select({ day: sql<string>`to_char(${A.createdAt} at time zone 'Asia/Kolkata', 'YYYY-MM-DD')`, n: count() })
        .from(A)
        .where(gte(A.createdAt, new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)))
        .groupBy(sql`1`)
        .orderBy(sql`1`),
      d
        .select({ id: A.id, refCode: A.refCode, fullName: A.fullName, ideaTitle: A.ideaTitle, status: A.status, createdAt: A.createdAt })
        .from(A)
        .orderBy(desc(A.createdAt))
        .limit(6),
      d.select({ openQueries: count() }).from(Q).where(eq(Q.status, "open")),
      d
        .select({ id: Q.id, name: Q.name, message: Q.message, createdAt: Q.createdAt })
        .from(Q)
        .where(eq(Q.status, "open"))
        .orderBy(desc(Q.createdAt))
        .limit(4),
    ]);

  const statusCounts = Object.fromEntries(APPLICATION_STATUSES.map((s) => [s, 0])) as Record<ApplicationStatus, number>;
  byStatus.forEach((r) => (statusCounts[r.status as ApplicationStatus] = Number(r.n)));

  // 14-day series with zero-filled gaps (IST days)
  const series: { day: string; n: number }[] = [];
  const map = new Map(perDay.map((r) => [r.day, Number(r.n)]));
  for (let i = 13; i >= 0; i--) {
    const dt = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(dt);
    series.push({ day, n: map.get(day) ?? 0 });
  }

  return {
    total: Number(total),
    thisWeek: Number(thisWeek),
    statusCounts,
    symbiosis: {
      yes: Number(bySymbi.find((r) => r.symbi === true)?.n ?? 0),
      otherStudents: Number(bySymbi.find((r) => r.symbi === false)?.n ?? 0),
      nonStudents: Number(bySymbi.find((r) => r.symbi === null)?.n ?? 0),
    },
    languages: byLang.map((r) => ({ label: r.lang, n: Number(r.n) })),
    occupations: byOcc.map((r) => ({ label: r.occ, n: Number(r.n) })),
    series,
    recent,
    openQueries: Number(openQueries),
    recentQueries,
  };
}

/* ---------------------------- applications ---------------------------- */

export type ApplicationFilters = { q?: string; status?: string; symbiosis?: string };

function applicationWhere(f: ApplicationFilters): SQL | undefined {
  const parts: SQL[] = [];
  if (f.status && (APPLICATION_STATUSES as readonly string[]).includes(f.status)) {
    parts.push(eq(A.status, f.status as ApplicationStatus));
  }
  if (f.symbiosis === "yes") parts.push(eq(A.isSymbiosisStudent, true));
  if (f.q?.trim()) {
    const like = `%${f.q.trim()}%`;
    parts.push(
      or(
        ilike(A.fullName, like),
        ilike(A.email, like),
        ilike(A.refCode, like),
        ilike(A.ideaTitle, like),
        ilike(A.organisation, like),
        ilike(A.phone, like),
      )!,
    );
  }
  return parts.length ? and(...parts) : undefined;
}

export async function listApplications(f: ApplicationFilters) {
  await requireAdmin();
  return dbOrThrow()
    .select({
      id: A.id,
      refCode: A.refCode,
      fullName: A.fullName,
      email: A.email,
      phone: A.phone,
      organisation: A.organisation,
      isSymbiosisStudent: A.isSymbiosisStudent,
      ideaTitle: A.ideaTitle,
      preferredLanguage: A.preferredLanguage,
      status: A.status,
      createdAt: A.createdAt,
    })
    .from(A)
    .where(applicationWhere(f))
    .orderBy(desc(A.createdAt));
}

/** Full rows for CSV export (same filters as the table). */
export async function exportApplications(f: ApplicationFilters) {
  await requireAdmin();
  return dbOrThrow().select().from(A).where(applicationWhere(f)).orderBy(desc(A.createdAt));
}

export async function getApplication(id: string) {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await dbOrThrow().select().from(A).where(eq(A.id, id)).limit(1);
  return rows[0] ?? null;
}

/* ------------------------------- queries ------------------------------ */

export async function listQueries(status?: string) {
  await requireAdmin();
  const where = status && (QUERY_STATUSES as readonly string[]).includes(status) ? eq(Q.status, status as QueryStatus) : undefined;
  return dbOrThrow().select().from(Q).where(where).orderBy(desc(Q.createdAt));
}

/* ------------------------------- admins ------------------------------- */

export async function listAdmins() {
  await requireAdmin();
  return dbOrThrow()
    .select({
      id: schema.admins.id,
      email: schema.admins.email,
      name: schema.admins.name,
      mustChangePassword: schema.admins.mustChangePassword,
      lastLoginAt: schema.admins.lastLoginAt,
      createdAt: schema.admins.createdAt,
    })
    .from(schema.admins)
    .orderBy(schema.admins.createdAt);
}

/** Small counts for the sidebar badges. */
export async function getNavCounts() {
  const d = dbOrThrow();
  const [[{ pending }], [{ open }]] = await Promise.all([
    d.select({ pending: count() }).from(A).where(eq(A.status, "new")),
    d.select({ open: count() }).from(Q).where(eq(Q.status, "open")),
  ]);
  return { pending: Number(pending), openQueries: Number(open) };
}

/* ------------------------------ activity ------------------------------ */

const L = schema.activityLog;
export const ACTIVITY_PAGE = 100;

export async function listActivity(opts: { actor?: string; type?: string; page?: number } = {}) {
  await requireAdmin();
  const where: SQL[] = [];
  if (opts.actor) where.push(eq(L.actor, opts.actor));
  if (opts.type) where.push(eq(L.targetType, opts.type));
  const page = Math.max(1, opts.page ?? 1);
  const rows = await dbOrThrow()
    .select()
    .from(L)
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(L.at))
    .limit(ACTIVITY_PAGE + 1)
    .offset((page - 1) * ACTIVITY_PAGE);
  return { rows: rows.slice(0, ACTIVITY_PAGE), hasMore: rows.length > ACTIVITY_PAGE, page };
}

export async function listActivityActors() {
  await requireAdmin();
  // One row per actor; every visitor shares the "public" actor.
  return dbOrThrow()
    .select({ actor: L.actor, actorName: sql<string>`max(${L.actorName})` })
    .from(L)
    .groupBy(L.actor)
    .orderBy(sql`max(${L.actorName})`);
}

export async function activityFor(type: "application" | "query", id: string) {
  await requireAdmin();
  return dbOrThrow()
    .select()
    .from(L)
    .where(and(eq(L.targetType, type), eq(L.targetId, id)))
    .orderBy(desc(L.at));
}
