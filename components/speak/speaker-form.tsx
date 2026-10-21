"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  IDEA_WORDS,
  LANGUAGES,
  OCCUPATIONS,
  SHORT_WORDS,
  STEPS,
  YEARS,
  speakerApplicationSchema,
} from "@/lib/schemas/speaker";
import { ideas } from "@/lib/ideas";
import { site } from "@/lib/site";
import { submitSpeakerApplication } from "@/app/speak/actions";
import { CheckField, ChoiceField, SelectField, TextArea, TextField } from "./fields";
import { SubmittedScreen } from "./submitted";

type FormValues = {
  fullName: string;
  email: string;
  birthdate: string;
  phone: string;
  phoneIsWhatsapp: boolean;
  occupation: string;
  occupationOther: string;
  organisation: string;
  isSymbiosisStudent: string;
  programme: string;
  yearOfStudy: string;
  prn: string;
  ideaTitle: string;
  idea: string;
  whyThisIdea: string;
  themeConnection: string;
  personalImpact: string;
  priorExperience: string;
  preferredLanguage: string;
  demoVideoUrl: string;
  consentOriginal: boolean;
  consentContact: boolean;
  website: string;
};
type Key = keyof FormValues;

const DEFAULTS: FormValues = {
  fullName: "",
  email: "",
  birthdate: "",
  phone: "",
  phoneIsWhatsapp: true,
  occupation: "",
  occupationOther: "",
  organisation: "",
  isSymbiosisStudent: "",
  programme: "",
  yearOfStudy: "",
  prn: "",
  ideaTitle: "",
  idea: "",
  whyThisIdea: "",
  themeConnection: "",
  personalImpact: "",
  priorExperience: "",
  preferredLanguage: "",
  demoVideoUrl: "",
  consentOriginal: false,
  consentContact: false,
  website: "",
};

const STORAGE_KEY = "txsw-speak-v1";
const EASE = [0.16, 1, 0.3, 1] as const;

const stepKeys = (i: number) => Object.keys(STEPS[i].schema.shape) as Key[];
const stepOf = (key: string) => STEPS.findIndex((s) => key in s.schema.shape);

