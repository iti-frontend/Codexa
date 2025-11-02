// useInstructorCourse.js

import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoursesStore } from "@/store/useCoursesStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useInstructorCourse() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const { userToken } = useAuthStore();
  const { setCourses, addCourse, updateCourse, courses } = useCoursesStore();

  // ✅ Get Instructor Courses
  async function fetchInstructorCourses() {
    try {
      const res = await api.get("/courses/my-courses", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setCourses(res.data);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch instructor courses:", error);
      toast.error("Failed to fetch courses");
      throw error;
    }
  }

  // ✅ Create Course
  async function createCourse(courseData) {
    try {
      const res = await api.post("/courses", courseData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      addCourse(res.data);
      toast.success("Course created successfully!");
      return res.data;
    } catch (error) {
      console.error("Failed to create course:", error);
      toast.error(error.response?.data?.message || "Failed to create course");
      throw error;
    }
  }

  // ✅ Upload Course Videos
  async function uploadCourseVideos(courseId, videoFiles) {
    try {
      const formData = new FormData();

      // Append all selected video files
      for (const file of videoFiles) {
        formData.append("videos", file);
      }

      const res = await api.post(`/courses/${courseId}/videos`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // optionally update store if API returns updated course
      updateCourse && updateCourse(courseId, res.data);

      toast.success("Videos uploaded successfully!");
      return res.data;
    } catch (error) {
      console.error("Failed to upload videos:", error);
      toast.error(error.response?.data?.message || "Failed to upload videos");
      throw error;
    }
  }

  return {
    fetchInstructorCourses,
    createCourse,
    uploadCourseVideos,
    register,
    handleSubmit,
    reset,
    errors,
    isSubmitting,
    courses,
  };
}
