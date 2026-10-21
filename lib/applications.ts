import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { db, schema } from "@/lib/db";
import type { SpeakerApplication } from "@/lib/schemas/speaker";
import type { NewSpeakerApplicationRow } from "@/lib/db/schema";

/** TXSW-27-XXXX, no look-alike characters (0/O, 1/I). */
export function makeRefCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(4);
  const tail = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `TXSW-27-${tail}`;
}

export function toRow(a: SpeakerApplication, refCode: string): NewSpeakerApplicationRow {
  const student = a.occupation === "Student";
  const symbi = student && a.isSymbiosisStudent === "yes";
  return {
    refCode,
    fullName: a.fullName,
    email: a.email,
    birthdate: a.birthdate,
    phone: a.phone,
    phoneIsWhatsapp: a.phoneIsWhatsapp,
    occupation: a.occupation === "Other" ? `Other: ${a.occupationOther}` : a.occupation,
    organisation: a.organisation,
    isSymbiosisStudent: student ? a.isSymbiosisStudent === "yes" : null,
    institute: symbi ? a.organisation : null, // Symbiosis students' university is their institute
    programme: symbi ? a.programme || null : null,
    yearOfStudy: symbi ? a.yearOfStudy || null : null,
    prn: symbi ? a.prn || null : null,
    ideaTitle: a.ideaTitle,
    idea: a.idea,
    whyThisIdea: a.whyThisIdea,
    themeConnection: a.themeConnection,
    personalImpact: a.personalImpact,
    priorExperience: a.priorExperience || null,
    preferredLanguage: a.preferredLanguage,
    demoVideoUrl: a.demoVideoUrl,
    consentOriginal: a.consentOriginal,
    consentContact: a.consentContact,
  };
}

const DEV_STORE = path.join(process.cwd(), ".data", "speaker-applications.json");

/** Inserts the application; retries once on the (unlikely) ref-code collision. */
export async function saveApplication(a: SpeakerApplication): Promise<string> {
  if (db) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const refCode = makeRefCode();
      try {
        await db.insert(schema.speakerApplications).values(toRow(a, refCode));
        return refCode;
      } catch (err) {
        if (attempt < 2 && String(err).includes("ref_code")) continue;
        throw err;
      }
    }
  }

  if (process.env.NODE_ENV === "production") {
    // Shows in Vercel → Logs. Fix: add DATABASE_URL in Project Settings → Environment Variables, then redeploy.
    throw new Error("DATABASE_URL is missing or malformed in this deployment's environment variables");
  }

  // Local development without Neon: append to a git-ignored JSON file.
  const refCode = makeRefCode();
  await mkdir(path.dirname(DEV_STORE), { recursive: true });
  const existing = JSON.parse(await readFile(DEV_STORE, "utf8").catch(() => "[]")) as unknown[];
  existing.push({ id: randomUUID(), ...toRow(a, refCode), status: "new", createdAt: new Date().toISOString() });
  await writeFile(DEV_STORE, JSON.stringify(existing, null, 2));
  console.info(`[speak] DATABASE_URL unset: stored ${refCode} in .data/speaker-applications.json`);
  return refCode;
}
