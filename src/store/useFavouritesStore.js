// store/useFavouritesStore.js
import { create } from "zustand";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

export const useFavouritesStore = create((set, get) => ({
  favourites: [],
  loading: false,
  initialized: false,

  // Initialize favourites on app start
  initializeFavourites: async () => {
    try {
      set({ loading: true });

      const { userToken } = useAuthStore.getState();

      const res = await api.get("/favourites", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log(res);

      set({
        favourites: res.data.items || [],
        initialized: true,
        loading: false,
      });
    } catch (error) {
      console.error("Error initializing favourites:", error);
      set({
        favourites: [],
        initialized: true,
        loading: false,
      });
    }
  },

  // Toggle favourite and update store
  toggleFavourite: async (courseId) => {
    const { favourites, initializeFavourites } = get();

    try {
      const { userToken } = useAuthStore.getState();

      const res = await api.post(
        "/favourites/toggle",
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = res.data;

      if (result.status === "added") {
        // OPTIMISTIC UPDATE: Immediately add to UI with minimal data
        const optimisticFavourite = {
          _id: result.favourite?._id || `temp-${Date.now()}`,
          course: {
            _id: courseId,
            // We'll add basic fields that we might need immediately
            title: "Loading...",
            price: 0,
            level: "beginner",
            status: "public",
          },
          createdAt: new Date().toISOString(),
          isOptimistic: true, // Flag to identify optimistic updates
        };

        set({
          favourites: [...favourites, optimisticFavourite],
        });

        // REFRESH ACTUAL DATA: Fetch the latest favourites to get full course data
        setTimeout(async () => {
          try {
            const refreshRes = await api.get("/favourites", {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            });

            set({
              favourites: refreshRes.data.items || [],
            });
          } catch (error) {
            console.error("Error refreshing favourites:", error);
            // Keep the optimistic update if refresh fails
          }
        }, 100);

        return { success: true, status: "added" };
      } else if (result.status === "removed") {
        // INSTANT REMOVAL: Remove from favourites immediately
        set({
          favourites: favourites.filter((fav) => fav.course._id !== courseId),
        });
        return { success: true, status: "removed" };
      }
    } catch (error) {
      console.error("Error in toggle favourite:", error);

      // REVERT OPTIMISTIC UPDATE on error
      if (error.response?.status !== 401) {
        // Don't revert if it's auth error
        set({
          favourites: favourites.filter(
            (fav) => !fav.isOptimistic || fav.course._id !== courseId
          ),
        });
      }

      return { success: false, error };
    }
  },

  // Check if course is in favourites
  isCourseFavourite: (courseId) => {
    const { favourites } = get();
    return favourites.some((fav) => fav.course._id === courseId);
  },

  // Force refresh favourites from server
  refreshFavourites: async () => {
    try {
      set({ loading: true });
      const { userToken } = useAuthStore.getState();

      const res = await api.get("/favourites", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      set({
        favourites: res.data.items || [],
        loading: false,
      });
    } catch (error) {
      console.error("Error refreshing favourites:", error);
      set({ loading: false });
    }
  },

  // Get all favourites
  getFavourites: () => {
    return get().favourites;
  },

  // Clear favourites (for logout)
  clearFavourites: () => {
    set({
      favourites: [],
      initialized: false,
    });
  },
}));
