import { NextResponse } from "next/server";
// still need extra work to know the defferent role scenarios and the route of the application
export function middleware(req) {
    const token = req.cookies.get("token")?.value;
    const userInfo = req.cookies.get("userInfo")?.value;
    const url = req.nextUrl.pathname;

    if (!token || !userInfo) {
        // Not authenticated → redirect to /
        return NextResponse.redirect(new URL("/", req.url));
    }
    if (token && req.url.startsWith("/login") || req.url.startsWith("/register")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    const user = JSON.parse(userInfo);
    const role = user.role;


    // Disallow direct navigation
    if (
        (url.startsWith("/admin") && role !== "admin") ||
        (url.startsWith("/student") && role !== "student") ||
        (url.startsWith("/instructor") && role !== "instructor")
    ) {
        // Instead of redirect — just serve an empty response
        // This effectively cancels the navigation (page won't load)
        return NextResponse.redirect(new URL("/_unauthorized", req.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/student/:path*", "/instructor/:path*"],
};
