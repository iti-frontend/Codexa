'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { getLocaleFromPathname } from '@/lib/locale';
import { defaultLocale } from '@/i18n.config';

// Import translations
import enTranslation from '../locales/en/translation.json';
import arTranslation from '../locales/ar/translation.json';

const resources = {
    en: {
        translation: enTranslation
    },
    ar: {
        translation: arTranslation
    }
};

// Initialize i18n
if (!i18n.isInitialized) {
    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: defaultLocale,
            fallbackLng: defaultLocale,
            interpolation: {
                escapeValue: false
            }
        });
}

export function I18nProvider({ children, initialLocale }) {
    const pathname = usePathname();

    useEffect(() => {
        // Get locale from pathname or use initialLocale or default
        const currentLocale = getLocaleFromPathname(pathname) || initialLocale || defaultLocale;

        // Only change language if it's different
        if (i18n.language !== currentLocale) {
            i18n.changeLanguage(currentLocale);
        }

        // Set direction and lang attribute
        const updateDirection = (lng) => {
            document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = lng;
        };

        updateDirection(currentLocale);

        // Listen for language changes
        const handleLanguageChange = (lng) => {
            updateDirection(lng);
            // Store preference in localStorage as backup
            if (typeof window !== 'undefined') {
                localStorage.setItem('locale', lng);
            }
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [pathname, initialLocale]);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
