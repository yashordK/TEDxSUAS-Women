"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { APPLICATION_STATUSES, QUERY_STATUSES } from "@/lib/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import {
  MIN_PASSWORD_LENGTH,
  createSession,
  destroyAllSessionsFor,
  getAdmin,
  destroySession,
  hashPassword,
  initialPassword,
  requireAdmin,
  verifyPassword,
} from "@/lib/admin/auth";
import { logActivity } from "@/lib/admin/activity";
import { STATUS_LABEL } from "@/lib/admin/status";

export type FormState = { ok?: boolean; error?: string; message?: string };

function d() {
  if (!db) throw new Error("DATABASE_URL is not configured");
  return db;
}

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/* --------------------------------- auth --------------------------------- */

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const ip = await clientIp();
  if (!rateLimit(`login-ip:${ip}`, 20, 15 * 60 * 1000).ok || !rateLimit(`login:${email}`, 8, 15 * 60 * 1000).ok) {
    return { error: "Too many sign-in attempts. Wait 15 minutes and try again." };
  }
  if (!db) return { error: "The dashboard isn't connected to the database yet (DATABASE_URL)." };

  const [admin] = await db.select().from(schema.admins).where(eq(schema.admins.email, email)).limit(1);
  // Same message either way so the form doesn't reveal which emails have access.
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return { error: "That email and password don't match." };
  }

  await createSession(admin.id);
  await db.update(schema.admins).set({ lastLoginAt: new Date() }).where(eq(schema.admins.id, admin.id));
  await logActivity(admin, "signed_in", "Signed in");
  redirect("/admin");
}

