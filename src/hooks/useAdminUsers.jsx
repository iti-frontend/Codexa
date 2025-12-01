import { ENDPOINTS } from "@/Constants/api-endpoints";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

export function useAdminUsers(role = "students") {
    const { userToken } = useAuthStore();

    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // -------- Validate role --------
    const validRoles = ["students", "instructors"];
    const selectedRole = validRoles.includes(role.toLowerCase())
        ? role.toLowerCase()
        : "students";

    // -------- Map role to endpoint --------
    const endpoint =
        selectedRole === "students"
            ? ENDPOINTS.ADMIN_STUDENTS
            : ENDPOINTS.ADMIN_INSTRUCTORS;

    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                const res = await api.get(endpoint, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });

                setData(res.data.students || res.data.instructors || []);
                setCount(res.data.count || 0);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load data");
                console.error("useAdminUsers error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [endpoint, userToken]);

    return { data, count, loading, error };
}
