<<<<<<< HEAD
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
=======
import HomeCourses from "@/components/Home/HomeCourses";
import HomeFeatures from "@/components/Home/HomeFeatures";
import HomeHero from "@/components/Home/HomeHero";
import HomeNavbar from "@/components/Home/HomeNavbar";
import HomeCommunity from "@/components/Home/HomeCommunity";
import HomeStats from "@/components/Home/HomeStats";
import HomeTestimonials from "@/components/Home/HomeTestimonials";
import HomeCTA from "@/components/Home/HomeCTA";
import HomeFooter from "@/components/Home/HomeFooter";

export default function Home() {
  return (
    <>
      <HomeNavbar />
      <HomeHero />
      <HomeFeatures />
      <HomeCourses />
      <HomeCommunity />
      <HomeStats />
      <HomeTestimonials />
      <HomeCTA />
      <HomeFooter />
    </>
  );
>>>>>>> dev
}
