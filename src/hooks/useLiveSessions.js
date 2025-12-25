import { useState, useEffect, useRef, useCallback } from 'react';
import liveSessionService from '@/services/liveSessionService';
import { toast } from 'sonner';

// Cache for sessions to prevent excessive API calls
let sessionsCache = {
    data: null,
    timestamp: 0,
    filters: null,
};

const CACHE_DURATION = 30000; // 30 seconds cache

export const useLiveSessions = (filters = {}, options = {}) => {
    const { enablePolling = false, pollInterval = 30000 } = options;
    const [sessions, setSessions] = useState(sessionsCache.data || []);
    const [loading, setLoading] = useState(!sessionsCache.data);
    const [error, setError] = useState(null);
    const isFetching = useRef(false);
    const pollIntervalRef = useRef(null);

    const fetchSessions = useCallback(async (force = false) => {
        const filtersKey = JSON.stringify(filters);
        const now = Date.now();

        // Check cache validity (unless forced)
        if (!force &&
            sessionsCache.data &&
            sessionsCache.filters === filtersKey &&
            (now - sessionsCache.timestamp) < CACHE_DURATION) {
            setSessions(sessionsCache.data);
            setLoading(false);
            return;
        }

        // Prevent concurrent fetches
        if (isFetching.current) return;
        isFetching.current = true;

        try {
            setLoading(true);
            const data = await liveSessionService.getAllSessions(filters);
            const sessionData = data.sessions || [];

            // Update cache
            sessionsCache = {
                data: sessionData,
                timestamp: Date.now(),
                filters: filtersKey,
            };

            setSessions(sessionData);
            setError(null);
        } catch (err) {
            setError(err.message);
            // Only show toast on first error, not on cached/repeated errors
            if (!sessionsCache.data) {
                toast.error('Failed to load sessions');
            }
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, [JSON.stringify(filters)]);

    useEffect(() => {
        fetchSessions();

        // Optional polling (disabled by default)
        if (enablePolling && pollInterval > 0) {
            pollIntervalRef.current = setInterval(() => {
                fetchSessions(true);
            }, pollInterval);
        }

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [fetchSessions, enablePolling, pollInterval]);

    // Force refetch function (bypasses cache)
    const refetch = useCallback(() => fetchSessions(true), [fetchSessions]);

    return { sessions, loading, error, refetch };
};

export const useSession = (id) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSession = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await liveSessionService.getSession(id);
            setSession(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to load session');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSession();
    }, [id]);

    return { session, loading, error, refetch: fetchSession };
};

export const useInstructorDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const data = await liveSessionService.getInstructorDashboard();
            setDashboard(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    return { dashboard, loading, error, refetch: fetchDashboard };
};

export const useSessionAnalytics = (sessionId) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = async () => {
        if (!sessionId) return;

        try {
            setLoading(true);
            const data = await liveSessionService.getAnalytics(sessionId);
            setAnalytics(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [sessionId]);

    return { analytics, loading, error, refetch: fetchAnalytics };
};
