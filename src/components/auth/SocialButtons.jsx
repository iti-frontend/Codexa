"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SOCIAL_PROVIDERS } from "@/Constants/social-providers";
import { auth, googleProvider, githubProvider } from "@/config/firebase";
import { signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/store/useRoleStore";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

export const SocialButtons = () => {
  const router = useRouter();
  const { role } = useRoleStore();
  // need to refactor from store * 1
  const { handleAuth, userInfo, setErr } = useAuthStore();
  const [loading, setLoading] = useState({});
  //this function need to be converted into hook like the other login methods for not distraction * 2
  const handleSocialLogin = async (providerName) => {
    try {
      setLoading((prev) => ({ ...prev, [providerName]: true }));

      // Detect Provider
      let provider;
      switch (providerName) {
        case "Google":
          provider = googleProvider;
          break;
        case "GitHub":
          provider = githubProvider;
          break;
        default:
          toast.error(`${providerName} not supported yet.`);
          return;
      }

      // Firebase popup login
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get Firebase ID token
      const idToken = await user.getIdToken(true);

      // Detect Role
      const isInstructor = role === "instructor";
      const endpoint = isInstructor
        ? ENDPOINTS.INSTRUCTOR_AUTH.REGISTER_SOCIAL
        : ENDPOINTS.STUDENT_AUTH.REGISTER_SOCIAL;

      // Send token to backend
      const payload = { token: idToken };
      const { data } = await api.post(endpoint, payload);

      if (!data?.token) {
        throw new Error("No token returned from backend.");
      }

      handleAuth(data);
      console.log(data.student);
      // Success message
      toast.success(`Welcome ${user.displayName || "User"}!`);

      // Redirect to dashboard
      router.push(isInstructor ? "/instructor" : "/student");
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      toast.error("Registration Failed", {
        description: message,
      });
    } finally {
      setLoading((prev) => ({ ...prev, [providerName]: false }));
    }
  };

  return (
    <div className="flex justify-center gap-3 w-full">
      {SOCIAL_PROVIDERS.map((provider) => {
        const Icon = provider.icon;
        const isLoading = loading[provider.name];
        return (
          <Button
            key={provider.name}
            variant="outline"
            type="button"
            onClick={() => handleSocialLogin(provider.name)}
            disabled={isLoading}
            className="flex-1 cursor-pointer gap-2"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <Icon className="h-4 w-4" />
                <span>Sign in with {provider.name}</span>
              </>
            )}
          </Button>
        );
      })}
    </div>
  );
};
