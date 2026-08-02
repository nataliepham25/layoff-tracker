"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitTipAction, type SubmitTipState } from "@/app/submit/actions";

const initialState: SubmitTipState = {};

const inputClass =
  "w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-text-accent";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-accent px-4 py-2 text-sm font-medium text-text-accent disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Sending…" : "Submit tip"}
    </button>
  );
}

export default function SubmitTipForm() {
  const [state, formAction] = useFormState(submitTipAction, initialState);
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
      className="space-y-4 rounded-xl border border-border bg-surface-2 p-6"
    >
      {state.success && (
        <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Thanks — we&apos;ll review it before anything goes live.
        </div>
      )}
      {state.error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="company" className="mb-1.5 block text-[13px] font-medium">
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          placeholder="e.g. Acme Corp"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="details" className="mb-1.5 block text-[13px] font-medium">
          What happened?
        </label>
        <textarea
          id="details"
          name="details"
          rows={5}
          placeholder="Share what you know — number of roles affected, teams impacted, timing, etc."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="sourceLink" className="mb-1.5 block text-[13px] font-medium">
          Source link
        </label>
        <input
          id="sourceLink"
          name="sourceLink"
          type="text"
          placeholder="https://… (news article, LinkedIn post, WARN notice, etc.)"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="note" className="mb-1.5 block text-[13px] font-medium">
          Anything else? <span className="font-normal text-text-secondary">(optional)</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="Optional — add context without identifying yourself."
          className={inputClass}
        />
      </div>

      <SubmitButton />
    </form>
  );
}
