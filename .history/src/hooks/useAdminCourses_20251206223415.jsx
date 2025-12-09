import { ENDPOINTS } from "@/Constants/api-endpoints";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

// export function useAdminCourses({ page = 1, limit = 10 }) {
//     const { userToken } = useAuthStore();

//     const [courses, setCourses] = useState([]);
//     const [count, setCount] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         async function fetchCourses() {
//             try {
//                 setLoading(true);

//                 const res = await api.get(ENDPOINTS.ADMIN_COURSES, {
//                     params: { page, limit },
//                     headers: {
//                         Authorization: `Bearer ${userToken}`,
//                     },
//                 });

//                 setCourses(res.data.courses || []);
//                 setCount(res.data.count || 0);
//             } catch (err) {
//                 console.error("useAdminCourses error:", err);
//                 setError(err.response?.data?.message || "Failed to load courses");
//             } finally {
//                 setLoading(false);
//             }
//         }

//         fetchCourses();
//     }, [page, limit, userToken]);

//     return { courses, count, loading, error, setCourses };
// }
export function useAdminCourses({ page = 1, limit = 10 }) {
    const { userToken } = useAuthStore();

    const [courses, setCourses] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCourses = async () => {
        try {
            setLoading(true);

            const res = await api.get(ENDPOINTS.ADMIN_COURSES, {
                params: { page, limit },
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            setCourses(res.data.courses || []);
            setCount(res.data.count || 0);
        } catch (err) {
            console.error("useAdminCourses error:", err);
            setError(err.response?.data?.message || "Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [page, limit, userToken]);

    return { courses, setCourses, count, loading, error, refetch: fetchCourses };
}

export function useAdminCourseDetails(courseId) {
    const { userToken } = useAuthStore();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!courseId) return;

        async function fetchCourseDetails() {
            try {
                setLoading(true);
                setError(null);

                const res = await api.get(
                    `${ENDPOINTS.ADMIN_COURSES}/${courseId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );

                // API responds with { course: {...} }
                setData(res.data.course || res.data);
            } catch (err) {
                console.error("useAdminCourseDetails error:", err);
                setError(err.response?.data?.message || "Failed to load course details");
            } finally {
                setLoading(false);
            }
        }

        fetchCourseDetails();
    }, [courseId, userToken]);

    return {
        data,
        loading,
        error,
    };
}
