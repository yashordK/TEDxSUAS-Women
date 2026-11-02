import "server-only";
import { db, schema } from "@/lib/db";

type Actor = { email: string; name: string } | "public";

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
      actor: actor === "public" ? "public" : actor.email,
      actorName: actor === "public" ? "Visitor" : actor.name,
      action,
      summary,
      targetType: target?.type ?? null,
      targetId: target?.id ?? null,
    });
  } catch (err) {
    console.error("[activity] log failed", err);
  }
}
