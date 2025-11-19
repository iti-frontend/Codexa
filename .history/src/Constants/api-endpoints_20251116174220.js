// Constants/API.js
// API End points
export const ENDPOINTS = {
  INSTRUCTOR_AUTH: {
    LOGIN: "/instructors/login",
    REGISTER: "/instructors/register",
    REGISTER_SOCIAL: "/instructors/social-login",
  },
  STUDENT_AUTH: {
    LOGIN: "/students/login",
    REGISTER: "/students/register",
    REGISTER_SOCIAL: "/students/social-login",
  },
  // Profile
  INSTRUCTOR_EDIT_PROFILE: "/instructors/profile",
  STUDENT_EDIT: "/students/profile",
  // Todos
 TODOS: {
    BASE: "/todos",
    BY_ID: (id) => `/todos/${id}`,
    MARK_DONE: (id) => `/todos/${id}/done`,
    STATS: "/todos/stats/summary",
  },
};