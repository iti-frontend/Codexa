// Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// API End points
export const ENDPOINTS = {
  INSTRUCTOR_AUTH: {
    LOGIN: "/instructors/login",
    REGISTER: "/instructors/register",
  },
  STUDENT_AUTH: {
    LOGIN: "/students/login",
    REGISTER: "/students/register",
  },
};
