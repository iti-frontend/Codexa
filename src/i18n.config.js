// Supported locales
export const locales = ['en', 'ar'];

// Default locale
export const defaultLocale = 'en';

// Locale labels for display
export const localeLabels = {
    en: 'English',
    ar: 'العربية'
};

// RTL locales
export const rtlLocales = ['ar'];

// Check if a locale is RTL
export function isRTL(locale) {
    return rtlLocales.includes(locale);
}

// Validate and return locale
export function getValidLocale(locale) {
    return locales.includes(locale) ? locale : defaultLocale;
}
