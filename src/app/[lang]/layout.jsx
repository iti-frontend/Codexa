"use client";

import { useEffect } from "react";
import { I18nProvider } from "@/providers/I18nProvider";

import { Toaster } from "@/components/ui/sonner";
import { isRTL } from "@/i18n.config";
import { use } from "react";

export default function LangLayout({ children, params }) {
  // Unwrap the params promise
  const { lang } = use(params);
  const direction = isRTL(lang) ? "rtl" : "ltr";

  useEffect(() => {
    // Set lang and dir on html element
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
  }, [lang, direction]);

  return (
    <I18nProvider initialLocale={lang}>
      {children}

      <Toaster />
    </I18nProvider>
  );
}
