"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import { useAuthStore } from "@/store/useAuthStore";

export function useAdminAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userToken } = useAuthStore();

    const fetchAnalytics = async () => {
        try {
            const res = await api.get(ENDPOINTS.ADMIN_ANALYTICS, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setAnalytics(res.data);
        } catch (err) {
            console.error("Failed to fetch admin analytics:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return { analytics, loading, fetchAnalytics };
}

export function useAdminActivity() {
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    const { userToken } = useAuthStore();

    const fetchActivity = async () => {
        try {
            const res = await api.get(ENDPOINTS.ADMIN_ACTIVITY, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            setActivity(res.data);
        } catch (err) {
            console.error("Failed to fetch admin activity:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, []);

    return { activity, loading };
}
