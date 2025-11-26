// store/useCommunityStore.js
import { create } from "zustand";
import api from "@/lib/axios";

export const useCommunityStore = create((set, get) => ({
    posts: [],
    loading: false,
    error: null,

    fetchPosts: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/community");
            
            let postsData = res.data.data || res.data;
            if (!Array.isArray(postsData)) {
                postsData = [];
            }
            
            set({ posts: postsData, loading: false });
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to fetch posts";
            set({ error: errorMessage, loading: false });
            console.error("❌ Error fetching posts:", err);
        }
    },

    createPost: async (postData, userToken) => {
        try {
            const res = await api.post("/community", postData, {
                headers: { Authorization: `Bearer ${userToken}` },
            });

            const newPost = res.data.data || res.data;

            set((state) => ({
                posts: [newPost, ...state.posts],
            }));

            return newPost;
        } catch (error) {
            console.error("❌ Create post error:", error);
            throw new Error(error.response?.data?.message || "Failed to create post");
        }
    },

    toggleLike: async (postId, userToken) => {
        try {
            const res = await api.post(`/community/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${userToken}` },
            });

            const responseData = res.data.data || res.data;
            const newLikes = Array.isArray(responseData.likes) ? responseData.likes : [];

            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId ? { ...post, likes: newLikes } : post
                ),
            }));

            return { likes: newLikes };
        } catch (error) {
            console.error("❌ Like error:", error);
            throw new Error(error.response?.data?.message || "Failed to toggle like");
        }
    },

    addComment: async (postId, text, userToken) => {
        try {
            const res = await api.post(
                `/community/${postId}/comment`,
                { text },
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            const responseData = res.data.data || res.data;
            const newComments = Array.isArray(responseData.comments) ? responseData.comments : [];

            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId ? { ...post, comments: newComments } : post
                ),
            }));

            return { comments: newComments };
        } catch (error) {
            console.error("❌ Comment error:", error);
            throw new Error(error.response?.data?.message || "Failed to add comment");
        }
    },

    editComment: async (postId, commentId, text, userToken) => {
        try {
            const res = await api.put(
                `/community/${postId}/comment/${commentId}`,
                { text },
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            const responseData = res.data.data || res.data;
            const updatedComments = Array.isArray(responseData.comments) ? responseData.comments : [];

            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId ? { ...post, comments: updatedComments } : post
                ),
            }));

            return { comments: updatedComments };
        } catch (error) {
            console.error("❌ Edit comment error:", error);
            throw new Error(error.response?.data?.message || "Failed to edit comment");
        }
    },

    deleteComment: async (postId, commentId, userToken) => {
        try {
            const res = await api.delete(
                `/community/${postId}/comment/${commentId}`,
                { headers: { Authorization: `Bearer ${userToken}` } }
            );

            const responseData = res.data.data || res.data;
            const updatedComments = Array.isArray(responseData.comments) ? responseData.comments : [];

            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId ? { ...post, comments: updatedComments } : post
                ),
            }));

            return { comments: updatedComments };
        } catch (error) {
            console.error("❌ Delete comment error:", error);
            throw new Error(error.response?.data?.message || "Failed to delete comment");
        }
    },

    deletePost: async (postId, userToken) => {
        try {
            await api.delete(`/community/${postId}`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });

            set((state) => ({
                posts: state.posts.filter((post) => post._id !== postId),
            }));
        } catch (error) {
            console.error("❌ Delete post error:", error);
            throw new Error(error.response?.data?.message || "Failed to delete post");
        }
    },

    editPost: async (postId, postData, userToken) => {
        try {
            const res = await api.put(`/community/${postId}`, postData, {
                headers: { Authorization: `Bearer ${userToken}` },
            });

            const updatedPost = res.data.data || res.data;

            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId ? updatedPost : post
                ),
            }));

            return updatedPost;
        } catch (error) {
            console.error("❌ Edit post error:", error);
            throw new Error(error.response?.data?.message || "Failed to edit post");
        }
    },
}));