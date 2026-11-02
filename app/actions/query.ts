"use server";

import { headers } from "next/headers";
import { db, schema } from "@/lib/db";
import { querySchema } from "@/lib/schemas/query";
import { rateLimit } from "@/lib/rate-limit";
import { sendQueryNotification } from "@/lib/email";
import { logActivity } from "@/lib/admin/activity";

export type QueryResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function submitQuery(input: unknown): Promise<QueryResult> {
  const hp = (input as { website?: unknown } | null)?.website;
  if (typeof hp === "string" && hp.trim() !== "") return { ok: true };

  const parsed = querySchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!rateLimit(`query:${ip}`, 5).ok) {
    return { ok: false, error: "You've sent several messages already. Please try again in a while." };
  }

  if (!db) {
    console.error("[query] DATABASE_URL missing; query not stored");
    return { ok: false, error: "We couldn't send your message just now. Please email the organisers directly." };
  }

  const { name, email, message } = parsed.data;
  try {
    const [row] = await db.insert(schema.queries).values({ name, email, message }).returning({ id: schema.queries.id });
    await logActivity({ visitor: name }, "query_raised", `asked a question (${email})`, { type: "query", id: row.id });
  } catch (err) {
    console.error("[query] save failed", err);
    return { ok: false, error: "We couldn't send your message just now. Please try again in a moment." };
  }

  sendQueryNotification({ name, email, message }).catch((e) => console.error("[query] email failed", e));
  return { ok: true };
}
