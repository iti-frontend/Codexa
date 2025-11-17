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

  // Analytics
  INSTRUCTOR_ANALYTICS: "/analytics/instructor",
  STUDENT_ANALYTICS: "/analytics/student",
};
