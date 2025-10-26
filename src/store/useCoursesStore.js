import { create } from "zustand";

export const useCoursesStore = create((set) => ({
  courses: [],

  setCourses: (courses) => set({ courses }),

  addCourse: (course) =>
    set((state) => ({
      courses: [...state.courses, course],
    })),

  clearCourses: () => set({ courses: [] }),
}));
