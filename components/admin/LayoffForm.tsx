"use client";

import { useEffect, useRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { createLayoffAction, type CreateLayoffState } from "@/app/admin/actions";

const initialState: CreateLayoffState = {};

const inputClass =
  "w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-text-accent";

type FieldProps = { label: string; name: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>;

function Field({ label, name, hint, ...props }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[13px] font-medium">
        {label}
      </label>
      <input id={name} name={name} className={inputClass} {...props} />
      {hint && <p className="mt-1 text-xs text-text-secondary">{hint}</p>}
    </div>
  );
}

type TextAreaFieldProps = { label: string; name: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>;

function TextAreaField({ label, name, hint, ...props }: TextAreaFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[13px] font-medium">
        {label}
      </label>
      <textarea id={name} name={name} className={inputClass} {...props} />
      {hint && <p className="mt-1 text-xs text-text-secondary">{hint}</p>}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-text-accent px-4 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Saving…" : "Save entry"}
    </button>
  );
}

export type LayoffFormInitialValues = {
  draftId?: string;
  dateAnnounced?: string;
  summary?: string;
  sourceLabel0?: string;
  sourceUrl0?: string;
};

export default function LayoffForm({
  initialValues,
}: {
  initialValues?: LayoffFormInitialValues;
}) {
  const [state, formAction] = useFormState(createLayoffAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5 rounded-xl border border-border bg-surface-2 p-6"
    >
      {state.success && (
        <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Saved.{" "}
          <Link href={`/layoffs/${state.success.id}`} className="underline">
            View the new entry
          </Link>
          .
        </div>
      )}
      {state.error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </div>
      )}

      {initialValues?.draftId && (
        <input type="hidden" name="draftId" value={initialValues.draftId} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company" name="company" required placeholder="e.g. Acme Corp" />
        <Field label="Industry" name="industry" required placeholder="e.g. Enterprise Software" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Date announced"
          name="dateAnnounced"
          type="date"
          required
          defaultValue={initialValues?.dateAnnounced}
        />
        <Field label="Employees affected" name="employeesAffected" type="number" min={0} required />
        <Field
          label="Percentage affected"
          name="percentageAffected"
          type="number"
          min={0}
          max={100}
          placeholder="optional"
        />
      </div>

      <TextAreaField
        label="Summary"
        name="summary"
        required
        rows={3}
        placeholder="One or two sentences for the feed card."
        defaultValue={initialValues?.summary}
        hint={initialValues?.summary ? "Pre-filled from the draft headline — replace with your own write-up." : undefined}
      />

      <TextAreaField
        label="Full write-up"
        name="body"
        rows={6}
        placeholder="Optional. Separate paragraphs with a blank line."
        hint="Falls back to the summary if left blank."
      />

      <Field
        label="Tags"
        name="tags"
        required
        placeholder="e.g. Big tech, AI-driven"
        hint="Comma-separated."
      />

      <fieldset className="space-y-3">
        <legend className="mb-1 text-[13px] font-medium">Sources</legend>
        <div className="space-y-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr]">
              <input
                name={`sourceLabel${i}`}
                placeholder="Label (optional)"
                className={inputClass}
                defaultValue={i === 0 ? initialValues?.sourceLabel0 : undefined}
              />
              <input
                name={`sourceUrl${i}`}
                placeholder="https://…"
                className={inputClass}
                defaultValue={i === 0 ? initialValues?.sourceUrl0 : undefined}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-text-secondary">At least one URL is required.</p>
      </fieldset>

      <SubmitButton />
    </form>
  );
}
