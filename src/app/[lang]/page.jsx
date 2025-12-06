import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n.config';

export default async function LangPage({ params }) {
    const { lang } = await params;

    // Redirect to the appropriate home page based on role
    // This will be handled by middleware for authenticated users
    redirect(`/${lang}/community`);
    //   redirect(`/${lang}`);
}
