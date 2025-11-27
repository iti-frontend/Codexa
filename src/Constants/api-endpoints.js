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
  ADMIN_AUTH: {
    LOGIN: "/admin/login",
  },
  // Profile
  INSTRUCTOR_EDIT_PROFILE: "/instructors/profile",
  STUDENT_EDIT: "/students/profile",

  // Analytics
  INSTRUCTOR_ANALYTICS: "/analytics/instructor",
  STUDENT_ANALYTICS: "/analytics/student",

  // Courses
  CREATE_COURSE: "/courses",
  ENROLL_COURSE: "/enroll/{courseId}",

  // get Student Courses
  GET_STUDENT_COURSES: "students/my-courses",
  GET_STUDENT_COURSES_BY_ID: "students/my-courses/{courseId}",
  // Todos
  TODOS: {
    BASE: "/todos",
    BY_ID: (id) => `/todos/${id}`,
    MARK_DONE: (id) => `/todos/${id}/done`,
    STATS: "/todos/stats/summary",
  },
  // admin Endpoints
  ADMIN_ANALYTICS: "/admin/stats",
  ADMIN_STUDENTS: "/admin/students",
  ADMIN_STUDENT_BY_ID: "/admin/students/{studentId}",
  ADMIN_COURSES: "/admin/courses",
  ADMIN_COURSE_BY_ID: "/admin/courses/{courseId}",
  ADMIN_INSTRUCTORS: "/admin/instructors",
  ADMIN_INSTRUCTOR_BY_ID: "/admin/instructors/{instructorId}",
};
// api's we  need  get from backend
// update student and admin profile (1)
// get Total Revenue and  Monthly Revenue (2)