export async function logout() {
  const me = await getAdmin();
  if (me) await logActivity(me, "signed_out", "Signed out");
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(_: FormState, form: FormData): Promise<FormState> {
  const me = await requireAdmin();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  const [row] = await d().select().from(schema.admins).where(eq(schema.admins.id, me.id)).limit(1);
  if (!row || !(await verifyPassword(current, row.passwordHash))) return { error: "Your current password is incorrect." };
  if (next.length < MIN_PASSWORD_LENGTH) return { error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` };
  if (next !== confirm) return { error: "The new passwords don't match." };
  if (next === current) return { error: "Choose a password different from your current one." };
  let temp: string | null = null;
  try {
    temp = initialPassword();
  } catch {
    /* env not set: skip this check */
  }
  if (temp && next === temp) return { error: "You can't reuse the temporary password." };

  await d()
    .update(schema.admins)
    .set({ passwordHash: await hashPassword(next), mustChangePassword: false })
    .where(eq(schema.admins.id, me.id));
  // Sign out other devices, keep this one.
  await destroyAllSessionsFor(me.id);
  await createSession(me.id);
  await logActivity(me, "password_changed", "Changed their password");

  return { ok: true, message: "Password updated. Other devices have been signed out." };
}

/* ----------------------------- applications ----------------------------- */

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(APPLICATION_STATUSES),
  notes: z.string().max(5000).optional(),
});

export async function updateApplication(_: FormState, form: FormData): Promise<FormState> {
  const me = await requireAdmin();
  const parsed = updateSchema.safeParse({
    id: form.get("id"),
    status: form.get("status"),
    notes: String(form.get("notes") ?? ""),
  });
  if (!parsed.success) return { error: "Couldn't save: invalid status or notes." };
  const { id, status, notes } = parsed.data;
  const A = schema.speakerApplications;

  const [before] = await d()
    .select({ status: A.status, notes: A.notes, refCode: A.refCode, fullName: A.fullName })
    .from(A)
    .where(eq(A.id, id))
    .limit(1);
  if (!before) return { error: "That application no longer exists." };
  const newNotes = notes?.trim() || null;

  await d()
    .update(A)
    .set({ status, notes: newNotes, updatedAt: new Date(), updatedBy: me.email })
    .where(eq(A.id, id));

  const who = `${before.fullName} (${before.refCode})`;
  const target = { type: "application" as const, id };
  if (before.status !== status) {
    await logActivity(
      me,
      "status_changed",
      `Changed ${who} from ${STATUS_LABEL[before.status]} to ${STATUS_LABEL[status]}`,
      target,
    );
  }
  if ((before.notes ?? null) !== newNotes) {
    await logActivity(me, "notes_edited", `Edited notes on ${who}`, target);
  }

  revalidatePath("/admin", "layout");
  return { ok: true, message: "Saved." };
}

/* -------------------------------- queries ------------------------------- */

export async function setQueryStatus(form: FormData) {
  const me = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");
  if (!z.string().uuid().safeParse(id).success || !(QUERY_STATUSES as readonly string[]).includes(status)) return;

  await d()
    .update(schema.queries)
    .set(
      status === "resolved"
        ? { status: "resolved", resolvedAt: new Date(), resolvedBy: me.email }
        : { status: "open", resolvedAt: null, resolvedBy: null },
    )
    .where(eq(schema.queries.id, id));
  const [q] = await d().select({ name: schema.queries.name }).from(schema.queries).where(eq(schema.queries.id, id)).limit(1);
  if (q) {
    await logActivity(
      me,
      status === "resolved" ? "query_resolved" : "query_reopened",
      `${status === "resolved" ? "Resolved" : "Reopened"} the question from ${q.name}`,
      { type: "query", id },
    );
  }
  revalidatePath("/admin", "layout");
}

/* --------------------------------- team --------------------------------- */

const addAdminSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  name: z.string().trim().min(2, "Enter their name").max(120),
});

export async function addAdmin(_: FormState, form: FormData): Promise<FormState> {
  const me = await requireAdmin();
  const parsed = addAdminSchema.safeParse({ email: form.get("email"), name: form.get("name") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let temp: string;
  try {
    temp = initialPassword();
  } catch {
    return { error: "ADMIN_INITIAL_PASSWORD isn't set on the server, so new accounts can't be created yet." };
  }

  const inserted = await d()
    .insert(schema.admins)
    .values({ ...parsed.data, passwordHash: await hashPassword(temp), mustChangePassword: true })
    .onConflictDoNothing()
    .returning({ id: schema.admins.id });
  if (!inserted.length) return { error: `${parsed.data.email} already has access.` };
  await logActivity(me, "admin_added", `Gave access to ${parsed.data.name} (${parsed.data.email})`, {
    type: "admin",
    id: inserted[0].id,
  });

  revalidatePath("/admin/team");
  return {
    ok: true,
    message: `Added ${parsed.data.name}. They sign in with the temporary password and can set their own from My account.`,
  };
}

export async function resetAdmin(form: FormData) {
  const me = await requireAdmin();
  const id = String(form.get("id") ?? "");
  if (!z.string().uuid().safeParse(id).success || id === me.id) return;
  const [target] = await d()
    .update(schema.admins)
    .set({ passwordHash: await hashPassword(initialPassword()), mustChangePassword: true })
    .where(eq(schema.admins.id, id))
    .returning({ name: schema.admins.name, email: schema.admins.email });
  await destroyAllSessionsFor(id);
  if (target) {
    await logActivity(me, "admin_reset", `Reset ${target.name}'s password to the temporary one`, { type: "admin", id });
  }
  revalidatePath("/admin/team");
}

export async function removeAdmin(form: FormData) {
  const me = await requireAdmin();
  const id = String(form.get("id") ?? "");
  if (!z.string().uuid().safeParse(id).success || id === me.id) return; // can't remove yourself
  // Never remove the last remaining admin.
  const others = await d().select({ id: schema.admins.id }).from(schema.admins).where(ne(schema.admins.id, id)).limit(1);
  if (!others.length) return;
  const [gone] = await d()
    .delete(schema.admins)
    .where(and(eq(schema.admins.id, id), ne(schema.admins.id, me.id)))
    .returning({ name: schema.admins.name, email: schema.admins.email });
  if (gone) await logActivity(me, "admin_removed", `Removed access for ${gone.name} (${gone.email})`, { type: "admin", id });
  revalidatePath("/admin/team");
}
