// store/useCommunityStore.js
import { create } from "zustand";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

export const useCommunityStore = create((set, get) => ({
  // State
  posts: [],
  loading: false,
  error: null,

  // Helper: get current user info
  getCurrentUser: () => {
    const authState = useAuthStore.getState();
    return {
      userId: authState.user?.uid,
      name: authState.user?.displayName || authState.user?.email?.split('@')[0] || 'User',
      email: authState.user?.email,
      avatar: authState.user?.photoURL || null
    };
  },

  // Fetch posts
  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/community");
      let postsData = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.data) ? res.data.data : []);
      
      const processedPosts = postsData.map(post => ({
        ...post,
        user: post.user || { name: 'Anonymous', userId: 'unknown', avatar: null },
        likes: post.likes || [],
        comments: (post.comments || []).map(comment => ({
          ...comment,
          user: comment.user || { name: 'Anonymous', userId: 'unknown', avatar: null }
        }))
      }));

      set({ posts: processedPosts, loading: false });
    } catch (err) {
      set({ error: err.message || "Failed to fetch posts", loading: false });
      console.error("Fetch posts error:", err);
    }
  },

  // Add comment
  addComment: async (postId, text, userToken) => {
    try {
      const currentUser = get().getCurrentUser();
      const res = await api.post(`/community/${postId}/comment`, { text }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      const updatedPost = res.data.data || res.data;
      const newComments = updatedPost.comments || [];

      set((state) => ({
        posts: state.posts.map(post =>
          post._id === postId
            ? {
                ...post,
                comments: newComments.map(comment => ({
                  ...comment,
                  user: comment.user || {
                    name: currentUser.name,
                    userId: currentUser.userId,
                    avatar: currentUser.avatar
                  }
                }))
              }
            : post
        )
      }));

      return { comments: newComments };
    } catch (error) {
      console.error("Add comment error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to add comment");
    }
  },

  // Edit comment
  editComment: async (postId, commentId, text, userToken) => {
    try {
      const currentUser = get().getCurrentUser();
      const res = await api.put(`/community/${postId}/comment/${commentId}`, { text }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      const updatedPost = res.data.data || res.data;
      const newComments = updatedPost.comments || [];

      set((state) => ({
        posts: state.posts.map(post =>
          post._id === postId
            ? {
                ...post,
                comments: newComments.map(comment => ({
                  ...comment,
                  user: comment.user || (comment.userId === currentUser.userId
                    ? {
                        name: currentUser.name,
                        userId: currentUser.userId,
                        avatar: currentUser.avatar
                      }
                    : { name: 'Anonymous', userId: comment.userId || 'unknown', avatar: null })
                }))
              }
            : post
        )
      }));

      return { comments: newComments };
    } catch (error) {
      console.error("Edit comment error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to edit comment");
    }
  },

  // Delete comment
  deleteComment: async (postId, commentId, userToken) => {
    try {
      const res = await api.delete(`/community/${postId}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      const updatedPost = res.data.data || res.data;
      const newComments = updatedPost.comments || [];

      set((state) => ({
        posts: state.posts.map(post =>
          post._id === postId
            ? {
                ...post,
                comments: newComments.map(comment => ({
                  ...comment,
                  user: comment.user || { name: 'Anonymous', userId: comment.userId || 'unknown', avatar: null }
                }))
              }
            : post
        )
      }));

      return { comments: newComments };
    } catch (error) {
      console.error("Delete comment error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to delete comment");
    }
  },

  // Toggle like
  toggleLike: async (postId, userToken) => {
    try {
      const res = await api.post(`/community/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      const updatedPost = res.data.data || res.data;
      const newLikes = updatedPost.likes || [];

      set((state) => ({
        posts: state.posts.map(post =>
          post._id === postId ? { ...post, likes: newLikes } : post
        )
      }));

      return { likes: newLikes };
    } catch (error) {
      console.error("Toggle like error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to toggle like");
    }
  }
}));
