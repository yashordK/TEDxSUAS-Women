"use server";

import { headers } from "next/headers";
import { speakerApplicationSchema } from "@/lib/schemas/speaker";
import { saveApplication } from "@/lib/applications";
import { sendApplicantConfirmation, sendOrganiserNotification } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export type SubmitResult =
  | { ok: true; refCode: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function submitSpeakerApplication(input: unknown): Promise<SubmitResult> {
  // Honeypot filled: pretend success so bots learn nothing, and store nothing.
  const honeypot = (input as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: true, refCode: "TXSW-27-0000" };
  }

  const parsed = speakerApplicationSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { ok: false, error: "Some answers need another look.", fieldErrors };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const limit = rateLimit(`speak:${ip}`);
  if (!limit.ok) {
    return { ok: false, error: `Too many submissions from this network. Please try again in ${limit.retryInMin} minutes.` };
  }

  let refCode: string;
  try {
    refCode = await saveApplication(parsed.data);
  } catch (err) {
    console.error("[speak] save failed", err);
    return { ok: false, error: "We couldn't save your application just now. Please try again in a moment." };
  }

  // Emails are best-effort: the application is already safely stored.
  const results = await Promise.allSettled([
    sendApplicantConfirmation(parsed.data, refCode),
    sendOrganiserNotification(parsed.data, refCode),
  ]);
  results.forEach((r) => r.status === "rejected" && console.error("[speak] email failed", r.reason));

  return { ok: true, refCode };
}
