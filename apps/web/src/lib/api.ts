import type { NewNote, Note } from '@autotest/core';

/** Where the web server reaches the api. Read at request time, not build time. */
export function apiUrl(path: string): string {
  const base = (process.env.API_URL ?? 'http://localhost:3001').replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function listNotes(fetcher: typeof fetch = fetch): Promise<Note[]> {
  const res = await fetcher(apiUrl('/api/notes'), { cache: 'no-store' });
  if (!res.ok) throw new Error(`api returned ${res.status}`);
  const data = (await res.json()) as { notes: Note[] };
  return data.notes;
}

export async function createNote(input: NewNote, fetcher: typeof fetch = fetch): Promise<Note> {
  const res = await fetcher(apiUrl('/api/notes'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `api returned ${res.status}`);
  return data as Note;
}

export async function deleteNote(id: string, fetcher: typeof fetch = fetch): Promise<void> {
  const res = await fetcher(apiUrl(`/api/notes/${encodeURIComponent(id)}`), { method: 'DELETE' });
  if (!res.ok && res.status !== 404) throw new Error(`api returned ${res.status}`);
}
