import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Get auth token from cookies
const getAuthToken = () => {
    return Cookies.get('token');
};

// Create axios instance with auth
const api = axios.create({
    baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Live Sessions API Service
export const liveSessionService = {
    // Get all live sessions
    getAllSessions: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/live-sessions?${params}`);
        return response.data;
    },

    // Get single session
    getSession: async (id) => {
        const response = await api.get(`/live-sessions/${id}`);
        return response.data;
    },

    // Create new session
    createSession: async (data) => {
        const response = await api.post('/live-sessions', data);
        return response.data;
    },

    // Update session
    updateSession: async (id, data) => {
        const response = await api.put(`/live-sessions/${id}`, data);
        return response.data;
    },

    // Delete session
    deleteSession: async (id) => {
        const response = await api.delete(`/live-sessions/${id}`);
        return response.data;
    },

    // Join session (get 100ms token)
    joinSession: async (id) => {
        const response = await api.post(`/live-sessions/${id}/join`);
        return response.data;
    },

    // End session
    endSession: async (id, saveOption = 'none') => {
        const response = await api.put(`/live-sessions/${id}/end`, { saveOption });
        return response.data;
    },

    // Get instructor's sessions
    getInstructorSessions: async () => {
        const response = await api.get('/live-sessions/instructor/my-sessions');
        return response.data;
    },

    // Get instructor dashboard
    getInstructorDashboard: async () => {
        const response = await api.get('/live-sessions/instructor/dashboard');
        return response.data;
    },

    // Create poll
    createPoll: async (sessionId, data) => {
        const response = await api.post(`/live-sessions/${sessionId}/polls`, data);
        return response.data;
    },

    // Vote on poll
    votePoll: async (sessionId, pollId, optionIndex) => {
        const response = await api.post(
            `/live-sessions/${sessionId}/polls/${pollId}/vote`,
            { optionIndex }
        );
        return response.data;
    },

    // Get poll results
    getPollResults: async (sessionId, pollId) => {
        const response = await api.get(`/live-sessions/${sessionId}/polls/${pollId}`);
        return response.data;
    },

    // Close poll
    closePoll: async (sessionId, pollId) => {
        const response = await api.put(`/live-sessions/${sessionId}/polls/${pollId}/close`);
        return response.data;
    },

    // Chat
    addComment: async (sessionId, text) => {
        const response = await api.post(`/live-sessions/${sessionId}/comments`, { text });
        return response.data;
    },

    replyToComment: async (sessionId, commentId, text) => {
        const response = await api.post(`/live-sessions/${sessionId}/comments/${commentId}/reply`, { text });
        return response.data;
    },

    editComment: async (sessionId, commentId, text) => {
        const response = await api.put(`/live-sessions/${sessionId}/comments/${commentId}`, { text });
        return response.data;
    },

    deleteComment: async (sessionId, commentId) => {
        const response = await api.delete(`/live-sessions/${sessionId}/comments/${commentId}`);
        return response.data;
    },

    // Get session analytics
    getAnalytics: async (sessionId) => {
        const response = await api.get(`/live-sessions/${sessionId}/analytics`);
        return response.data;
    },
};

export default liveSessionService;
