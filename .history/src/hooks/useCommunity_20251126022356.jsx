// hooks/useCommunity.js
"use client";
import { useEffect } from "react";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";

export function useCommunity() {
  const { posts, loading, error, fetchPosts, createPost } = useCommunityStore();
  const { userToken } = useAuthStore();

  useEffect(() => {
    fetchPosts();
    console.log("Posts:", posts);

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

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    createPost: handleCreatePost,
  };
}

