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

  async function createCourse(courseData) {
    try {
      const formData = new FormData();
      for (const key in courseData) {
        if (key === "coverImage") {
          formData.append("coverImage", courseData.coverImage[0]); // إلزامية
        } else if (key === "videos" && courseData.videos?.length) {
          courseData.videos.forEach((file) => formData.append("videos", file));
        } else if (courseData[key] !== undefined) {
          formData.append(key, courseData[key]);
        }
      }

      const res = await api.post("/courses", formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
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

  async function uploadCourseVideos(courseId, videoFiles) {
    try {
      // Validate that video files are provided
      if (!videoFiles || !videoFiles.length) {
        toast.error("Please select at least one video file");
        throw new Error("No videos provided");
      }

      const formData = new FormData();

      // Append each video file to formData
      videoFiles.forEach((file) => {
        formData.append("videos", file);
      });

      const res = await api.post(`/courses/${courseId}/videos`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 1800000, // 30 minutes timeout for large video uploads
      });

      // Update the course in store with the new videos
      if (res.data.course) {
        updateCourseInStore(res.data.course);
      }

      toast.success("Videos uploaded successfully!");
      return res.data;
    } catch (error) {
      console.error("Failed to upload videos:", error);

      // Handle specific error cases with appropriate messages
      if (error.response?.status === 400) {
        toast.error("No videos provided or invalid file format");
      } else if (error.response?.status === 401) {
        toast.error("Please log in again");
      } else if (error.response?.status === 403) {
        toast.error("You are not authorized to add videos to this course");
      } else if (error.response?.status === 404) {
        toast.error("Course not found");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to upload videos");
      }

      throw error;
    }
  }

  // Alias function for better naming consistency
  async function uploadNewVideoToCourse(courseId, videoFiles) {
    return await uploadCourseVideos(courseId, videoFiles);
  }

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

  async function updateCourse(courseId, updateData, coverImageFile = null) {
    try {
      let res;

      if (coverImageFile) {
        // Use FormData for updates with cover image
        const formData = new FormData();

        // Append text fields
        for (const key in updateData) {
          if (updateData[key] !== undefined && updateData[key] !== null) {
            formData.append(key, updateData[key]);
          }
        }

        // Append cover image file
        formData.append("coverImage", coverImageFile);

        res = await api.put(`/courses/${courseId}`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Use JSON for text-only updates
        res = await api.put(`/courses/${courseId}`, updateData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });
      }

      // Update the course in store
      if (res.data.course) {
        updateCourseInStore(res.data.course);
      }

      toast.success("Course updated successfully!");
      return res.data;
    } catch (error) {
      console.error("Failed to update course:", error);

      // Handle specific error cases with appropriate messages
      if (error.response?.status === 400) {
        if (
          error.response?.data?.message?.includes("level") ||
          error.response?.data?.message?.includes("status")
        ) {
          toast.error(
            "Invalid level or status value. Allowed values: level (beginner, intermediate, advanced), status (public, private)"
          );
        } else {
          toast.error(error.response.data.message || "Invalid data provided");
        }
      } else if (error.response?.status === 401) {
        toast.error("Please log in again");
      } else if (error.response?.status === 403) {
        toast.error("You are not authorized to update this course");
      } else if (error.response?.status === 404) {
        toast.error("Course not found");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update course");
      }

      throw error;
    }
  }

  // Helper function to update course with cover image
  async function updateCourseWithCoverImage(
    courseId,
    updateData,
    coverImageFile
  ) {
    return await updateCourse(courseId, updateData, coverImageFile);
  }

  return {
    fetchInstructorCourses,
    fetchCourseById,
    createCourse,
    uploadCourseVideos,
    uploadNewVideoToCourse,
    deleteCourseVideo,
    deleteCourse,
    updateCourse,
    updateCourseWithCoverImage, // Added for explicit cover image updates
    register,
    handleSubmit,
    reset,
    errors,
    isSubmitting,
    courses,
  };
}
