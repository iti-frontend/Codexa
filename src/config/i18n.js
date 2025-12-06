import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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

// Get saved language from localStorage or default to browser language
const savedLanguage = typeof window !== 'undefined'
    ? localStorage.getItem('language')
    : null;

const browserLanguage = typeof window !== 'undefined'
    ? navigator.language.split('-')[0]
    : 'en';

const defaultLanguage = savedLanguage || (browserLanguage === 'ar' ? 'ar' : 'en');

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: defaultLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // React already escapes values
        },
        react: {
            useSuspense: false // Disable suspense to avoid SSR issues
        }
    });

// Update document direction when language changes
i18n.on('languageChanged', (lng) => {
    if (typeof window !== 'undefined') {
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lng;
        localStorage.setItem('language', lng);
    }
});

// Set initial direction
if (typeof window !== 'undefined') {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
}

export default i18n;
