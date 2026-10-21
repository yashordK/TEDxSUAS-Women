import { z } from "zod";

/**
 * Speaker application. Shared by the form (per-step validation) and the server
 * action (full validation before anything touches the database).
 */

export const OCCUPATIONS = [
  "Student",
  "Working professional",
  "Entrepreneur / Founder",
  "Educator / Academic",
  "Researcher / Scientist",
  "Healthcare professional",
  "Artist / Creative",
  "Homemaker",
  "Other",
] as const;

export const YEARS = ["1st year", "2nd year", "3rd year", "4th year", "5th year", "Postgraduate", "PhD"] as const;
export const LANGUAGES = ["English", "Hindi"] as const;

/**
 * Recognises a Symbiosis institute from what applicants typically type:
 * the full name, or a common short form (SUAS, SIU, SIBM, SIT, SLS, SCMHRD…).
 */
const SYMBIOSIS =
  /symbiosis|\b(suas|siu|sibm|simc|sit|sls|scmhrd|siib|scms|sicsr|sid|sims|simsree|ssbf|ssla|sse|ssss|sihs|scit|ssp|sitm|sidtm|ssca|ssvap)\b/i;
export const looksLikeSymbiosis = (s: string) => SYMBIOSIS.test(s);

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

// Organisers' choice: TEDx rules set no minimum speaker age.
const MIN_AGE = 10;
const todayIso = () => new Date().toISOString().slice(0, 10);

/* ------------------------------ Step 1 ------------------------------ */
export const aboutSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name").max(120),
    email: z.string().trim().toLowerCase().email("Enter a valid email address"),
    birthdate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Enter your date of birth", abort: true })
      .refine((d) => d < todayIso(), { message: "Date of birth must be in the past", abort: true })
      .refine((d) => {
        const dob = new Date(d);
        const cutoff = new Date();
        cutoff.setFullYear(cutoff.getFullYear() - MIN_AGE);
        return dob <= cutoff;
      }, `Applicants must be at least ${MIN_AGE}`),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s-]{10,16}$/, "Enter a valid phone number, ideally your WhatsApp number"),
    phoneIsWhatsapp: z.boolean(),
    occupation: z.enum(OCCUPATIONS, { message: "Choose what best describes you" }),
    occupationOther: optionalText(80),
    organisation: z.string().trim().min(2, "Where do you study or work?").max(160),

    // Students only
    isSymbiosisStudent: z.enum(["yes", "no"]).optional().or(z.literal("")),
    // Symbiosis students only (their institute is the organisation field)
    programme: optionalText(120),
    yearOfStudy: z.enum(YEARS).optional().or(z.literal("")),
    prn: optionalText(30),
  })
  .superRefine((v, ctx) => {
    if (v.occupation === "Other" && !v.occupationOther)
      ctx.addIssue({ code: "custom", path: ["occupationOther"], message: "Tell us your occupation" });

    if (v.occupation !== "Student") return;
    if (!v.isSymbiosisStudent)
      ctx.addIssue({ code: "custom", path: ["isSymbiosisStudent"], message: "Please choose one" });

    if (v.isSymbiosisStudent === "yes" && !looksLikeSymbiosis(v.organisation))
      ctx.addIssue({
        code: "custom",
        path: ["organisation"],
        message: "That doesn't look like a Symbiosis institute. Enter its name, e.g. Symbiosis University of Applied Sciences",
      });
    if (v.isSymbiosisStudent === "no" && looksLikeSymbiosis(v.organisation))
      ctx.addIssue({
        code: "custom",
        path: ["isSymbiosisStudent"],
        message: "Your university looks like a Symbiosis institute. Should this be Yes?",
      });

    if (v.isSymbiosisStudent === "yes") {
      if (!v.programme) ctx.addIssue({ code: "custom", path: ["programme"], message: "Enter your programme" });
      if (!v.yearOfStudy) ctx.addIssue({ code: "custom", path: ["yearOfStudy"], message: "Choose your year" });
      if (!v.prn) ctx.addIssue({ code: "custom", path: ["prn"], message: "Enter your PRN / Enrollment number" });
    }
  });

/* ------------------------------ Step 2 ------------------------------ */
export const IDEA_WORDS = { min: 80, max: 400 } as const;
export const SHORT_WORDS = 200;

const wordBounded = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .refine((s) => words(s) >= min, `${label}: at least ${min} words please`)
    .refine((s) => words(s) <= max, `${label}: keep it under ${max} words`);

export const ideaSchema = z.object({
  ideaTitle: z.string().trim().min(4, "Give your idea a working title").max(120),
  idea: wordBounded(IDEA_WORDS.min, IDEA_WORDS.max, "Your idea"),
  whyThisIdea: wordBounded(30, SHORT_WORDS, "Why this idea"),
  themeConnection: wordBounded(30, SHORT_WORDS, "Connection to the theme"),
  personalImpact: wordBounded(30, SHORT_WORDS, "How it has impacted you"),
});

/* ------------------------------ Step 3 ------------------------------ */
export const experienceSchema = z.object({
  priorExperience: optionalText(2000),
  preferredLanguage: z.enum(LANGUAGES, { message: "Choose Hindi or English" }),
  demoVideoUrl: z
    .string()
    .trim()
    .url("Paste a full link, starting with https://")
    .refine((u) => /^https:\/\//i.test(u), "Use an https:// link"),
});

/* ------------------------------ Step 4 ------------------------------ */
export const consentSchema = z.object({
  consentOriginal: z.literal(true, { message: "Please confirm this is your original idea" }),
  consentContact: z.literal(true, { message: "Please confirm we can contact you" }),
  // Honeypot: checked on the server only (actions.ts), so autofill can never
  // silently block a real person in the browser.
  website: z.string().max(500).optional(),
});

/* ----------------------------- Combined ----------------------------- */
// Object shapes are merged first, then each step's cross-field rules run again.
export const speakerApplicationSchema = z
  .object({
    ...aboutSchema.shape,
    ...ideaSchema.shape,
    ...experienceSchema.shape,
    ...consentSchema.shape,
  })
  .superRefine((v, ctx) => {
    for (const step of [aboutSchema]) {
      const r = step.safeParse(v);
      if (!r.success) r.error.issues.forEach((i) => ctx.addIssue({ ...i, code: "custom" }));
    }
  });

export type SpeakerApplication = z.infer<typeof speakerApplicationSchema>;
export type SpeakerApplicationInput = z.input<typeof speakerApplicationSchema>;

export const STEPS = [
  { key: "about", label: "About you", schema: aboutSchema },
  { key: "idea", label: "Your idea", schema: ideaSchema },
  { key: "experience", label: "Experience", schema: experienceSchema },
  { key: "review", label: "Review", schema: consentSchema },
] as const;

export { words as countWords };
