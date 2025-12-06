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
        "/admin-portal-iti-login" // admin login is public
    ];

    // Remove locale (ex: /en/login → /login)
    const cleanPath = removeLocaleFromPathname(pathname);

    const isPublicPath = publicPaths.includes(cleanPath);

    const pathnameLocale = getLocaleFromPathname(pathname);

    // ========== 1. PUBLIC ROUTES ==========
    if (isPublicPath) {
        return handleAuthentication(req, cleanPath);
    }

    // ========== 2. NO LOCALE → ADD LOCALE ==========
    if (!pathnameLocale) {
        const locale = detectLocale(req);
        const newUrl = new URL(`/${locale}${pathname}`, req.url);
        const res = NextResponse.redirect(newUrl);
        res.cookies.set("locale", locale);
        return res;
    }

    // ========== 3. INVALID LOCALE → FIX ==========
    if (!locales.includes(pathnameLocale)) {
        const newUrl = new URL(`/${defaultLocale}${cleanPath}`, req.url);
        const res = NextResponse.redirect(newUrl);
        res.cookies.set("locale", defaultLocale);
        return res;
    }

    // ========== 4. UPDATE COOKIE IF NEEDED ==========
    const cookieLocale = req.cookies.get("locale")?.value;
    if (cookieLocale !== pathnameLocale) {
        const res = NextResponse.next();
        res.cookies.set("locale", pathnameLocale);
        return handleAuthentication(req, cleanPath, res);
    }

    // ========== 5. AUTH CHECK FOR PROTECTED ROUTES ==========
    return handleAuthentication(req, cleanPath);
}

// -----------------------------------------------
// AUTH LOGIC
// -----------------------------------------------
function handleAuthentication(req, pathname, response = null) {
    const token = req.cookies.get("token")?.value;
    const userInfoCookie = req.cookies.get("userInfo")?.value;

    let role = "";
    if (userInfoCookie) {
        try {
            role = JSON.parse(userInfoCookie)?.role?.toLowerCase() || "";
        } catch {
            console.error("Failed to parse userInfo cookie");
        }
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

    // ---------- Logged-in user trying to access login/register/admin-login ----------
    if (token && ["/login", "/register", "/admin-portal-iti-login"].includes(pathname)) {
        if (role === "student") return NextResponse.redirect(new URL(`/${locale}/student`, req.url));
        if (role === "instructor") return NextResponse.redirect(new URL(`/${locale}/instructor`, req.url));
        if (role === "admin") return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
    }

    // ---------- Unauthenticated visiting protected route ----------
    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // ---------- Role-based protection ----------
    if (
        pathname.startsWith("/admin") &&
        pathname !== "/admin-portal-iti-login" && // IMPORTANT FIX
        role !== "admin"
    ) {
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
    matcher: [
        "/((?!_next|static|.*\\..*).*)" // intercept all pages except internal files
    ],
};
