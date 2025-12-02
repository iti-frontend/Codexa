import { ENDPOINTS } from "@/Constants/api-endpoints";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

export function useAdminUserDetails(userId, role = "student") {
    const { userToken } = useAuthStore();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // -------- Validate role --------
    const validRoles = ["student", "instructor"];
    const selectedRole = validRoles.includes(role.toLowerCase())
        ? role.toLowerCase()
        : "student";

    // -------- Map role to endpoint --------
    const endpoint =
        selectedRole === "student"
            ? ENDPOINTS.ADMIN_STUDENTS
            : ENDPOINTS.ADMIN_INSTRUCTORS;

    useEffect(() => {
        if (!userId) return;

        async function fetchUser() {
            try {
                setLoading(true);

                const res = await api.get(`${endpoint}/${userId}`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });

                setData(res.data.user || res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load user details");
                console.error("useAdminUserDetails error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [userId, endpoint, userToken]);

    return { data, loading, error };
}
