"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  addAdmin,
  changePassword,
  login,
  updateApplication,
  type FormState,
} from "@/app/admin/actions";
import { APPLICATION_STATUSES, STATUS_LABEL, type ApplicationStatus } from "@/lib/admin/status";
import { btnPrimary, input } from "./ui";

function Submit({ children, pendingText }: { children: React.ReactNode; pendingText: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={btnPrimary}>
      {pending ? pendingText : children}
    </button>
  );
}

function Feedback({ state }: { state: FormState }) {
  if (state.error)
    return (
      <p role="alert" className="rounded-lg border border-red/50 bg-red/10 px-3 py-2 text-sm text-white">
        {state.error}
      </p>
    );
  if (state.message)
    return (
      <p role="status" className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
        {state.message}
      </p>
    );
  return null;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-grey">{hint}</span>}
    </label>
  );
}

/* ------------------------------- login ------------------------------- */

export function LoginForm() {
  const [state, action] = useActionState(login, {});
  return (
    <form action={action} className="space-y-5">
      <Field label="Email">
        <input name="email" type="email" autoComplete="username" required className={input} />
      </Field>
      <Field label="Password">
        <input name="password" type="password" autoComplete="current-password" required className={input} />
      </Field>
      <Feedback state={state} />
      <Submit pendingText="Signing in…">Sign in</Submit>
    </form>
  );
}

/* --------------------------- change password --------------------------- */

export function ChangePasswordForm({ first }: { first: boolean }) {
  const [state, action] = useActionState(changePassword, {});
  return (
    <form action={action} className="max-w-md space-y-5">
      <Field label={first ? "Temporary password" : "Current password"}>
        <input name="current" type="password" autoComplete="current-password" required className={input} />
      </Field>
      <Field label="New password" hint="At least 10 characters. A short sentence works well.">
        <input name="next" type="password" autoComplete="new-password" minLength={10} required className={input} />
      </Field>
      <Field label="Confirm new password">
        <input name="confirm" type="password" autoComplete="new-password" minLength={10} required className={input} />
      </Field>
      <Feedback state={state} />
      <Submit pendingText="Saving…">{first ? "Set my password" : "Change password"}</Submit>
    </form>
  );
}

/* --------------------------- application review --------------------------- */

export function ReviewForm({ id, status, notes }: { id: string; status: ApplicationStatus; notes: string }) {
  const [state, action] = useActionState(updateApplication, {});
  // Uncontrolled on purpose: the parent re-keys this form with the saved values
  // after each save, so React's post-action form reset can't show stale data.
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <Field label="Status">
        <select name="status" defaultValue={status} className={`${input} [&>option]:bg-black`}>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Internal notes" hint="Only organisers see these.">
        <textarea name="notes" defaultValue={notes} rows={6} className={`${input} resize-y`} data-lenis-prevent />
      </Field>
      <Feedback state={state} />
      <Submit pendingText="Saving…">Save review</Submit>
    </form>
  );
}

/* ------------------------------ add admin ------------------------------ */

export function AddAdminForm() {
  const [state, action] = useActionState(addAdmin, {});
  return (
    <form action={action} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <Field label="Name">
        <input name="name" required className={input} />
      </Field>
      <Field label="Email">
        <input name="email" type="email" required className={input} />
      </Field>
      <Submit pendingText="Adding…">Give access</Submit>
      <div className="md:col-span-3">
        <Feedback state={state} />
      </div>
    </form>
  );
}

/* --------------------------- confirm button --------------------------- */

/** Button inside a server-action <form> that asks before submitting. */
export function ConfirmButton({ children, message, className }: { children: React.ReactNode; message: string; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {pending ? "…" : children}
    </button>
  );
}
