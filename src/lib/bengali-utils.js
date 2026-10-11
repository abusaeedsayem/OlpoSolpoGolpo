/**
 * Current Bengali date for the masthead পঞ্জিকা (teardrop header).
 * Used by Masthead. Does not depend on any DB column.
 */
export function getBengaliDate() {
    return new Intl.DateTimeFormat('bn-BD', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Dhaka',
    }).format(new Date());
}
/**
 * Short Bengali date (day month year).
 */
export function getBengaliDateShort() {
    return new Intl.DateTimeFormat('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Dhaka',
    }).format(new Date());
}
/**
 * Format a published-article date column for the byline.
 *
 * `published_at` is defined as `{ mode: 'timestamp' }` in the Drizzle schema,
 * so Drizzle returns a `Date` at read time (after coercing the stored epoch
 * integer). This helper accepts either that returned `Date` or a raw epoch and
 * formats it with the same boundary guards used at the seed writer so that rows
 * written by earlier seeds (which stored an ISO string by accident) read back
 * cleanly.
 */
export function publishedAtLabel(value) {
    var _a;
    if (value == null)
        return null;
    // The Drizzle return type is Date; guard against the rare case where a
    // reader-instance is handed a raw epoch.
    const date = value instanceof Date ? value : (_a = new Date(Number(value))) !== null && _a !== void 0 ? _a : new Date(0);
    if (Number.isNaN(date.getTime()))
        return null;
    return new Intl.DateTimeFormat('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Dhaka',
    }).format(date);
}
/**
 * Estimates reading time in minutes based on Bengali text.
 * Average Bengali reading speed: ~120 words/min
 */
export function estimateReadingTime(text) {
    const wordCount = text
        .replace(/<[^>]*>/g, '') // strip HTML
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 120));
    return readTime;
}
/**
 * Converts a number to Bengali numerals
 */
export function toBengaliNumerals(n) {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(n)
        .split('')
        .map((d) => (isNaN(parseInt(d)) ? d : bengaliDigits[parseInt(d)]))
        .join('');
}
/**
 * Generates a URL-safe slug from Bengali text
 */
export function generateSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\u0980-\u09FF\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
