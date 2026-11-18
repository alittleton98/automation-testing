import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { APP_VERSION, NewNoteSchema, NoteStore } from '@autotest/core';

/** Builds the api. A fresh store per app keeps tests independent. */
export function createApp(store: NoteStore = new NoteStore()) {
  const app = new Hono();

  if (process.env.NODE_ENV !== 'test') app.use('*', logger());
  app.use('/api/*', cors());

  app.get('/health', (c) =>
    c.json({ status: 'ok', version: APP_VERSION, commit: process.env.GIT_SHA ?? 'local' }),
  );

  app.get('/api/notes', (c) => c.json({ notes: store.list() }));

  app.get('/api/notes/:id', (c) => {
    const note = store.get(c.req.param('id'));
    return note ? c.json(note) : c.json({ error: 'Not found' }, 404);
  });

  app.post('/api/notes', async (c) => {
    const body = await c.req.json().catch(() => null);
    const parsed = NewNoteSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message ?? 'Invalid note' }, 400);
    }
    return c.json(store.add(parsed.data), 201);
  });

  app.delete('/api/notes/:id', (c) =>
    store.remove(c.req.param('id')) ? c.body(null, 204) : c.json({ error: 'Not found' }, 404),
  );

  app.notFound((c) => c.json({ error: 'Not found' }, 404));

  return app;
}
