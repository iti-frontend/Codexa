import { create } from "zustand";

export const useCoursesStore = create((set) => ({
  courses: [],

  setCourses: (courses) => set({ courses }),

  addCourse: (course) =>
    set((state) => ({ courses: [...state.courses, course] })),

  removeCourse: (courseId) =>
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== courseId),
    })),

  updateCourseInStore: (updatedCourse) =>
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === updatedCourse.id ? { ...c, ...updatedCourse } : c
      ),
    })),
}));
