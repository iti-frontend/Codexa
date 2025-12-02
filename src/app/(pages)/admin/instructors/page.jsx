"use client";
import AdminListCard from "@/components/Dashboard/AdminListCard";
import UserDetailsDrawer from "@/components/Dashboard/UserDetailsDrawer";
import { useAdminUserDetails } from "@/hooks/useAdminUserDetails";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useState } from "react";

export default function InstructorsPage() {
    const { loading, data: instructors, count } = useAdminUsers("instructors");
    const [viewUser, setViewUser] = useState(null);
    // ===== Fetch selected user details =====
    const {
        data: userDetails,
        loading: userLoading,
        error: userError,
    } = useAdminUserDetails(viewUser?._id, "instructor");

    return (
        <div className="p-6 space-y-6">
            {/* ===== Page Header ===== */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">instructors</h1>
                {/* Count Badge */}
                <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    Total: {count}
                </span>
            </div>

            {/* ===== Loading ===== */}
            {loading ? (
                <div className="min-h-screen flex justify-center ">
                    <div className="animate-spin h-12 w-12 border-b-2 border-indigo-500 rounded-full"></div>
                </div>
            ) : (
                <>


                    <AdminListCard
                        // title="instructors"
                        items={instructors}
                        itemKey="name"
                        itemImageKey="image"
                        itemSubKey="email"
                        onView={(s) => setViewUser(s)}
                        onDelete={(s) => console.log("Delete instructor:", s)}
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
