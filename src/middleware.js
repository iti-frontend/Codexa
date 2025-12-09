import { NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n.config";
import { getLocaleFromPathname, removeLocaleFromPathname, detectLocale } from "./lib/locale";

export function middleware(req) {
    const { pathname } = req.nextUrl;

    // Public routes (NO AUTH required)
    const publicPaths = [
        "/",
        "/login",
        "/register",
        "/unauthorized",
        "/admin-portal-iti-login"
    ];

    // Extract locale info
    const pathnameLocale = getLocaleFromPathname(pathname);
    const cleanPath = removeLocaleFromPathname(pathname);
    const cookieLocale = req.cookies.get("locale")?.value || defaultLocale;

    const isPublicPath = publicPaths.includes(cleanPath);

    // ============================================================
    // 1️⃣ ROOT "/" → rewrite internally to locale (keeps URL clean)
    // ============================================================
    if (pathname === "/") {
        const cookieLocale = req.cookies.get("locale")?.value || defaultLocale;
        const url = new URL(`/${cookieLocale}`, req.url);
        return NextResponse.rewrite(url);
    }

    // ============================================================
    // 2️⃣ URL WITHOUT LOCALE → add it
    // ============================================================
    if (!pathnameLocale) {
        const locale = cookieLocale || detectLocale(req) || defaultLocale;
        const url = new URL(`/${locale}${pathname}`, req.url);
        const res = NextResponse.redirect(url);
        res.cookies.set("locale", locale);
        return res;
    }

    // ============================================================
    // 3️⃣ URL WITH INVALID LOCALE → fix it
    // ============================================================
    if (!locales.includes(pathnameLocale)) {
        const url = new URL(`/${defaultLocale}${cleanPath}`, req.url);
        const res = NextResponse.redirect(url);
        res.cookies.set("locale", defaultLocale);
        return res;
    }

    // ============================================================
    // 4️⃣ UPDATE COOKIE IF NECESSARY
    // ============================================================
    if (cookieLocale !== pathnameLocale) {
        const res = NextResponse.next();
        res.cookies.set("locale", pathnameLocale);
        return handleAuthentication(req, cleanPath, res);
    }

    // ============================================================
    // 5️⃣ AUTH CHECK
    // ============================================================
    return handleAuthentication(req, cleanPath);
}

// -------------------------------------------------------------
// AUTH LOGIC (unchanged)
// -------------------------------------------------------------
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
        "/admin-portal-iti-login"
    ];

    const isPublic = publicPaths.includes(pathname);
    const locale = getLocaleFromPathname(req.nextUrl.pathname) || defaultLocale;

    if (token && ["/login", "/register", "/admin-portal-iti-login"].includes(pathname)) {
        if (role === "student") return NextResponse.redirect(new URL(`/${locale}/student`, req.url));
        if (role === "instructor") return NextResponse.redirect(new URL(`/${locale}/instructor`, req.url));
        if (role === "admin") return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
    }

    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname.startsWith("/admin") && pathname !== "/admin-portal-iti-login" && role !== "admin") {
        return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
    }

    if (pathname.startsWith("/student") && role !== "student") {
        return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
    }

    if (pathname.startsWith("/instructor") && role !== "instructor") {
        return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
    }

    return response || NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|static|.*\\..*).*)"]
};
