"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import { useAuthStore } from "@/store/useAuthStore";

export function useStudentCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const { userToken } = useAuthStore();

    const fetchCourses = async () => {
        try {
            const res = await api.get(ENDPOINTS.GET_STUDENT_COURSES, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setCourses(res.data || []);
        } catch (error) {
            console.error("Failed to load student courses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return { courses, loading };
}
