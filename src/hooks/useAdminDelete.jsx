import { ENDPOINTS } from "@/Constants/api-endpoints";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

export function useAdminDeleteUsers(role = "students") {
    const { userToken } = useAuthStore();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Validate role
    const validRoles = ["students", "instructors"];
    const selectedRole = validRoles.includes(role.toLowerCase())
        ? role.toLowerCase()
        : "students";

    // Map role to backend route
    const baseEndpoint =
        selectedRole === "students"
            ? ENDPOINTS.ADMIN_STUDENTS
            : ENDPOINTS.ADMIN_INSTRUCTORS;

    /**
     * Delete single OR multiple users.
     * Backend expects DELETE /students/:id (one at a time).
     */
    async function deleteUsers(ids) {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Convert single → array
            const idsArray = Array.isArray(ids) ? ids : [ids];

            // Execute delete requests in parallel
            const promises = idsArray.map((id) =>
                api.delete(`${baseEndpoint}/${id}`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                })
            );

            await Promise.all(promises);

            setSuccess(true);
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to delete user(s)";
            setError(msg);
            console.error("Error deleting users:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { deleteUsers, loading, error, success };
}

export function useAdminDeleteCourse() {
    const { userToken } = useAuthStore();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function deleteCourse(courseId) {
        if (!courseId) {
            setError("Invalid course ID");
            return false;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await api.delete(
                `${ENDPOINTS.ADMIN_COURSES}/${courseId}`,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            return res.data.success || true;
        } catch (err) {
            console.error("Delete course error:", err);
            setError(err.response?.data?.message || "Failed to delete course");
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {
        deleteCourse,
        loading,
        error,
    };
}