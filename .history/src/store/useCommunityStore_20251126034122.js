
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