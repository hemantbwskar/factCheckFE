/**
 * Returns today's local date formatted as YYYY-MM-DD for input default values.
 */
export const getTodayInputDate = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converts a date input string (e.g. YYYY-MM-DD or date string) into a valid UTC ISO string without milliseconds (e.g. 2026-07-25T00:00:00Z).
 */
export const formatToUTC = (dateStr: string): string => {
  if (!dateStr) return '';
  // If it's YYYY-MM-DD from <input type="date">
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return `${dateStr}T00:00:00Z`;
  }
  // If already an ISO string with Z
  if (dateStr.endsWith('Z')) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
  }
  // Parse text date in UTC context
  const dUtc = new Date(
    dateStr.includes('UTC') || dateStr.includes('GMT') ? dateStr : `${dateStr} UTC`
  );
  if (!isNaN(dUtc.getTime())) {
    return dUtc.toISOString().replace(/\.\d{3}Z$/, 'Z');
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

/**
 * Converts any valid date representation into a YYYY-MM-DD string suitable for HTML5 <input type="date">.
 */
export const formatToInputDate = (dateStr: string): string => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  const utcStr = formatToUTC(dateStr);
  const d = new Date(utcStr);
  if (isNaN(d.getTime())) return '';
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date string for display in the UI using UTC.
 * Example output: "Jan 10, 2026"
 */
export const formatDateForDisplay = (dateStr: string): string => {
  if (!dateStr) return '';
  const utcStr = formatToUTC(dateStr);
  const d = new Date(utcStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

/**
 * Robustly parses a date string into a numeric millisecond timestamp (guaranteed not NaN).
 */
export const parseTimestamp = (dateStr?: string): number => {
  if (!dateStr) return 0;
  let d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.getTime();
  }
  d = new Date(`${dateStr} UTC`);
  if (!isNaN(d.getTime())) {
    return d.getTime();
  }
  return 0;
};

/**
 * Extracts four-digit year number from a date string.
 */
export const getItemYear = (dateStr: string): number | null => {
  if (!dateStr) return null;
  const ts = parseTimestamp(dateStr);
  if (ts === 0) return null;
  const d = new Date(ts);
  return d.getUTCFullYear();
};

/**
 * Sorts array of timeline items in reverse chronological order (latest dates at top).
 */
export const sortTimelineItems = <T extends { date: string; id?: number }>(items: T[]): T[] => {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const timeA = parseTimestamp(a?.date);
    const timeB = parseTimestamp(b?.date);
    if (timeA !== timeB) {
      return timeB - timeA; // Descending: latest date (largest timestamp) first at top
    }
    return (b?.id || 0) - (a?.id || 0);
  });
};
