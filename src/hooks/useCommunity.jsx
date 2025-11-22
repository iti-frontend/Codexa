// hooks/useCommunity.js
"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export function useCommunity() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userToken } = useAuthStore();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/community");
      setPosts(res.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch posts";
      setError(errorMessage);
      console.error("Error fetching community posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      console.log("Sending post data:", postData); // Debug log

      const res = await api.post("/community", postData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      console.log("Post created successfully:", res.data); // Debug log
      return res.data;
    } catch (error) {
      console.error("Create post error:", error.response?.data); // More detailed error
      throw new Error(error.response?.data?.message || "Failed to create post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const refetch = () => {
    fetchPosts();
  };

  return {
    posts,
    loading,
    error,
    refetch,
    createPost,
  };
}
