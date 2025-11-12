import { NextResponse } from "next/server";

export function middleware(req) {
    const { pathname } = req.nextUrl;
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

    //  Public routes
    const publicPaths = ["/", "/login", "/register", "/unauthorized"];
    const isPublic = publicPaths.some((path) => pathname.startsWith(path));

    //  Logged-in users trying to access login/register → redirect
    if (token && isPublic && ["/login", "/register"].includes(pathname)) {
        if (role === "student") return NextResponse.redirect(new URL("/student", req.url));
        if (role === "instructor") return NextResponse.redirect(new URL("/instructor", req.url));
        if (role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
    }

    // //  Block direct access to /_unauthorized  ---> 
    // if (pathname === "/unauthorized" && !req.headers.get("referer")) {
    //     return NextResponse.redirect(new URL("/", req.url));
    // }

    // Protect private routes
    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    //  Role-based protection
    if (pathname.startsWith("/student") && role !== "student") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/instructor") && role !== "instructor") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/register",
        "/student/:path*",
        "/instructor/:path*",
        "/admin/:path*",
        "/unauthorized",
    ],
};
