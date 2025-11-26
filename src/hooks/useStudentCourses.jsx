"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import { useAuthStore } from "@/store/useAuthStore";

export function useStudentCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courseLoading, setCourseLoading] = useState(false);

    const { userToken } = useAuthStore();


    //  Fetch all enrolled courses
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


    //    Fetch single course by ID

    const fetchCourseById = async (courseId) => {
        setCourseLoading(true);

        try {
            const endpoint = ENDPOINTS.GET_STUDENT_COURSES_BY_ID.replace(
                "{courseId}",
                courseId
            );

            const res = await api.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            return res.data;
        } catch (error) {
            console.error("Failed to load student course:", error);
            throw error;
        } finally {
            setCourseLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return {
        courses,
        loading,
        fetchCourseById,
        courseLoading,
    };
}
