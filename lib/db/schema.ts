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

    // Organiser review (admin dashboard)
    notes: text("notes"),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    updatedBy: text("updated_by"), // admin email
  },
  (t) => [
    index("speaker_applications_email_idx").on(t.email),
    index("speaker_applications_created_idx").on(t.createdAt),
    index("speaker_applications_status_idx").on(t.status),
  ],
);

export type SpeakerApplicationRow = typeof speakerApplications.$inferSelect;
export type NewSpeakerApplicationRow = typeof speakerApplications.$inferInsert;

/* ------------------------------ Admin ------------------------------ */

export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(), // stored lowercase
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  mustChangePassword: boolean("must_change_password").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

export const adminSessions = pgTable(
  "admin_sessions",
  {
    // sha256 of the cookie token; the raw token never touches the database
    tokenHash: text("token_hash").primaryKey(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => admins.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("admin_sessions_admin_idx").on(t.adminId)],
);

/* ----------------------------- Queries ----------------------------- */

export const QUERY_STATUSES = ["open", "resolved"] as const;

export const queries = pgTable(
  "queries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    status: text("status", { enum: QUERY_STATUSES }).notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    resolvedBy: text("resolved_by"),
  },
  (t) => [index("queries_status_idx").on(t.status), index("queries_created_idx").on(t.createdAt)],
);

export type AdminRow = typeof admins.$inferSelect;
export type QueryRow = typeof queries.$inferSelect;

/* --------------------------- Activity log --------------------------- */

// Who did what. Actor is an organiser's email, or "public" for visitors.
export const activityLog = pgTable(
  "activity_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
    actor: text("actor").notNull(),
    actorName: text("actor_name").notNull(),
    action: text("action").notNull(),
    targetType: text("target_type"), // application | query | admin
    targetId: text("target_id"),
    summary: text("summary").notNull(),
  },
  (t) => [index("activity_at_idx").on(t.at), index("activity_target_idx").on(t.targetType, t.targetId)],
);

export type ActivityRow = typeof activityLog.$inferSelect;
