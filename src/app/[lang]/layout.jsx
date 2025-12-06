'use client';

import { useEffect } from 'react';
import { I18nProvider } from "@/providers/I18nProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { isRTL } from "@/i18n.config";
import { use } from 'react';

export default function LangLayout({ children, params }) {
    // Unwrap the params promise
    const { lang } = use(params);
    const direction = isRTL(lang) ? 'rtl' : 'ltr';

    useEffect(() => {
        // Set lang and dir on html element
        document.documentElement.lang = lang;
        document.documentElement.dir = direction;
    }, [lang, direction]);

    return (
        <I18nProvider initialLocale={lang}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
            <Toaster />
        </I18nProvider>
    );
}
