import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';

describe('api', () => {
  it('reports health', async () => {
    const res = await createApp().request('/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ status: 'ok' });
  });

  it('creates, lists and deletes a note', async () => {
    const app = createApp();
    const created = await app.request('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'First note', body: 'Hello' }),
    });
    expect(created.status).toBe(201);
    const note = (await created.json()) as { id: string };

    const list = (await (await app.request('/api/notes')).json()) as { notes: unknown[] };
    expect(list.notes).toHaveLength(1);

    expect((await app.request(`/api/notes/${note.id}`, { method: 'DELETE' })).status).toBe(204);
    expect((await app.request(`/api/notes/${note.id}`)).status).toBe(404);
  });

  it('rejects a note without a title', async () => {
    const res = await createApp().request('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    });
    expect(res.status).toBe(400);
  });
});
