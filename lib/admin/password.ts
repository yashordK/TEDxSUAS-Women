import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

// No "server-only" here so scripts/admin.ts can reuse it; never import from client code.
const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const MIN_PASSWORD_LENGTH = 10;

/** Format: scrypt$<salt b64>$<hash b64>. */
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algo, saltB64, hashB64] = stored.split("$");
  if (algo !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length);
  return timingSafeEqual(actual, expected);
}

/** Temporary password every new or reset organiser starts with. Set in env. */
export function initialPassword() {
  const pw = process.env.ADMIN_INITIAL_PASSWORD?.trim();
  if (!pw || pw.length < 8) throw new Error("ADMIN_INITIAL_PASSWORD is missing or shorter than 8 characters");
  return pw;
}
