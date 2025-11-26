// store/useCommunityStore.js
import { create } from "zustand";
import api from "@/lib/axios";

export const useCommunityStore = create((set, get) => ({
    // State
    posts: [],
    loading: false,
    error: null,

    // Fetch all posts
    fetchPosts: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/community");
            console.log("✅ Fetched posts:", res.data);
            // Handle response structure - might be res.data.data or res.data
            const postsData = res.data.data || res.data;
            set({ posts: postsData, loading: false });
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || err.message || "Failed to fetch posts";
            set({ error: errorMessage, loading: false });
            console.error("Error fetching community posts:", err);
        }
    },

    // Create a new post
    createPost: async (postData, userToken) => {
        try {
            const res = await api.post("/community", postData, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            const newPost = res.data.data || res.data;
            
            // Add the new post to the beginning of the posts array
            set((state) => ({
                posts: [newPost, ...state.posts],
            }));

            return newPost;
        } catch (error) {
            console.error("Create post error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to create post");
        }
    },

    // Toggle like on a post - FIXED VERSION
    toggleLike: async (postId, userToken) => {
        try {
            console.log("🔄 Toggling like for post:", postId);
            
            const res = await api.post(`/community/${postId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            console.log("✅ Like response:", res.data);
            
            // Extract the updated post or likes array from response
            const updatedPost = res.data.data || res.data;
            const newLikes = updatedPost.likes || res.data.likes || [];
            
            console.log("📊 New likes array:", newLikes);

            // Update the post in the state with new likes
            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId 
                        ? { ...post, likes: newLikes }
                        : post
                ),
            }));

            return { likes: newLikes };
        } catch (error) {
            console.error("❌ Toggle like error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to toggle like");
        }
    },

    // Add a comment to a post
    addComment: async (postId, text, userToken) => {
        try {
            const res = await api.post(
                `/community/${postId}/comment`,
                { text },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            const updatedPost = res.data.data || res.data;
            const newComments = updatedPost.comments || res.data.comments || [];

            // Update the post's comments in the state
            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId
                        ? { ...post, comments: newComments }
                        : post
                ),
            }));

            return { comments: newComments };
        } catch (error) {
            console.error("Add comment error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to add comment");
        }
    },

    // Add a reply to a comment
    addReply: async (postId, commentId, text, userToken) => {
        try {
            const res = await api.post(
                `/community/${postId}/comment/${commentId}/reply`,
                { text },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            const updatedPost = res.data.data || res.data;
            const newComments = updatedPost.comments || res.data.comments || [];

            // Update the post's comments in the state
            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId
                        ? { ...post, comments: newComments }
                        : post
                ),
            }));

            return { comments: newComments };
        } catch (error) {
            console.error("Add reply error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to add reply");
        }
    },

    // Edit a comment
    editComment: async (postId, commentId, text, userToken) => {
        try {
            const res = await api.put(
                `/community/${postId}/comment/${commentId}`,
                { text },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            const updatedPost = res.data.data || res.data;
            const newComments = updatedPost.comments || res.data.comments || [];

            // Update the post's comments in the state
            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId
                        ? { ...post, comments: newComments }
                        : post
                ),
            }));

            return { comments: newComments };
        } catch (error) {
            console.error("Edit comment error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to edit comment");
        }
    },

    // Delete a comment
    deleteComment: async (postId, commentId, userToken) => {
        try {
            const res = await api.delete(
                `/community/${postId}/comment/${commentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            const updatedPost = res.data.data || res.data;
            const newComments = updatedPost.comments || res.data.comments || [];

            // Update the post's comments in the state
            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId
                        ? { ...post, comments: newComments }
                        : post
                ),
            }));

            return { comments: newComments };
        } catch (error) {
            console.error("Delete comment error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to delete comment");
        }
    },

    // Edit a reply
    editReply: async (postId, commentId, replyId, text, userToken) => {
        try {
            const res = await api.put(
                `/community/${postId}/comment/${commentId}/reply/${replyId}`,
                { text },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            const updatedPost = res.data.data || res.data;
            const newComments = updatedPost.comments || res.data.comments || [];

            // Update the post's comments in the state
            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId
                        ? { ...post, comments: newComments }
                        : post
                ),
            }));

            return { comments: newComments };
        } catch (error) {
            console.error("Edit reply error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to edit reply");
        }
    },

    // Delete a reply
    deleteReply: async (postId, commentId, replyId, userToken) => {
        try {
            const res = await api.delete(
                `/community/${postId}/comment/${commentId}/reply/${replyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            const updatedPost = res.data.data || res.data;
            const newComments = updatedPost.comments || res.data.comments || [];

            // Update the post's comments in the state
            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId
                        ? { ...post, comments: newComments }
                        : post
                ),
            }));

            return { comments: newComments };
        } catch (error) {
            console.error("Delete reply error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to delete reply");
        }
    },

    // Delete a post
    deletePost: async (postId, userToken) => {
        try {
            await api.delete(`/community/${postId}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            // Remove the post from the state
            set((state) => ({
                posts: state.posts.filter((post) => post._id !== postId),
            }));
        } catch (error) {
            console.error("Delete post error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to delete post");
        }
    },

    // Edit a post
    editPost: async (postId, postData, userToken) => {
        try {
            const res = await api.put(`/community/${postId}`, postData, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            const updatedPost = res.data.data || res.data;

            // Update the post in the state
            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId ? updatedPost : post
                ),
            }));

            return updatedPost;
        } catch (error) {
            console.error("Edit post error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to edit post");
        }
    },

    // Report a post
    reportPost: async (postId, reason, details, userToken) => {
        try {
            const res = await api.post(
                `/community/${postId}/report`,
                { reason, details },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            return res.data;
        } catch (error) {
            console.error("Report post error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to report post");
        }
    },
}));