"use client";

// hooks/useCommunity.js
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

      // If your axios instance already has baseURL configured, just use the endpoint
      const res = await api.get("/community"); // Remove /api if baseURL already includes it

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
  };
}
