import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
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

  // Get Instructor Courses
  async function fetchInstructorCourses() {
    try {
      const res = await api.get("/courses", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch instructor courses:", error);
      throw error;
    }
  }

  // add Course
  async function createCourse(courseData) {
    try {
      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("price", String(courseData.price));
      formData.append("category", courseData.category);
      if (courseData.video?.[0]) {
        formData.append("video", courseData.video[0]);
      }

      const res = await api.post("/instructors/courses", formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Show Message
      toast.success("Course added successfully!");
      return res.data;
    } catch (error) {
      console.error("Failed to add course:", error);
      throw error;
    }
  }

  return {
    fetchInstructorCourses,
    createCourse,
    register,
    handleSubmit,
    reset,
    errors,
    isSubmitting,
  };
}
