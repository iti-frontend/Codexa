// hooks/useCommunity.js
"use client";
import { useEffect } from "react";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";

export function useCommunity() {
  const { posts, loading, error, fetchPosts, createPost, likePost, unlikePost } = useCommunityStore();
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

  // دالة جديدة للتعامل مع الإعجاب
  const handleLikePost = async (postId) => {
    if (!userToken) {
      alert("Please login to like posts");
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      const isLiked = post?.likes?.some(like => like.userId === user?.uid);
      
      if (isLiked) {
        await unlikePost(postId, userToken);
      } else {
        await likePost(postId, userToken);
      }
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