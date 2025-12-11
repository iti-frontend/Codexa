import { NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n.config";
import { getLocaleFromPathname, removeLocaleFromPathname, detectLocale } from "./lib/locale";

export function middleware(req) {
    const { pathname } = req.nextUrl;

    // Public pages — no locale in URL
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

    const isPublic = publicPaths.includes(cleanPath);

    /* ------------------------------------------------------------
       1) ROOT "/" → rewrite internally to /[locale], keep URL clean
       ------------------------------------------------------------ */
    if (pathname === "/") {
        const locale = cookieLocale || detectLocale(req) || defaultLocale;

        const res = NextResponse.rewrite(new URL(`/${locale}`, req.url));

        // Preserve cookies
        req.cookies.getAll().forEach(c =>
            res.cookies.set(c.name, c.value, { path: "/", sameSite: "lax" })
        );

        res.cookies.set("locale", locale);
        return handleAuth(req, "/", res);
    }

    /* ------------------------------------------------------------
       2) Visiting /en or /ar → treat as localized root
       ------------------------------------------------------------ */
    if (pathnameLocale && pathname === `/${pathnameLocale}`) {
        const res = NextResponse.next();
        res.cookies.set("locale", pathnameLocale);
        return res;
    }

    /* ------------------------------------------------------------
       3) PUBLIC paths MUST NOT have locale in URL
       ------------------------------------------------------------ */
    if (isPublic && pathnameLocale) {
        const res = NextResponse.redirect(new URL(cleanPath, req.url));
        req.cookies.getAll().forEach(c => res.cookies.set(c.name, c.value));
        res.cookies.set("locale", pathnameLocale);
        return handleAuth(req, cleanPath, res);
    }

    // Public & NO locale → allow but use cookie locale
    if (isPublic && !pathnameLocale) {
        const res = NextResponse.next();
        res.cookies.set("locale", cookieLocale);
        return handleAuth(req, cleanPath, res);
    }

    /* ------------------------------------------------------------
       4) Protected routes MUST include locale
       ------------------------------------------------------------ */
    if (!pathnameLocale) {
        const locale = cookieLocale || detectLocale(req) || defaultLocale;
        const res = NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
        req.cookies.getAll().forEach(c => res.cookies.set(c.name, c.value));
        res.cookies.set("locale", locale);
        return res;
    }

    /* ------------------------------------------------------------
       5) Invalid locale → fix it
       ------------------------------------------------------------ */
    if (!locales.includes(pathnameLocale)) {
        const res = NextResponse.redirect(new URL(`/${defaultLocale}${cleanPath}`, req.url));
        req.cookies.getAll().forEach(c => res.cookies.set(c.name, c.value));
        res.cookies.set("locale", defaultLocale);
        return res;
    }

    /* ------------------------------------------------------------
       6) Update locale cookie on every localized route
       ------------------------------------------------------------ */
    const res = NextResponse.next();
    res.cookies.set("locale", pathnameLocale);

    /* ------------------------------------------------------------
       7) Auth logic
       ------------------------------------------------------------ */
    return handleAuth(req, cleanPath, res);
}


/* ------------------------------------------------------------
   AUTH HANDLER
------------------------------------------------------------ */
function handleAuth(req, pathname, response = null) {
    const token = req.cookies.get("token")?.value;
    const userInfo = req.cookies.get("userInfo")?.value;

    let role = "";
    try {
        if (userInfo) role = JSON.parse(userInfo)?.role?.toLowerCase() || "";
    } catch { }

    const publicPaths = [
        "/",
        "/login",
        "/register",
        "/unauthorized",
        "/admin-portal-iti-login",
    ];

    const isPublic = publicPaths.includes(pathname);
    const localeFromPath = getLocaleFromPathname(req.nextUrl.pathname);
    const locale = localeFromPath || req.cookies.get("locale")?.value || defaultLocale;

    const redirectWithCookies = (to) => {
        const res = NextResponse.redirect(new URL(to, req.url));
        req.cookies.getAll().forEach(c => res.cookies.set(c.name, c.value));
        return res;
    };

    // Logged-in user trying to access login/register/admin-login
    if (token && ["/login", "/register", "/admin-portal-iti-login"].includes(pathname)) {
        if (role === "student") return redirectWithCookies(`/${locale}/student`);
        if (role === "instructor") return redirectWithCookies(`/${locale}/instructor`);
        if (role === "admin") return redirectWithCookies(`/${locale}/admin`);
    }

    // Unauthenticated user accessing protected route
    if (!token && !isPublic) {
        return redirectWithCookies("/login");
    }

    // Role-based protection
    if (pathname.startsWith("/admin") && role !== "admin") {
        return redirectWithCookies(`/${locale}/unauthorized`);
    }
    if (pathname.startsWith("/student") && role !== "student") {
        return redirectWithCookies(`/${locale}/unauthorized`);
    }
    if (pathname.startsWith("/instructor") && role !== "instructor") {
        return redirectWithCookies(`/${locale}/unauthorized`);
    }

    return response || NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|static|.*\\..*).*)"],
};
