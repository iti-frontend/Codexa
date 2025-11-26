"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Mail, Globe, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfileView() {
    const router = useRouter();
    const pathname = usePathname();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = () => {
        try {
            const userInfoCookie = document.cookie
                .split("; ")
                .find((row) => row.startsWith("userInfo="))
                ?.split("=")[1];

            if (userInfoCookie) {
                const user = JSON.parse(decodeURIComponent(userInfoCookie));
                setProfile(user);
            } else {
                setProfile(null);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => loadProfile(), [pathname]);
    useEffect(() => {
        const handleFocus = () => loadProfile();
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
                <div className="animate-spin h-12 w-12 border-b-2 border-indigo-500 rounded-full"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-gray-300">
                <p>No profile found</p>
            </div>
        );
    }

    const updatedDate = profile.updatedAt
        ? new Date(profile.updatedAt).toLocaleString("en-US")
        : "-";

    return (

    );
}
