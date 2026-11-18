import { describe, expect, it } from 'vitest';
import { NewNoteSchema, NoteStore } from '../notes';

describe('NewNoteSchema', () => {
  it('accepts a title and trims it', () => {
    expect(NewNoteSchema.parse({ title: '  Hello  ' })).toEqual({ title: 'Hello', body: '' });
  });

  it('rejects an empty title', () => {
    expect(NewNoteSchema.safeParse({ title: '   ' }).success).toBe(false);
  });
});

describe('NoteStore', () => {
  it('adds, lists newest first, and removes notes', () => {
    const store = new NoteStore();
    const a = store.add({ title: 'A', body: '' }, new Date('2026-01-01'));
    const b = store.add({ title: 'B', body: '' }, new Date('2026-01-02'));
    expect(store.list().map((n) => n.id)).toEqual([b.id, a.id]);
    expect(store.remove(a.id)).toBe(true);
    expect(store.remove(a.id)).toBe(false);
    expect(store.list()).toHaveLength(1);
  });
});
