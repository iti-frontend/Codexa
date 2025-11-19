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
        <div className="animate-spin h-10 w-10 border-b-2 border-indigo-500 rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <p className="text-gray-400">No profile found</p>
      </div>
    );
  }

  const updatedDate = profile.updatedAt
    ? new Date(profile.updatedAt).toLocaleString("en-US")
    : "-";
console.log("role =", profile.role);

  return (
    <div className="min-h-screen  py-10 px-4 text-gray-200">
      <div className="max-w-4xl mx-auto">

        {/* TOP HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-indigo-600 to-purple-700 h-40 rounded-xl shadow-xl"
        >
          <motion.img
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            src={profile.profileImage || "/uploads/default-avatar.png"}
            className="absolute -bottom-16 left-10 w-32 h-32 rounded-full border-4 border-[#0d1117] shadow-xl object-cover"
          />
        </motion.div>

        {/* NAME + ROLE */}
        <div className="mt-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="f justify-between items-center flex-column"
          >
            <div>
              <h1 className="text-3xl font-bold text-white flex gap-3 items-center">
                {profile.name || "Unnamed"}
              </h1>
              <p className="flex items-center gap-2 text-gray-400 mt-2">
                <Mail size={16} /> {profile.email}
              </p>

              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-indigo-600/30 text-indigo-300 text-sm rounded-full font-semibold capitalize">
                  {profile.role || "student"}
                </span>
                


              </div>

              
            </div>

            <Link
              href={
                profile.role === "Instructor"
                  ? "/instructor/profile"
                  : "/student/profile"
              }
              className="w-full sm:w-auto sm:px-5 sm:py-2.5 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Edit Profile
            </Link>
          </motion.div>

          {/* BIO */}
          {profile.bio && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-8 bg-[#161b22] p-6 rounded-xl shadow-md"
            >
              <h3 className="text-lg font-semibold text-white mb-2">About</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </motion.div>
          )}

          {/* LINKS */}
          {profile.links && profile.links.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-8 bg-[#161b22] p-6 rounded-xl shadow-md"
            >
              <h3 className="text-lg font-semibold text-white mb-3">Links</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.links.map((link, i) => (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={i}
                    href={link.url}
                    target="_blank"
                    className="p-4 bg-[#1f242d] border border-gray-700 rounded-xl hover:border-indigo-500 transition flex items-center gap-3"
                  >
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center">
                      <Globe size={20} className="text-indigo-400" />
                    </div>

                    <div>
                      <p className="font-medium text-gray-200">
                        {link.label}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {link.url}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}

          {/* ACCOUNT DETAILS */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mt-8 bg-[#161b22] p-6 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <span className="text-gray-500 text-sm">Member Since</span>
                <p className="font-medium">
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Last Updated</span>
                <p className="font-medium text-indigo-400">{updatedDate}</p>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Account Status</span>
                <p
                  className={`font-medium ${
                    profile.isActive ? "text-green-400" : "text-red-500"
                  }`}
                >
                  {profile.isActive ? "Active" : "Inactive"}
                </p>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Auth Provider</span>
                <p className="font-medium capitalize">
                  {profile.authProvider || "email"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
