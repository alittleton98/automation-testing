import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiUrl, createNote, listNotes } from '@/lib/api';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('apiUrl', () => {
  it('joins the base and path', () => {
    vi.stubEnv('API_URL', 'http://api:3001/');
    expect(apiUrl('/api/notes')).toBe('http://api:3001/api/notes');
    expect(apiUrl('health')).toBe('http://api:3001/health');
  });
});

describe('api client', () => {
  it('lists notes', async () => {
    const fetcher = vi.fn(async () => Response.json({ notes: [{ id: '1', title: 'A' }] }));
    const notes = await listNotes(fetcher as unknown as typeof fetch);
    expect(notes).toHaveLength(1);
  });

  it('surfaces the api error message', async () => {
    const fetcher = vi.fn(async () =>
      Response.json({ error: 'Title is required' }, { status: 400 }),
    );
    await expect(
      createNote({ title: '', body: '' }, fetcher as unknown as typeof fetch),
    ).rejects.toThrow('Title is required');
  });
});
