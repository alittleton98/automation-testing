/** Formats an ISO timestamp for display, e.g. "Jan 2, 2026, 3:04 PM". */
export function formatDate(iso: string, timeZone = 'UTC'): string {
  return new Date(iso).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  });
}
