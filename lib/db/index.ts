import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/** Null when DATABASE_URL is not set (local dev without Neon); callers fall back. */
export const db = process.env.DATABASE_URL ? drizzle(neon(process.env.DATABASE_URL), { schema }) : null;

export { schema };
