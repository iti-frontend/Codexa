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
  const { setCourses, addCourse, removeCourse, updateCourseInStore, courses } =
    useCoursesStore();

  // 🟢 Fetch all instructor's courses
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

  // 🟢 Fetch single course details
  async function fetchCourseById(courseId) {
    try {
      const res = await api.get(`/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch course details:", error);
      toast.error("Failed to fetch course details");
      throw error;
    }
  }

  // 🟢 Create new course
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

  // 🟢 Upload multiple videos for a course
  async function uploadCourseVideos(courseId, videoFiles) {
    try {
      const formData = new FormData();
      for (const file of videoFiles) formData.append("videos", file);

      const res = await api.post(`/courses/${courseId}/videos`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Videos uploaded successfully!");
      return res.data;
    } catch (error) {
      console.error("Failed to upload videos:", error);
      toast.error(error.response?.data?.message || "Failed to upload videos");
      throw error;
    }
  }

  // 🔴 Delete a specific video from a course
  async function deleteCourseVideo(courseId, videoId) {
    try {
      await api.delete(`/courses/${courseId}/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      toast.success("Video deleted successfully!");
      return true;
    } catch (error) {
      console.error("Failed to delete video:", error);
      toast.error(error.response?.data?.message || "Failed to delete video");
      throw error;
    }
  }

  // 🔴 Delete an entire course
  async function deleteCourse(courseId) {
    try {
      await api.delete(`/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      removeCourse(courseId);
      toast.success("Course deleted successfully!");
      return true;
    } catch (error) {
      console.error("Failed to delete course:", error);
      toast.error(error.response?.data?.message || "Failed to delete course");
      throw error;
    }
  }

  // 🟡 Update course info (title, description, price)
  async function updateCourse(courseId, updateData) {
    try {
      const res = await api.put(`/courses/${courseId}`, updateData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      updateCourseInStore(res.data);
      toast.success("Course updated successfully!");
      return res.data;
    } catch (error) {
      console.error("Failed to update course:", error);
      toast.error(error.response?.data?.message || "Failed to update course");
      throw error;
    }
  }

  async function uploadNewVideoToCourse(courseId, videoFiles) {
    try {
      const formData = new FormData();
      for (const file of videoFiles) formData.append("videos", file);

      const res = await api.post(`/courses/${courseId}/videos`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("New videos uploaded successfully!");
      return res.data;
    } catch (error) {
      console.error("Failed to upload new videos:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload new videos"
      );
      throw error;
    }
  }

  return {
    fetchInstructorCourses,
    fetchCourseById,
    createCourse,
    uploadCourseVideos,
    deleteCourseVideo,
    deleteCourse,
    updateCourse,
    register,
    uploadNewVideoToCourse,
    handleSubmit,
    reset,
    errors,
    isSubmitting,
    courses,
  };
}
