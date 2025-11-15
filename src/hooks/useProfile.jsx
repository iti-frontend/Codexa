"use client";
import Cookies from "js-cookie";
import { useState, useEffect, useCallback } from "react";

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(() => {
    setLoading(true);
    try {
      const cookie = Cookies.get("userInfo");

      if (!cookie) {
        setProfile(null);
        return;
      }

      const parsed = JSON.parse(cookie);
      setProfile(parsed);

    } catch (error) {
      console.error("Error parsing userInfo cookie:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load once on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Reload when the tab becomes active
  useEffect(() => {
    const onFocus = () => loadProfile();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadProfile]);

  return {
    profile,
    loading,
    reload: loadProfile,
    isLoggedIn: !!profile,
    role: profile?.role?.toLowerCase() || "",
  };
}
