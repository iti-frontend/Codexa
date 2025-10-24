import { useAuthStore } from "@/store/useAuthStore";
import { NextResponse } from "next/server";
// ruined and need to be fixed Ignore it for now
export function middleware(request) {
    const { isSigned } = useAuthStore()
    if (!isSigned) return NextResponse.redirect(new URL('/login', request.url))
    console.log("middleware.......");
    return NextResponse.next();
}
export const config = {
    matcher: [
        '/InstructorDashboard',
        '/StudentDashboard',
        '/InstructorDashboard/:path*',
        '/StudentDashboard/:path*',
    ],
}