const LOCALE = 'en-IN'

/** "9 Apr 2025" */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** "Apr 9" */
export function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(LOCALE, {
    month: 'short',
    day: 'numeric',
  })
}

/** "9 April 2025" */
export function formatLongDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
