"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Mail, User, Globe, CheckCircle, Calendar, Shield } from "lucide-react";

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">No profile found</p>
            </div>
        );
    }

    const updatedDate = profile.updatedAt
        ? new Date(profile.updatedAt).toLocaleString("en-US")
        : "-";

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">

                {/* TOP HEADER */}
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 h-36 rounded-xl shadow-md">
                    <div className="absolute -bottom-14 left-10">
                        <img
                            src={profile.profileImage || "/uploads/default-avatar.png"}
                            className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                        />
                    </div>
                </div>

                <div className="mt-20 px-4">

                    {/* NAME + ROLE + VERIFIED */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex gap-3 items-center">
                                {profile.name || "Unnamed"}
                            </h1>

                            <div className="flex items-center gap-3 mt-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold capitalize">
                                    {profile.role || "student"}
                                </span>

                                {profile.emailVerified && (
                                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                        <CheckCircle size={16} /> Verified
                                    </span>
                                )}
                            </div>

                            <p className="flex items-center gap-2 text-gray-600 mt-2">
                                <Mail size={16} /> {profile.email}
                            </p>
                        </div>

                        <Link
                            href={
                                profile.role === "instructor"
                                    ? "/instructor/profile"
                                    : "/student/profile"
                            }
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Edit Profile
                        </Link>
                    </div>

                    {/* BIO */}
                    {profile.bio && (
                        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {profile.bio}
                            </p>
                        </div>
                    )}

                    {/* LINKS */}
                    {profile.links && profile.links.length > 0 && (
                        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Links</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {profile.links.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        className="p-4 border rounded-xl hover:bg-blue-50 transition group flex items-center gap-3"
                                    >
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200">
                                            <Globe size={20} className="text-blue-700" />
                                        </div>

                                        <div>
                                            <p className="font-medium text-gray-800 group-hover:text-blue-700">
                                                {link.label}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {link.url}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ACCOUNT DETAILS */}
                    <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">Member Since</span>
                                <span className="font-medium text-gray-900">
                                    {profile.createdAt
                                        ? new Date(profile.createdAt).toLocaleDateString()
                                        : "-"}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">Last Updated</span>
                                <span className="font-medium text-blue-700">{updatedDate}</span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">Account Status</span>
                                <span
                                    className={`font-medium ${
                                        profile.isActive ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {profile.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">Auth Provider</span>
                                <span className="font-medium capitalize">
                                    {profile.authProvider || "email"}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
