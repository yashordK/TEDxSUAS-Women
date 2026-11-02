import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { and, eq, gt, lt } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export const SESSION_COOKIE = "txsw_admin";
const SESSION_DAYS = 7;
export { hashPassword, verifyPassword, initialPassword, MIN_PASSWORD_LENGTH } from "./password";

/* ------------------------------ sessions ----------------------------- */

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

function requireDb() {
  if (!db) throw new Error("DATABASE_URL is not configured");
  return db;
}

export async function createSession(adminId: string) {
  const d = requireDb();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await d.insert(schema.adminSessions).values({ tokenHash: sha256(token), adminId, expiresAt });
  // Opportunistic cleanup of expired sessions.
  await d.delete(schema.adminSessions).where(lt(schema.adminSessions.expiresAt, new Date()));

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token && db) await db.delete(schema.adminSessions).where(eq(schema.adminSessions.tokenHash, sha256(token)));
  jar.delete(SESSION_COOKIE);
}

/** Ends every session for an admin (password reset / access removed). */
export async function destroyAllSessionsFor(adminId: string) {
  await requireDb().delete(schema.adminSessions).where(eq(schema.adminSessions.adminId, adminId));
}

export type CurrentAdmin = {
  id: string;
  email: string;
  name: string;
  mustChangePassword: boolean;
};

/** The signed-in admin for this request, or null. Cached per request. */
export const getAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  if (!db) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await db
    .select({
      id: schema.admins.id,
      email: schema.admins.email,
      name: schema.admins.name,
      mustChangePassword: schema.admins.mustChangePassword,
    })
    .from(schema.adminSessions)
    .innerJoin(schema.admins, eq(schema.admins.id, schema.adminSessions.adminId))
    .where(and(eq(schema.adminSessions.tokenHash, sha256(token)), gt(schema.adminSessions.expiresAt, new Date())))
    .limit(1);
  return rows[0] ?? null;
});

/**
 * Guard for every admin page and server action. Redirects to login when signed
 * out, and to the password page while a temporary password is still in use.
 */
export async function requireAdmin(opts: { allowTemporaryPassword?: boolean } = {}) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.mustChangePassword && !opts.allowTemporaryPassword) redirect("/admin/account?first=1");
  return admin;
}
