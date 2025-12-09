// services/courseService.js
import api from "@/lib/axios";

/**
 * Fetch all public courses
 * @param {Object} params - Query parameters (limit, category, etc.)
 * @returns {Promise} Course data
 */
export const getCourses = async (params = {}) => {
    try {
        const response = await api.get("/courses", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

/**
 * Fetch a single course by ID
 * @param {string} courseId - Course ID
 * @returns {Promise} Course data
 */
export const getCourseById = async (courseId) => {
    try {
        const response = await api.get(`/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching course ${courseId}:`, error);
        throw error;
    }
};

/**
 * Fetch featured courses for home page (first 3 courses)
 * @returns {Promise} Featured courses data
 */
export const getFeaturedCourses = async () => {
    try {
        const res = await api.get("/courses");
        // Get first 3 courses from the response
        return res.data.slice(0, 3);
    } catch (error) {
        console.warn("Error fetching featured courses:", error);
        // Return empty array to use fallback static data
        return [];
    }
};

export default {getCourses,getCourseById,}