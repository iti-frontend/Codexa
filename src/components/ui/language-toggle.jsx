"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { locales } from "@/i18n.config";
import { getLocaleFromPathname, removeLocaleFromPathname, addLocaleToPathname } from "@/lib/locale";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (newLocale) => {
    // Get current locale from pathname
    const currentLocale = getLocaleFromPathname(pathname);

    if (currentLocale === newLocale) return;

    // Remove current locale and add new one
    const pathWithoutLocale = removeLocaleFromPathname(pathname);
    const newPath = addLocaleToPathname(pathWithoutLocale, newLocale);

    // Navigate to new path
    router.push(newPath);

    // Update i18n (this will trigger the language change)
    i18n.changeLanguage(newLocale);
  };

  const currentLocale = getLocaleFromPathname(pathname) || i18n.language;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`cursor-pointer ${currentLocale === language.code ? 'bg-accent' : ''
              }`}
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
