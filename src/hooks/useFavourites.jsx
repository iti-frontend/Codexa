import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

export const useFavourites = () => {
  const { userToken } = useAuthStore();

  const toggleFavourite = async (courseId) => {
    try {
      const res = await api.post(
        "/favourites/toggle",
        {
          courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error toggling favourite:", error);
      throw error;
    }
  };

  const getFavourites = async (page = 1, limit = 10) => {
    try {
      const res = await api.get(`/favourites?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      console.log(res);

      return res.data;
    } catch (error) {
      console.error("Error getting favourites:", error);
      throw error;
    }
  };

  return {
    toggleFavourite,
    getFavourites,
  };
};
