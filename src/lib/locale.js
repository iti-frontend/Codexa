import { locales, defaultLocale } from '@/i18n.config';

/**
 * Extract locale from pathname
 * @param {string} pathname - The URL pathname
 * @returns {string|null} - The locale if found, null otherwise
 */
export function getLocaleFromPathname(pathname) {
    const segments = pathname.split('/');
    const potentialLocale = segments[1];

    if (locales.includes(potentialLocale)) {
        return potentialLocale;
    }

    return null;
}

/**
 * Remove locale prefix from pathname
 * @param {string} pathname - The URL pathname
 * @returns {string} - The pathname without locale prefix
 */
export function removeLocaleFromPathname(pathname) {
    const segments = pathname.split('/').filter(Boolean); // Remove empty strings

    // Check if first segment is a locale
    if (segments.length > 0 && locales.includes(segments[0])) {
        // Remove the locale segment
        segments.shift();
        // Return the path without locale, or '/' if empty
        return segments.length > 0 ? `/${segments.join('/')}` : '/';
    }

    return pathname;
}

/**
 * Add locale prefix to pathname
 * @param {string} pathname - The URL pathname
 * @param {string} locale - The locale to add
 * @returns {string} - The pathname with locale prefix
 */
export function addLocaleToPathname(pathname, locale = defaultLocale) {
    // Ensure pathname starts with /
    const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

    // Remove any existing locale first
    const cleanPath = removeLocaleFromPathname(normalizedPath);

    // Add the new locale
    if (cleanPath === '/') {
        return `/${locale}`;
    }

    return `/${locale}${cleanPath}`;
}

/**
 * Get locale from cookie or browser or default
 * @param {Request} request - The request object
 * @returns {string} - The detected locale
 */
export function detectLocale(request) {
    // Try to get from cookie
    const cookieLocale = request.cookies.get('locale')?.value;
    if (locales.includes(cookieLocale)) {
        return cookieLocale;
    }

    // Try to get from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
        const browserLocale = acceptLanguage.split(',')[0].split('-')[0];
        if (locales.includes(browserLocale)) {
            return browserLocale;
        }
    }

    return defaultLocale;
}
