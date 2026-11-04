import "server-only";
import { db, schema } from "@/lib/db";

/** An organiser, or a visitor using a public form (named as they entered it). */
type Actor = { email: string; name: string } | { visitor: string };

/** Records an entry in the activity log. Never throws: logging must not break the action. */
export async function logActivity(
  actor: Actor,
  action: string,
  summary: string,
  target?: { type: "application" | "query" | "admin"; id: string },
) {
  if (!db) return;
  try {
    await db.insert(schema.activityLog).values({
      actor: "visitor" in actor ? "public" : actor.email,
      actorName: "visitor" in actor ? actor.visitor : actor.name,
      action,
      summary,
      targetType: target?.type ?? null,
      targetId: target?.id ?? null,
    });
  } catch (err) {
    console.error("[activity] log failed", err);
  }
}
