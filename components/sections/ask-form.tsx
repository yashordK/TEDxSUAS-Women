"use client";

import { useState, useTransition } from "react";
import { submitQuery } from "@/app/actions/query";
import { TextArea, TextField } from "@/components/speak/fields";

const EMPTY = { name: "", email: "", message: "", website: "" };

export function AskForm() {
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((p) => ({ ...p, [k]: e.target.value }));

  if (status === "sent") {
    return (
      <div role="status" className="border-l-2 border-red pl-5">
        <p className="display text-3xl">Thank you.</p>
        <p className="mt-3 text-grey">Your question is with the organisers. We&apos;ll reply to {v.email} soon.</p>
        <button
          type="button"
          onClick={() => {
            setV(EMPTY);
            setStatus("idle");
          }}
          className="eyebrow mt-6 text-red-text hover:text-white"
        >
          Ask something else
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = await submitQuery(v);
          if (res.ok) {
            setErrors({});
            setStatus("sent");
          } else {
            setErrors(res.fieldErrors ?? {});
            setError(res.error);
            setStatus("error");
          }
        });
      }}
      className="space-y-8"
    >
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input type="text" tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} />
        </label>
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <TextField label="Name" required autoComplete="name" value={v.name} onChange={set("name")} error={errors.name} />
        <TextField label="Email" type="email" required autoComplete="email" value={v.email} onChange={set("email")} error={errors.email} />
      </div>
      <TextArea label="Your question" required rows={4} value={v.message} onChange={set("message")} error={errors.message} />
      {status === "error" && !Object.keys(errors).length && (
        <p role="alert" className="text-sm text-red-text">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-red px-8 text-sm font-semibold text-white transition hover:bg-[#ff0a35] disabled:opacity-70"
      >
        {pending ? "Sending…" : "Send question"}
      </button>
    </form>
  );
}
