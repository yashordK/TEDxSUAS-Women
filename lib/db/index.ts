import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Tolerates the usual copy-paste slips in hosting dashboards: surrounding
 * quotes, stray spaces, or the `psql '...'` wrapper Neon's Connect dialog offers.
 */
function readDatabaseUrl() {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return null;
  const url = raw.replace(/^psql\s+/, "").replace(/^['"]|['"]$/g, "").trim();
  if (!/^postgres(ql)?:\/\//.test(url)) {
    console.error("[db] DATABASE_URL is set but is not a postgres:// connection string");
    return null;
  }
  return url;
}

const url = readDatabaseUrl();

/** Null when DATABASE_URL is missing or malformed; callers fall back or report it. */
export const db = url ? drizzle(neon(url), { schema }) : null;

export { schema };
