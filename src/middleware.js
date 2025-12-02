import { NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n.config";
import { getLocaleFromPathname, removeLocaleFromPathname, detectLocale } from "./lib/locale";

export function middleware(req) {
    const { pathname } = req.nextUrl;

    // Public routes that don't need locale prefix
    const publicPaths = ["/", "/login", "/register", "/unauthorized"];

    // Check if it's a public path (exact match)
    const isPublicPath = publicPaths.includes(pathname);

    // Check if pathname already has a locale
    const pathnameLocale = getLocaleFromPathname(pathname);

    // If it's a public path, skip locale handling
    if (isPublicPath) {
        return handleAuthentication(req, pathname);
    }

    // If path doesn't have a locale and it's not a public path, redirect to add locale
    if (!pathnameLocale) {
        const locale = detectLocale(req);
        const newUrl = new URL(`/${locale}${pathname}`, req.url);
        const response = NextResponse.redirect(newUrl);
        response.cookies.set('locale', locale, { path: '/' });
        return response;
    }

    // If path has a locale, validate it
    if (!locales.includes(pathnameLocale)) {
        // Invalid locale, redirect to default
        const cleanPath = removeLocaleFromPathname(pathname);
        const newUrl = new URL(`/${defaultLocale}${cleanPath}`, req.url);
        const response = NextResponse.redirect(newUrl);
        response.cookies.set('locale', defaultLocale, { path: '/' });
        return response;
    }

    // Set locale cookie if not already set or different
    const cookieLocale = req.cookies.get('locale')?.value;
    if (cookieLocale !== pathnameLocale) {
        const response = NextResponse.next();
        response.cookies.set('locale', pathnameLocale, { path: '/' });

        // Continue with authentication check
        return handleAuthentication(req, removeLocaleFromPathname(pathname), response);
    }

    // Handle authentication for localized routes
    return handleAuthentication(req, removeLocaleFromPathname(pathname));
}

function handleAuthentication(req, pathname, response = null) {
    const token = req.cookies.get("token")?.value;
    const userInfoCookie = req.cookies.get("userInfo")?.value;

    // Parse user role if exists
    let role = "";
    if (userInfoCookie) {
        try {
            const user = JSON.parse(userInfoCookie);
            role = user?.role?.toLowerCase() || "";
        } catch (e) {
            console.error("Failed to parse userInfo cookie:", e);
        }
    }

    // Public paths
    const publicPaths = ["/", "/login", "/register", "/unauthorized"];
    const isPublic = publicPaths.some((path) => pathname.startsWith(path));

    // Get locale from original URL
    const locale = getLocaleFromPathname(req.nextUrl.pathname) || defaultLocale;

    // Logged-in users trying to access login/register → redirect
    if (token && isPublic && ["/login", "/register"].includes(pathname)) {
        if (role === "student") return NextResponse.redirect(new URL(`/${locale}/student`, req.url));
        if (role === "instructor") return NextResponse.redirect(new URL(`/${locale}/instructor`, req.url));
        if (role === "admin") return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
    }

    // Protect private routes
    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Role-based protection
    if (pathname.startsWith("/student") && role !== "student") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/instructor") && role !== "instructor") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return response || NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/register",
        "/unauthorized",
        "/(en|ar)/:path*",
    ],
};
