/**
 * Normalize a reading string.
 * - Strip control characters.
 * - Collapse internal whitespace.
 * - Trim.
 *
 * We intentionally do NOT transliterate katakana→hiragana or vice versa —
 * users may legitimately want either form.
 */
export const sanitizeReading = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};