import { describe, expect, it } from 'vitest';
import { formatDate } from '@/lib/format';

describe('formatDate', () => {
  it('formats an ISO timestamp', () => {
    expect(formatDate('2026-01-02T15:04:00.000Z')).toBe('Jan 2, 2026, 3:04 PM');
  });
});
