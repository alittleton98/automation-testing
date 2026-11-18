import type { Note } from '@autotest/core';
import { listNotes } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { deleteNoteAction } from './actions/notes';
import { NoteForm } from './NoteForm';

// Read from the api on every request, so the build never needs the api running.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let notes: Note[] = [];
  let apiDown = false;
  try {
    notes = await listNotes();
  } catch {
    apiDown = true;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Notes</h1>
        <p className="text-sm text-slate-500">A stub app for practicing CI/CD.</p>
      </header>

      <NoteForm />

      {apiDown ? (
        <p className="rounded bg-amber-50 p-3 text-sm text-amber-800">
          Can&apos;t reach the api. Is it running?
        </p>
      ) : notes.length === 0 ? (
        <p className="text-sm text-slate-500">No notes yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex items-start justify-between rounded-lg bg-white p-4 shadow-sm"
            >
              <div>
                <h2 className="font-medium">{note.title}</h2>
                {note.body && (
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{note.body}</p>
                )}
                <p className="mt-2 text-xs text-slate-400">{formatDate(note.createdAt)}</p>
              </div>
              <form action={deleteNoteAction}>
                <input type="hidden" name="id" value={note.id} />
                <button type="submit" className="text-sm text-slate-400 hover:text-red-600">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
