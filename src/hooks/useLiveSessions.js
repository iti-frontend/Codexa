import { useState, useEffect } from 'react';
import liveSessionService from '@/services/liveSessionService';
import { toast } from 'sonner';

export const useLiveSessions = (filters = {}) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const data = await liveSessionService.getAllSessions(filters);
            setSessions(data.sessions || []);
            setError(null);
        } catch (err) {
            setError(err.message);
            // Don't show toast for HTTP/2 ping errors or canceled requests
            if (err.code !== 'ERR_HTTP2_PING_FAILED' && err.name !== 'CanceledError') {
                toast.error('Failed to load sessions');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [JSON.stringify(filters)]);

    return { sessions, loading, error, refetch: fetchSessions };
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
            if (err.code !== 'ERR_HTTP2_PING_FAILED' && err.name !== 'CanceledError') {
                toast.error('Failed to load session');
            }
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
            if (err.code !== 'ERR_HTTP2_PING_FAILED' && err.name !== 'CanceledError') {
                toast.error('Failed to load dashboard');
            }
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
