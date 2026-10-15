"use client";

import { forwardRef, useId } from "react";
import { countWords } from "@/lib/schemas/speaker";

const control =
  "w-full border-0 border-b border-white/25 bg-transparent px-0 py-3 text-base text-white placeholder:text-white/30 transition-colors focus:border-red focus:outline-none focus:ring-0 aria-[invalid=true]:border-red-text";

type BaseProps = {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
};

function Shell({
  id,
  label,
  hint,
  error,
  required,
  className = "",
  counter,
  children,
}: BaseProps & { id: string; counter?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow block text-white">
        {label}
        {required && <span className="ml-1 text-red-text" aria-hidden>*</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-grey">
          {hint}
        </p>
      )}
      {children}
      <div className="mt-2 flex min-h-5 items-start justify-between gap-4 text-sm">
        <p id={`${id}-error`} role={error ? "alert" : undefined} className="text-red-text">
          {error}
        </p>
        {counter}
      </div>
    </div>
  );
}

const describedBy = (id: string, hint?: unknown) => [hint ? `${id}-hint` : null, `${id}-error`].filter(Boolean).join(" ");

export const TextField = forwardRef<HTMLInputElement, BaseProps & React.InputHTMLAttributes<HTMLInputElement>>(
  function TextField({ label, hint, error, required, className, ...input }, ref) {
    const id = useId();
    return (
      <Shell id={id} label={label} hint={hint} error={error} required={required} className={className}>
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-required={required}
          aria-describedby={describedBy(id, hint)}
          className={`${control} [color-scheme:dark]`}
          {...input}
        />
      </Shell>
    );
  },
);

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & { value?: string; minWords?: number; maxWords?: number }
>(function TextArea({ label, hint, error, required, className, minWords, maxWords, value = "", ...input }, ref) {
  const id = useId();
  const n = countWords(String(value ?? ""));
  const counter =
    maxWords !== undefined ? (
      <span
        aria-live="polite"
        className={`shrink-0 tabular-nums ${n > maxWords || (minWords && n > 0 && n < minWords) ? "text-red-text" : "text-grey"}`}
      >
        {n}
        {minWords ? ` / ${minWords}–${maxWords}` : ` / ${maxWords}`} words
      </span>
    ) : null;
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required} className={className} counter={counter}>
      <textarea
        ref={ref}
        id={id}
        rows={5}
        value={value}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy(id, hint)}
        className={`${control} mt-1 min-h-32 resize-y border border-white/15 px-4 focus:border-red`}
        data-lenis-prevent
        {...input}
      />
    </Shell>
  );
});

export const SelectField = forwardRef<
  HTMLSelectElement,
  BaseProps & React.SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[]; placeholder?: string }
>(function SelectField({ label, hint, error, required, className, options, placeholder = "Select…", ...select }, ref) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-required={required}
          aria-describedby={describedBy(id, hint)}
          className={`${control} appearance-none pr-8 [&>option]:bg-black`}
          {...select}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-red-text" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </Shell>
  );
});

/** Pill radio group. `value`/`onChange` controlled so it works with RHF's Controller. */
export function ChoiceField({
  label,
  hint,
  error,
  required,
  className = "",
  options,
  value,
  onChange,
  name,
}: BaseProps & {
  options: readonly { value: string; label: string }[];
  value?: string;
  onChange: (v: string) => void;
  name: string;
}) {
  const id = useId();
  return (
    <fieldset className={className} aria-describedby={describedBy(id, hint)} aria-invalid={!!error}>
      <legend className="eyebrow text-white">
        {label}
        {required && <span className="ml-1 text-red-text" aria-hidden>*</span>}
        {required && <span className="sr-only"> (required)</span>}
      </legend>
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-grey">
          {hint}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={`relative inline-flex min-h-11 cursor-pointer items-center rounded-full border px-5 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-red-text ${
                checked ? "border-red bg-red text-white" : "border-white/25 text-white/80 hover:border-white"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
      <p id={`${id}-error`} role={error ? "alert" : undefined} className="mt-2 min-h-5 text-sm text-red-text">
        {error}
      </p>
    </fieldset>
  );
}

export const CheckField = forwardRef<
  HTMLInputElement,
  { label: React.ReactNode; error?: string } & React.InputHTMLAttributes<HTMLInputElement>
>(function CheckField({ label, error, ...input }, ref) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="group flex cursor-pointer items-start gap-4">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={`${id}-error`}
          className="peer sr-only"
          {...input}
        />
        <span
          aria-hidden
          className="mt-0.5 flex size-5 shrink-0 items-center justify-center border border-white/40 transition-colors peer-checked:border-red peer-checked:bg-red peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-red-text [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="white" strokeWidth="3">
            <path d="m5 12 5 5 9-10" />
          </svg>
        </span>
        <span className="text-white/90">{label}</span>
      </label>
      <p id={`${id}-error`} role={error ? "alert" : undefined} className="ml-9 mt-1 min-h-5 text-sm text-red-text">
        {error}
      </p>
    </div>
  );
});
