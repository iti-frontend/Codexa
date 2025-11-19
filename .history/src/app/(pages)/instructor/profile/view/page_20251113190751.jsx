"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function InstructorProfileView() {
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

    useEffect(() => {
        loadProfile();
    }, [pathname]);

    useEffect(() => {
        const handleFocus = () => loadProfile();
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Profile not found</p>
                    <button
                        onClick={() => router.push("/instructor")}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const updatedDate = profile.updatedAt ? new Date(profile.updatedAt) : null;
    const formattedUpdated = updatedDate
        ? updatedDate.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        })
        : "-";

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header with Edit Button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-primary">My Profile</h1>
                    <Link
                        href="/instructor/profile"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Edit Profile
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>

                    <div className="px-8 pb-8">
                        {/* Profile Image and Basic Info */}
                        <div className="flex items-start -mt-16 mb-6">
                            <img
                                src={profile.profileImage || "/uploads/default-avatar.png"}
                                alt={profile.name || "Instructor"}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                            <div className="ml-6 mt-16">
                                <h2 className="text-2xl font-bold text-gray-800">{profile.name || "-"}</h2>
                                <p className="text-gray-600">{profile.email || "-"}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-3 py-1 bg-blue-100 text-primary text-sm font-medium rounded-full">
                                        {profile.role || "-"}
                                    </span>
                                    {profile.emailVerified && (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                            Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profile.bio}</p>
                            </div>
                        )}

                        {/* Links */}
                        {profile.links && profile.links.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Links</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {profile.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                    
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                                        >
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition">
                                                <svg
                                                    className="w-5 h-5 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 group-hover:text-blue-600 transition">
                                                    {link.label || "-"}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">{link.url}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Account Details */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Member Since</p>
                                    <p className="font-medium text-gray-800">
                                        {profile.createdAt
                                            ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Last Updated</p>
                                    <p className="font-medium text-gray-800">
                                        <span className="text-blue-600 font-semibold">{formattedUpdated}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Account Status</p>
                                    <p
                                        className={`font-medium ${profile.isActive ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        {profile.isActive ? "Active" : "Inactive"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Auth Provider</p>
                                    <p className="font-medium text-gray-800 capitalize">
                                        {profile.authProvider || "Email"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
