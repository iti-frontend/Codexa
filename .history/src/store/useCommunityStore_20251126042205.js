// store/useCommunityStore.js
import { create } from "zustand";
import api from "@/lib/axios";

export const useCommunityStore = create((set, get) => ({
    // State
    posts: [],
    loading: false,
    error: null,

    // Fetch all posts


    // Create a new post
    createPost: async (postData, userToken) => {
        try {
            const res = await api.post("/community", postData, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            const newPost = res.data.data || res.data;
            console.log("✅ Created post:", newPost);

            // Add the new post to the beginning
            set((state) => ({
                posts: [newPost, ...state.posts],
            }));

            return newPost;
        } catch (error) {
            console.error("❌ Create post error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to create post");
        }
    },

    // Toggle like on a post
    toggleLike: async (postId, userToken) => {
        try {
            console.log("🔄 Toggling like for post:", postId);
            
            const res = await api.post(`/community/${postId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            console.log("✅ Like response:", res.data);
            
            // Extract likes from response
            const responseData = res.data.data || res.data;
            const newLikes = responseData.likes || [];
            
            console.log("📊 New likes array:", newLikes);

            // Update the post with new likes
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

            const responseData = res.data.data || res.data;
            const newComments = responseData.comments || [];

            console.log("✅ Added comment, new comments:", newComments);

            // Update the post's comments
            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId
                        ? { ...post, comments: newComments }
                        : post
                ),
            }));

            return { comments: newComments };
        } catch (error) {
            console.error("❌ Add comment error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to add comment");
        }
    },

    // Edit a comment - KEEP ORIGINAL AUTHOR
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

            const responseData = res.data.data || res.data;
            const updatedComments = responseData.comments || [];

            console.log("✅ Edited comment, updated comments:", updatedComments);

            // Update comments without changing author data
            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId
                        ? { ...post, comments: updatedComments }
                        : post
                ),
            }));

            return { comments: updatedComments };
        } catch (error) {
            console.error("❌ Edit comment error:", error.response?.data);
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

            const responseData = res.data.data || res.data;
            const updatedComments = responseData.comments || [];

            // Update the post's comments
            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId
                        ? { ...post, comments: updatedComments }
                        : post
                ),
            }));

            return { comments: updatedComments };
        } catch (error) {
            console.error("❌ Delete comment error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to delete comment");
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

            // Remove the post from state
            set((state) => ({
                posts: state.posts.filter((post) => post._id !== postId),
            }));
        } catch (error) {
            console.error("❌ Delete post error:", error.response?.data);
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

            console.log("✅ Edited post:", updatedPost);

            // Update the post in state
            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId ? updatedPost : post
                ),
            }));

            return updatedPost;
        } catch (error) {
            console.error("❌ Edit post error:", error.response?.data);
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
            console.error("❌ Report post error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to report post");
        }
    },
}));