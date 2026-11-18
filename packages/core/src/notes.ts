import { z } from 'zod';

/** What a client sends to make a note. */
export const NewNoteSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title is too long'),
  body: z.string().trim().max(1000, 'Body is too long').default(''),
});

export type NewNote = z.infer<typeof NewNoteSchema>;

export interface Note extends NewNote {
  id: string;
  createdAt: string;
}

/** An in-memory note store. Stands in for a database in this stub. */
export class NoteStore {
  private notes: Note[] = [];
  private nextId = 1;

  list(): Note[] {
    return [...this.notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  get(id: string): Note | undefined {
    return this.notes.find((n) => n.id === id);
  }

  add(input: NewNote, now: Date = new Date()): Note {
    const note: Note = { id: String(this.nextId++), createdAt: now.toISOString(), ...input };
    this.notes.push(note);
    return note;
  }

  remove(id: string): boolean {
    const before = this.notes.length;
    this.notes = this.notes.filter((n) => n.id !== id);
    return this.notes.length < before;
  }
}
