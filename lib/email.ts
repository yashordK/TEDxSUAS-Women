import "server-only";
import { Resend } from "resend";
import { site } from "@/lib/site";
import type { SpeakerApplication } from "@/lib/schemas/speaker";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM ?? "TEDxSUAS Women <onboarding@resend.dev>";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const para = (s: string) => esc(s).replace(/\n/g, "<br>");

async function send(to: string | string[], subject: string, html: string, replyTo?: string) {
  if (!resend) {
    console.info(`[email:stub] to=${[to].flat().join(", ")} subject="${subject}"`);
    return;
  }
  const { error } = await resend.emails.send({ from: FROM, to, subject, html, replyTo });
  if (error) throw new Error(`Resend: ${error.message}`);
}

const shell = (body: string) => `
<div style="background:#050304;padding:32px 0;font-family:Helvetica,Arial,sans-serif;color:#f6eff1">
  <div style="max-width:560px;margin:0 auto;padding:0 24px">
    <p style="margin:0;font-weight:800;font-size:20px"><span style="color:#eb0028">TED<sup>x</sup></span>SUAS Women</p>
    <p style="margin:4px 0 0;font-size:11px;color:#8a8a8a">${esc(site.disclaimer)}</p>
    <div style="height:1px;background:#eb0028;width:56px;margin:24px 0"></div>
    ${body}
    <p style="margin:32px 0 0;font-size:11px;color:#8a8a8a">${esc(site.license)}</p>
  </div>
</div>`;

export async function sendApplicantConfirmation(a: SpeakerApplication, refCode: string) {
  const first = a.fullName.split(" ")[0];
  await send(
    a.email,
    `Your idea is with us · ${refCode}`,
    shell(`
      <h1 style="font-family:Georgia,serif;font-size:28px;margin:0 0 16px">Your idea is with us, ${esc(first)}.</h1>
      <p style="line-height:1.6;color:#cfc4c8">Thank you for applying to speak at ${esc(site.name)}. We've received
      <strong style="color:#fff">“${esc(a.ideaTitle)}”</strong>, and our curation team will read every word.</p>
      <p style="line-height:1.6;color:#cfc4c8">We'll get back to you <strong style="color:#fff">within a month</strong>.
      Keep your reference ID handy if you write to us:</p>
      <p style="font-size:22px;letter-spacing:0.2em;font-weight:700;color:#ff4d5e;margin:20px 0">${refCode}</p>
      <p style="line-height:1.6;color:#cfc4c8">${esc(site.theme.devanagari)}: ${esc(site.theme.tagline.toLowerCase())}.</p>
      <p style="line-height:1.6;color:#8a8a8a;font-size:13px">${esc(site.date.display)} · ${esc(site.venue.display)}</p>`),
    site.organisers[0].email,
  );
}

export async function sendOrganiserNotification(a: SpeakerApplication, refCode: string) {
  const rows: [string, string | undefined][] = [
    ["Name", a.fullName],
    ["Email", a.email],
    ["Phone", `${a.phone}${a.phoneIsWhatsapp ? " (WhatsApp)" : ""}`],
    ["Date of birth", a.birthdate],
    ["Occupation", a.occupation === "Other" ? a.occupationOther : a.occupation],
    ["Organisation", a.organisation],
    ...(a.occupation === "Student"
      ? ([["Symbiosis student", a.isSymbiosisStudent === "yes" ? "Yes" : "No"]] as [string, string][])
      : []),
    ...(a.isSymbiosisStudent === "yes"
      ? ([
          ["Institute", a.institute],
          ["Programme", a.programme],
          ["Year", a.yearOfStudy],
          ["PRN", a.prn],
        ] as [string, string | undefined][])
      : []),
    ["Language", a.preferredLanguage === "Other" ? a.preferredLanguageOther : a.preferredLanguage],
    ["Demo video", a.demoVideoUrl],
  ];
  const long: [string, string | undefined][] = [
    ["The idea", a.idea],
    ["Why this idea", a.whyThisIdea],
    ["Connection to the theme", a.themeConnection],
    ["How it has impacted them", a.personalImpact],
    ["Prior experience", a.priorExperience],
  ];

  await send(
    site.organisers.map((o) => o.email),
    `New speaker application · ${refCode} · ${a.fullName}`,
    shell(`
      <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 4px">${esc(a.ideaTitle)}</h1>
      <p style="margin:0 0 24px;color:#8a8a8a">${refCode}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 12px 6px 0;color:#8a8a8a;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0;color:#fff">${para(v!)}</td></tr>`,
          )
          .join("")}
      </table>
      ${long
        .filter(([, v]) => v)
        .map(
          ([k, v]) =>
            `<h2 style="font-size:12px;letter-spacing:0.3em;text-transform:uppercase;color:#ff4d5e;margin:28px 0 8px">${k}</h2><p style="line-height:1.6;color:#cfc4c8;margin:0">${para(v!)}</p>`,
        )
        .join("")}`),
    a.email,
  );
}
