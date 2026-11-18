'use server';

import { revalidatePath } from 'next/cache';
import { NewNoteSchema } from '@autotest/core';
import { createNote, deleteNote } from '@/lib/api';

export type FormState = { error?: string };

export async function addNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = NewNoteSchema.safeParse({
    title: formData.get('title'),
    body: formData.get('body') ?? '',
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid note' };
  try {
    await createNote(parsed.data);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Could not save the note' };
  }
  revalidatePath('/');
  return {};
}

export async function deleteNoteAction(formData: FormData): Promise<void> {
  await deleteNote(String(formData.get('id')));
  revalidatePath('/');
}
