// hooks/useCommunity.js
"use client";
import { useEffect } from "react";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";

export function useCommunity() {
  const { posts, loading, error, fetchPosts, createPost, toggleLike } = useCommunityStore();
  const { userToken, user } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (content) => {
    return await createPost(
      {
        type: "text",
        content: content,
      },
      userToken
    );
  };

  // دالة التعامل مع الإعجاب
  const handleLikePost = async (postId) => {
    if (!userToken) {
      alert("Please login to like posts");
      return;
    }

    try {
      await toggleLike(postId, userToken);
    } catch (error) {
      console.error("Error toggling like:", error);
      alert(error.message);
    }
  };

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    createPost: handleCreatePost,
    likePost: handleLikePost, // أضف هذه الدالة
  };
}