"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import { useAuthStore } from "@/store/useAuthStore";

export function useStudentAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userToken } = useAuthStore();

    const fetchAnalytics = async () => {
        try {
            const res = await api.get(ENDPOINTS.STUDENT_ANALYTICS, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setAnalytics(res.data);
        } catch (err) {
            console.error("Failed to fetch analytics:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return { analytics, loading, fetchAnalytics };
}
