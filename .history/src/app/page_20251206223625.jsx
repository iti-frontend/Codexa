import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { defaultLocale, locales } from '@/i18n.config';

export default function Home() {
  // Try to get locale from cookie
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('locale');

  let detectedLocale = defaultLocale;

  if (localeCookie && locales.includes(localeCookie.value)) {
    detectedLocale = localeCookie.value;
  } else {
    // Try to detect from browser
    const headersList = headers();
    const acceptLanguage = headersList.get('accept-language');

    if (acceptLanguage) {
      const browserLocale = acceptLanguage.split(',')[0].split('-')[0];
      if (locales.includes(browserLocale)) {
        detectedLocale = browserLocale;
      }
    }
  }

  // Redirect to detected locale
  redirect(`/${detectedLocale}`);
}
