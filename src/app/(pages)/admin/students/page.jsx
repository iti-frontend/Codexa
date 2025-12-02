"use client";

import AdminListCard from "@/components/Dashboard/AdminListCard";
import UserDetailsDrawer from "@/components/Dashboard/UserDetailsDrawer";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useAdminUserDetails } from "@/hooks/useAdminUserDetails"; // <-- ADD THIS
import { useState } from "react";

export default function StudentsPage() {
    const { loading, data: students, count } = useAdminUsers("students");
    const [viewUser, setViewUser] = useState(null);

    // ===== Fetch selected user details =====
    const {
        data: userDetails,
        loading: userLoading,
        error: userError,
    } = useAdminUserDetails(viewUser?._id, "student");

    return (
        <div className="p-6 space-y-6">
            {/* ===== Page Header ===== */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Students</h1>

                <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    Total: {count}
                </span>
            </div>

            {/* ===== Loading ===== */}
            {loading ? (
                <div className="min-h-screen flex justify-center">
                    <div className="animate-spin h-12 w-12 border-b-2 border-indigo-500 rounded-full"></div>
                </div>
            ) : (
                <>
                    <AdminListCard
                        items={students}
                        itemKey="name"
                        itemImageKey="image"
                        itemSubKey="email"
                        onView={(s) => setViewUser(s)}
                        onDelete={(s) => console.log("Delete student:", s)}
                    />

                    <UserDetailsDrawer
                        open={!!viewUser}
                        onClose={() => setViewUser(null)}
                        user={userDetails}          // <-- USE REAL DETAILS
                        loading={userLoading}       // <-- OPTIONAL: show loading inside drawer
                        error={userError}
                        onDelete={(u) => handleDelete(u)}
                    />
                </>
            )}
        </div>
    );
}
