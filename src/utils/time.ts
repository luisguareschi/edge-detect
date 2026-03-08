/**
 * Time utilities for timestamps and performance logging.
 */

/** Returns current time in ms (for performance measurements) */
export function now(): number {
  return Date.now();
}

/** Format timestamp for display (e.g. "Mar 7, 14:32") */
export function formatTimestamp(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
