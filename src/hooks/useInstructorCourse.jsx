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
  const { setCourses, addCourse, courses } = useCoursesStore();

  // Get Instructor Courses
  async function fetchInstructorCourses() {
    try {
      const res = await api.get("/courses", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      //   save the courses in state
      setCourses(res.data);
      console.log("getting Courses");
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

      //   add the new course
      addCourse(res.data);

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
    courses,
  };
}