export function SpeakerForm() {
  const { register, control, watch, getValues, setError, clearErrors, reset, formState } = useForm<FormValues>({
    defaultValues: DEFAULTS,
  });
  const { errors } = formState;
  const values = watch();

  const [step, setStep] = useState(0);
  const [attempted, setAttempted] = useState<boolean[]>([false, false, false, false]);
  const [restored, setRestored] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [refCode, setRefCode] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const top = useRef<HTMLDivElement>(null);

  /* ---------- persistence ---------- */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved?.values) {
        reset({ ...DEFAULTS, ...saved.values, website: "" });
        if (typeof saved.step === "number") setStep(Math.min(saved.step, STEPS.length - 1));
        setRestored(true);
      }
    } catch {
      /* storage blocked or corrupt: start fresh */
    }
  }, [reset]);

  const serialized = JSON.stringify(values);
  useEffect(() => {
    if (refCode) return;
    const t = window.setTimeout(() => {
      try {
        const { website: _hp, ...rest } = JSON.parse(serialized) as FormValues;
        void _hp;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, values: rest }));
      } catch {
        /* ignore */
      }
    }, 300);
    return () => window.clearTimeout(t);
  }, [serialized, step, refCode]);

  /* ---------- validation ---------- */
  const validateStep = useCallback(
    (i: number, focus: boolean) => {
      const r = STEPS[i].schema.safeParse(getValues());
      clearErrors(stepKeys(i));
      if (r.success) return true;
      // First problem per field wins (e.g. "paste a full link" before "use https").
      const seen = new Set<string>();
      for (const issue of r.error.issues) {
        const key = String(issue.path[0]);
        if (seen.has(key)) continue;
        seen.add(key);
        setError(key as Key, { message: issue.message });
      }
      if (focus) {
        window.setTimeout(() => {
          (top.current?.parentElement?.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus();
        }, 60);
      }
      return false;
    },
    [getValues, clearErrors, setError],
  );

  // After a failed attempt, re-check live so errors clear as people fix them.
  useEffect(() => {
    if (attempted[step]) validateStep(step, false);
  }, [serialized, step, attempted, validateStep]);

  const goTo = (i: number) => {
    setStep(i);
    setServerError(null);
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const next = () => {
    setAttempted((a) => a.map((x, j) => (j === step ? true : x)));
    if (validateStep(step, true)) goTo(step + 1);
  };

  const submit = () => {
    setAttempted([true, true, true, true]);
    if (!validateStep(3, true)) return;
    const full = speakerApplicationSchema.safeParse(getValues());
    if (!full.success) {
      const first = full.error.issues[0];
      const s = stepOf(String(first.path[0]));
      if (s >= 0) {
        goTo(s);
        requestAnimationFrame(() => validateStep(s, true));
      }
      return;
    }
    startTransition(async () => {
      const res = await submitSpeakerApplication(getValues());
      if (res.ok) {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        setRefCode(res.refCode);
        window.scrollTo({ top: 0 });
        return;
      }
      setServerError(res.error);
      if (res.fieldErrors) {
        const keys = Object.keys(res.fieldErrors);
        keys.forEach((k) => setError(k as Key, { message: res.fieldErrors![k] }));
        const s = Math.min(...keys.map(stepOf).filter((x) => x >= 0));
        if (Number.isFinite(s) && s !== step) goTo(s);
      }
    });
  };

  const startOver = () => {
    reset(DEFAULTS);
    setAttempted([false, false, false, false]);
    setRestored(false);
    goTo(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  if (refCode) return <SubmittedScreen refCode={refCode} name={values.fullName} />;

  const err = (k: Key) => errors[k]?.message as string | undefined;
  const isStudent = values.occupation === "Student";
  const isSymbi = isStudent && values.isSymbiosisStudent === "yes";

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div ref={top} className="scroll-mt-28" />

      {/* Progress */}
      <nav aria-label="Application progress">
        <ol className="grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => i < step && goTo(i)}
                disabled={i >= step}
                aria-current={i === step ? "step" : undefined}
                className="group w-full text-left disabled:cursor-default"
              >
                <span className="block h-0.5 overflow-hidden bg-white/15">
                  <motion.span
                    className="block h-full bg-red"
                    initial={false}
                    animate={{ width: i <= step ? "100%" : "0%" }}
                    transition={{ duration: 0.7, ease: EASE }}
                  />
                </span>
                <span className={`eyebrow mt-3 hidden text-[0.625rem] sm:block ${i === step ? "text-white" : i < step ? "text-red-text group-hover:text-white" : "text-grey"}`}>
                  {String(i + 1).padStart(2, "0")} · {s.label}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="eyebrow mt-3 text-[0.625rem] text-grey sm:hidden">
          Step {step + 1} of {STEPS.length} · <span className="text-white">{STEPS[step].label}</span>
        </p>
      </nav>

      {restored && step === 0 && (
        <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-l-2 border-red pl-4 text-sm text-grey">
          We restored your saved answers.
          <button type="button" onClick={startOver} className="text-white underline decoration-red underline-offset-4">
            Start over
          </button>
        </p>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) next();
          else submit();
        }}
        className="mt-12"
      >
        {/* Honeypot: hidden from people and assistive tech */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Leave this empty
            <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {step === 0 && (
              <fieldset className="space-y-9">
                <StepTitle n={1} title="About you" sub="The basics, so we know who's behind the idea." />
                <TextField label="Full name" required autoComplete="name" error={err("fullName")} {...register("fullName")} />
                <div className="grid gap-9 sm:grid-cols-2">
                  <TextField label="Email" type="email" required autoComplete="email" inputMode="email" error={err("email")} {...register("email")} />
                  <TextField label="Date of birth" type="date" required autoComplete="bday" max={new Date().toISOString().slice(0, 10)} error={err("birthdate")} {...register("birthdate")} />
                </div>
                <div>
                  <TextField
                    label="Phone number"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                    hint="Your WhatsApp number is best: that's where we'll reach you fastest."
                    error={err("phone")}
                    {...register("phone")}
                  />
                  <CheckField label="This number is on WhatsApp" {...register("phoneIsWhatsapp")} />
                </div>
                <div className="grid gap-9 sm:grid-cols-2">
                  <SelectField label="Occupation" required options={OCCUPATIONS} error={err("occupation")} {...register("occupation")} />
                  <TextField
                    label={isStudent ? "University" : "Organisation"}
                    placeholder={isStudent ? "e.g. Symbiosis University of Applied Sciences" : undefined}
                    required
                    autoComplete="organization"
                    error={err("organisation")}
                    {...register("organisation")}
                  />
                </div>
                {values.occupation === "Other" && (
                  <TextField label="Your occupation" required error={err("occupationOther")} {...register("occupationOther")} />
                )}

                {isStudent && (
                  <Reveal>
                    <Controller
                      control={control}
                      name="isSymbiosisStudent"
                      render={({ field }) => (
                        <ChoiceField
                          name={field.name}
                          label="Are you a Symbiosis student?"
                          required
                          value={field.value}
                          onChange={field.onChange}
                          error={err("isSymbiosisStudent")}
                          options={[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                          ]}
                        />
                      )}
                    />
                  </Reveal>
                )}

                {isSymbi && (
                  <Reveal>
                    <div className="space-y-9 border-l border-red/60 pl-5 sm:pl-8">
                      <p className="eyebrow text-red-text">Student details</p>
                      <div className="grid gap-9 sm:grid-cols-2">
                        <TextField label="Programme" required placeholder="e.g. B.Tech CSE" error={err("programme")} {...register("programme")} />
                        <SelectField label="Year of study" required options={YEARS} error={err("yearOfStudy")} {...register("yearOfStudy")} />
                      </div>
                      <TextField label="PRN / Enrollment number" required error={err("prn")} {...register("prn")} />
                    </div>
                  </Reveal>
                )}
              </fieldset>
            )}

            {step === 1 && (
              <fieldset className="space-y-9">
                <StepTitle n={2} title="Your idea" sub="Tell it the way you'd tell a friend who asked what keeps you up at night." />
                <IdeaInspiration />
                <TextField label="Working title" required placeholder="A few words that capture it" error={err("ideaTitle")} {...register("ideaTitle")} />
                <TextArea
                  label="What's your idea?"
                  required
                  rows={8}
                  hint="What do you want the audience to understand, feel or do differently?"
                  minWords={IDEA_WORDS.min}
                  maxWords={IDEA_WORDS.max}
                  value={values.idea}
                  error={err("idea")}
                  {...register("idea")}
                />
                <TextArea label="Why this idea?" required hint="Why does it matter, and why now?" minWords={30} maxWords={SHORT_WORDS} value={values.whyThisIdea} error={err("whyThisIdea")} {...register("whyThisIdea")} />
                <TextArea
                  label="How does it connect to our theme?"
                  required
                  hint={
                    <>
                      <span lang="sa" className="font-deva text-white">{site.theme.devanagari}</span> ({site.theme.transliteration}): you are the change. Where does your idea meet that?
                    </>
                  }
                  minWords={30}
                  maxWords={SHORT_WORDS}
                  value={values.themeConnection}
                  error={err("themeConnection")}
                  {...register("themeConnection")}
                />
                <TextArea label="How has it impacted you?" required hint="The personal story behind the idea." minWords={30} maxWords={SHORT_WORDS} value={values.personalImpact} error={err("personalImpact")} {...register("personalImpact")} />
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className="space-y-9">
                <StepTitle n={3} title="Experience" sub="No stage experience needed. Honesty helps us support you." />
                <TextArea
                  label="Any prior speaking experience?"
                  hint="Talks, panels, performances, classes you've taught, videos you've made. Leave blank if this would be your first time."
                  maxWords={300}
                  value={values.priorExperience}
                  error={err("priorExperience")}
                  {...register("priorExperience")}
                />
                <Controller
                  control={control}
                  name="preferredLanguage"
                  render={({ field }) => (
                    <ChoiceField
                      name={field.name}
                      label="Preferred language for your talk"
                      hint="Choose one."
                      required
                      value={field.value}
                      onChange={field.onChange}
                      error={err("preferredLanguage")}
                      options={LANGUAGES.map((l) => ({ value: l, label: l }))}
                    />
                  )}
                />
                <TextField
                  label="Demo video link"
                  type="url"
                  required
                  inputMode="url"
                  placeholder="https://"
                  hint="A short video (2–3 minutes is plenty) of you explaining your idea and your vision for the talk. Phone camera is fine. Upload it to Google Drive, YouTube (unlisted) or similar and paste the link. Make sure anyone with the link can view it."
                  error={err("demoVideoUrl")}
                  {...register("demoVideoUrl")}
                />
              </fieldset>
            )}

            {step === 3 && (
              <div className="space-y-12">
                <StepTitle n={4} title="Review and submit" sub="Read it through once. You can jump back to any step to edit." />
                <Review values={values} onEdit={goTo} />
                <div className="space-y-4 border-t border-line pt-10">
                  <CheckField
                    label="I confirm this idea and application are my own original work."
                    error={err("consentOriginal")}
                    {...register("consentOriginal")}
                  />
                  <CheckField
                    label="I agree to be contacted by the TEDxSUAS Women team by email, phone or WhatsApp about my application."
                    error={err("consentContact")}
                    {...register("consentContact")}
                  />
                </div>
                <p className="border-l-2 border-red pl-4 text-white">
                  Our curation team reads every application. We&apos;ll get back to you within a month of submission.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {serverError && (
          <p role="alert" className="mt-10 border border-red/60 bg-red/10 px-5 py-4 text-sm text-white">
            {serverError}
          </p>
        )}

        {/* Controls */}
        <div className="mt-14 flex flex-col-reverse gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-7 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5">
              <span aria-hidden>←</span> Back
            </button>
          ) : (
            <span className="hidden text-sm text-grey sm:block">Your answers save on this device as you type.</span>
          )}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-red px-8 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(235,0,40,0.8)] transition hover:bg-[#ff0a35] disabled:cursor-wait disabled:opacity-70"
          >
            {step < 3 ? (
              <>
                Continue <span aria-hidden>→</span>
              </>
            ) : pending ? (
              "Sending your idea…"
            ) : (
              "Submit application"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function StepTitle({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <legend className="mb-2 block">
      <span className="eyebrow text-red-text">Step {String(n).padStart(2, "0")}</span>
      <span className="display mt-3 block text-4xl md:text-5xl">{title}</span>
      <span className="mt-3 block text-grey">{sub}</span>
    </legend>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.5, ease: EASE }} className="overflow-hidden">
      {children}
    </motion.div>
  );
}

function IdeaInspiration() {
  return (
    <details className="group border border-white/15 open:border-red/60">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="eyebrow block text-red-text">Need a spark?</span>
          <span className="mt-1 block text-white">See the directions our curators are exploring</span>
        </span>
        <span aria-hidden className="text-2xl text-red-text transition-transform group-open:rotate-45">+</span>
      </summary>
      <ul className="grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-2" data-lenis-prevent>
        {ideas.map((i) => (
          <li key={i.area} className="bg-black px-5 py-4">
            <p className="eyebrow text-[0.625rem] text-red-text">{i.area}</p>
            <p className="mt-1 font-semibold text-white">{i.title}</p>
            <p className="mt-1 text-sm text-grey">{i.body}</p>
          </li>
        ))}
      </ul>
      <p className="border-t border-white/10 px-5 py-3 text-sm text-grey">
        These are starting points, not limits.{" "}
        <Link href="/#ideas" target="_blank" className="text-white underline decoration-red underline-offset-4">
          View on the site
        </Link>
      </p>
    </details>
  );
}

function Review({ values: v, onEdit }: { values: FormValues; onEdit: (step: number) => void }) {
  const isStudent = v.occupation === "Student";
  const isSymbi = isStudent && v.isSymbiosisStudent === "yes";
  const groups: { step: number; title: string; rows: [string, string | undefined][] }[] = [
    {
      step: 0,
      title: "About you",
      rows: [
        ["Name", v.fullName],
        ["Email", v.email],
        ["Date of birth", v.birthdate],
        ["Phone", v.phone && `${v.phone}${v.phoneIsWhatsapp ? " · WhatsApp" : ""}`],
        ["Occupation", v.occupation === "Other" ? v.occupationOther : v.occupation],
        [isStudent ? "University" : "Organisation", v.organisation],
        ...(isStudent ? ([["Symbiosis student", v.isSymbiosisStudent === "yes" ? "Yes" : "No"]] as [string, string][]) : []),
        ...(isSymbi
          ? ([
              ["Programme", v.programme],
              ["Year", v.yearOfStudy],
              ["PRN", v.prn],
            ] as [string, string][])
          : []),
      ],
    },
    {
      step: 1,
      title: "Your idea",
      rows: [
        ["Title", v.ideaTitle],
        ["The idea", v.idea],
        ["Why this idea", v.whyThisIdea],
        ["Connection to the theme", v.themeConnection],
        ["How it has impacted you", v.personalImpact],
      ],
    },
    {
      step: 2,
      title: "Experience",
      rows: [
        ["Prior experience", v.priorExperience || "First time"],
        ["Language", v.preferredLanguage],
        ["Demo video", v.demoVideoUrl],
      ],
    },
  ];

  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <section key={g.title} aria-label={g.title}>
          <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
            <h3 className="eyebrow text-white">{g.title}</h3>
            <button type="button" onClick={() => onEdit(g.step)} className="eyebrow text-red-text hover:text-white">
              Edit
            </button>
          </div>
          <dl className="divide-y divide-line">
            {g.rows.map(([k, val]) => (
              <div key={k} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-sm text-grey">{k}</dt>
                <dd className="whitespace-pre-line break-words text-white">{val || <span className="text-grey">-</span>}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
