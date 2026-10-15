import { boolean, date, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const APPLICATION_STATUSES = ["new", "shortlisted", "rejected", "confirmed"] as const;

export const speakerApplications = pgTable(
  "speaker_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    refCode: text("ref_code").notNull().unique(), // e.g. TXSW-27-A4F9

    // About you
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    birthdate: date("birthdate").notNull(),
    phone: text("phone").notNull(),
    phoneIsWhatsapp: boolean("phone_is_whatsapp").notNull().default(true),
    occupation: text("occupation").notNull(),
    organisation: text("organisation").notNull(),
    isSymbiosisStudent: boolean("is_symbiosis_student"),
    institute: text("institute"),
    programme: text("programme"),
    yearOfStudy: text("year_of_study"),
    prn: text("prn"),

    // Idea
    ideaTitle: text("idea_title").notNull(),
    idea: text("idea").notNull(),
    whyThisIdea: text("why_this_idea").notNull(),
    themeConnection: text("theme_connection").notNull(),
    personalImpact: text("personal_impact").notNull(),

    // Experience
    priorExperience: text("prior_experience"),
    preferredLanguage: text("preferred_language").notNull(),
    demoVideoUrl: text("demo_video_url").notNull(),

    // Consent + review
    consentOriginal: boolean("consent_original").notNull(),
    consentContact: boolean("consent_contact").notNull(),
    status: text("status", { enum: APPLICATION_STATUSES }).notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("speaker_applications_email_idx").on(t.email), index("speaker_applications_created_idx").on(t.createdAt)],
);

export type SpeakerApplicationRow = typeof speakerApplications.$inferSelect;
export type NewSpeakerApplicationRow = typeof speakerApplications.$inferInsert;
