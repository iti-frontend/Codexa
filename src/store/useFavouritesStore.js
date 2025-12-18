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

      // Clean up any null/undefined favourites from the server
      const validFavourites = (res.data.items || []).filter(
        (fav) => fav && fav.course && fav.course._id
      );

      set({
        favourites: validFavourites,
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
            title: "Loading...",
            price: 0,
            level: "beginner",
            status: "public",
          },
          createdAt: new Date().toISOString(),
          isOptimistic: true,
        };

        set({
          favourites: [...favourites, optimisticFavourite],
        });

        // REFRESH ACTUAL DATA
        setTimeout(async () => {
          try {
            const refreshRes = await api.get("/favourites", {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            });

            // Clean up the refreshed data
            const validFavourites = (refreshRes.data.items || []).filter(
              (fav) => fav && fav.course && fav.course._id
            );

            set({
              favourites: validFavourites,
            });
          } catch (error) {
            console.error("Error refreshing favourites:", error);
          }
        }, 100);

        return { success: true, status: "added" };
      } else if (result.status === "removed") {
        // INSTANT REMOVAL: Remove from favourites immediately
        set({
          favourites: favourites.filter(
            (fav) => fav && fav.course && fav.course._id !== courseId
          ),
        });
        return { success: true, status: "removed" };
      }
    } catch (error) {
      console.error("Error in toggle favourite:", error);

      // REVERT OPTIMISTIC UPDATE on error
      if (error.response?.status !== 401) {
        set({
          favourites: favourites.filter(
            (fav) =>
              fav &&
              (!fav.isOptimistic || (fav.course && fav.course._id !== courseId))
          ),
        });
      }

      return { success: false, error };
    }
  },

  // Check if course is in favourites - FIXED VERSION
  isCourseFavourite: (courseId) => {
    const { favourites } = get();

    // Add null checks at every level
    return favourites.some((fav) => {
      // Check if favourite exists
      if (!fav) return false;

      // Check if course exists
      if (!fav.course) return false;

      // Check if course._id exists and matches
      return fav.course._id === courseId;
    });
  },

  // Alternative: More concise version
  isCourseFavouriteAlt: (courseId) => {
    const { favourites } = get();

    // Optional chaining with nullish coalescing
    return favourites.some((fav) => fav?.course?._id === courseId);
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

      // Clean up the data
      const validFavourites = (res.data.items || []).filter(
        (fav) => fav && fav.course && fav.course._id
      );

      set({
        favourites: validFavourites,
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

  // Get valid favourites (filtered)
  getValidFavourites: () => {
    const { favourites } = get();
    return favourites.filter((fav) => fav && fav.course && fav.course._id);
  },

  // Clear favourites (for logout)
  clearFavourites: () => {
    set({
      favourites: [],
      initialized: false,
    });
  },
}));
