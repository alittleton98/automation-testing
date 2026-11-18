'use client';

import { useActionState, useEffect, useRef } from 'react';
import { addNoteAction, type FormState } from './actions/notes';

export function NoteForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(addNoteAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) formRef.current?.reset();
  }, [pending, state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
      <input
        name="title"
        placeholder="Title"
        className="w-full rounded border border-slate-300 px-3 py-2"
        aria-label="Title"
      />
      <textarea
        name="body"
        placeholder="Write something…"
        rows={3}
        className="w-full rounded border border-slate-300 px-3 py-2"
        aria-label="Body"
      />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Add note'}
      </button>
    </form>
  );
}
