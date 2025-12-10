
import { NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n.config";
import { getLocaleFromPathname, removeLocaleFromPathname, detectLocale } from "./lib/locale";

export function middleware(req) {
    const { pathname } = req.nextUrl;

    // PUBLIC (no locale allowed in URL)
    const publicPaths = [
        "/",
        "/login",
        "/register",
        "/unauthorized",
        "/admin-portal-iti-login",
    ];

    const pathnameLocale = getLocaleFromPathname(pathname);
    const cleanPath = removeLocaleFromPathname(pathname);
    const cookieLocale = req.cookies.get("locale")?.value || defaultLocale;

    // ============================================================
    // 1️⃣ ROOT "/" → rewrite internally to locale (keeps URL as "/")
    // ============================================================
    if (pathname === "/") {
        const locale = cookieLocale || detectLocale(req) || defaultLocale;
        const url = new URL(`/${locale}`, req.url);
        const res = NextResponse.rewrite(url);
        // Preserve ALL cookies from request with proper attributes
        req.cookies.getAll().forEach(cookie => {
            res.cookies.set(cookie.name, cookie.value, {
                path: '/',
                sameSite: 'lax',
            });
        });
        // Set locale cookie
        res.cookies.set("locale", locale, {
            path: '/',
            sameSite: 'lax',
        });
        return handleAuthentication(req, "/", res);
    }

    // ============================================================
    // 2️⃣ REDIRECT /${locale} (e.g., /en, /ar) → / (keep URL clean)
    // ============================================================
    if (pathnameLocale && pathname === `/${pathnameLocale}`) {
        if (locales.includes(pathnameLocale)) {
            // Valid locale - redirect to "/" and preserve all cookies
            const res = NextResponse.redirect(new URL("/", req.url));
            // Copy all cookies from request to preserve them
            req.cookies.getAll().forEach(cookie => {
                res.cookies.set(cookie.name, cookie.value);
            });
            // Update locale cookie
            res.cookies.set("locale", pathnameLocale);
            return res;
        } else {
            // Invalid locale - redirect to "/" with default locale
            const res = NextResponse.redirect(new URL("/", req.url));
            // Copy all cookies from request to preserve them
            req.cookies.getAll().forEach(cookie => {
                res.cookies.set(cookie.name, cookie.value);
            });
            res.cookies.set("locale", defaultLocale);
            return res;
        }
    }

    // ============================================================
    // 3️⃣ PUBLIC ROUTES MUST NOT HAVE LOCALE
    //    (excluding the root locale paths which are handled above)
    // ============================================================
    const isPublic = publicPaths.includes(cleanPath);
    if (isPublic && pathnameLocale) {
        // Public path with locale - redirect to clean path
        const res = NextResponse.redirect(new URL(cleanPath, req.url));
        // Copy all cookies from request to preserve them
        req.cookies.getAll().forEach(cookie => {
            res.cookies.set(cookie.name, cookie.value);
        });
        return res;
    }

    // Public path without locale - allow it (next() preserves cookies automatically)
    if (isPublic && !pathnameLocale) {
        return NextResponse.next();
    }

    // ============================================================
    // 4️⃣ PROTECTED ROUTES MUST HAVE LOCALE
    // ============================================================
    if (!pathnameLocale) {
        const locale = cookieLocale || detectLocale(req) || defaultLocale;
        const res = NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
        // Copy all cookies from request to preserve them
        req.cookies.getAll().forEach(cookie => {
            res.cookies.set(cookie.name, cookie.value);
        });
        res.cookies.set("locale", locale);
        return res;
    }

    // ============================================================
    // 5️⃣ INVALID LOCALE → FIX
    // ============================================================
    if (!locales.includes(pathnameLocale)) {
        const res = NextResponse.redirect(new URL(`/${defaultLocale}${cleanPath}`, req.url));
        // Copy all cookies from request to preserve them
        req.cookies.getAll().forEach(cookie => {
            res.cookies.set(cookie.name, cookie.value);
        });
        res.cookies.set("locale", defaultLocale);
        return res;
    }

    // ============================================================
    // 6️⃣ UPDATE LOCALE COOKIE
    // ============================================================
    const res = NextResponse.next();
    // Update locale cookie if needed (next() preserves other cookies automatically)
    if (!req.cookies.get("locale") || req.cookies.get("locale").value !== pathnameLocale) {
        res.cookies.set("locale", pathnameLocale);
    }

    // ============================================================
    // 7️⃣ AUTH
    // ============================================================
    return handleAuthentication(req, cleanPath, res);
}



function handleAuthentication(req, pathname, response = null) {
    const token = req.cookies.get("token")?.value;
    const userInfoCookie = req.cookies.get("userInfo")?.value;

    let role = "";
    if (userInfoCookie) {
        try {
            role = JSON.parse(userInfoCookie)?.role?.toLowerCase() || "";
        } catch { }
    }

    const publicPaths = [
        "/",
        "/login",
        "/register",
        "/unauthorized",
        "/admin-portal-iti-login",
    ];

    const isPublic = publicPaths.includes(pathname);
    const locale = getLocaleFromPathname(req.nextUrl.pathname) || defaultLocale;

    // Helper function to preserve cookies in redirects
    const createRedirectWithCookies = (url) => {
        const res = NextResponse.redirect(new URL(url, req.url));
        // Preserve all existing cookies
        req.cookies.getAll().forEach(cookie => {
            res.cookies.set(cookie.name, cookie.value);
        });
        return res;
    };

    if (token && ["/login", "/register", "/admin-portal-iti-login"].includes(pathname)) {
        if (role === "student") return createRedirectWithCookies(`/${locale}/student`);
        if (role === "instructor") return createRedirectWithCookies(`/${locale}/instructor`);
        if (role === "admin") return createRedirectWithCookies(`/${locale}/admin`);
    }

    if (!token && !isPublic) {
        return createRedirectWithCookies("/login");
    }

    if (pathname.startsWith("/admin") && pathname !== "/admin-portal-iti-login" && role !== "admin") {
        return createRedirectWithCookies(`/${locale}/unauthorized`);
    }

    if (pathname.startsWith("/student") && role !== "student") {
        return createRedirectWithCookies(`/${locale}/unauthorized`);
    }

    if (pathname.startsWith("/instructor") && role !== "instructor") {
        return createRedirectWithCookies(`/${locale}/unauthorized`);
    }

    // If a response was provided (like from rewrite), return it as-is
    // Don't modify cookies here as they should already be set in the response
    if (response) {
        return response;
    }

    // Otherwise, create a new next() response with cookies
    const res = NextResponse.next();
    req.cookies.getAll().forEach(cookie => {
        res.cookies.set(cookie.name, cookie.value);
    });
    return res;
}



export const config = {
    matcher: ["/((?!_next|static|.*\\..*).*)"],
};
