"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SOCIAL_PROVIDERS } from "@/Constants/social-providers";
import { auth, googleProvider, githubProvider } from "@/config/firebase";
import { signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const SocialButtons = () => {
  const router = useRouter();

  const handleSocialLogin = async (providerName) => {
    try {
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

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      toast.success(`Welcome ${user.displayName || "User"}!`);
      console.log("Signed in user:", user);

      router.push("/InstructorDashboard");
    } catch (error) {
      console.error("Social login error:", error);
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {SOCIAL_PROVIDERS.map((provider) => {
        const Icon = provider.icon;
        return (
          <Button
            key={provider.name}
            variant="outline"
            type="button"
            className="flex-1 cursor-pointer gap-2"
            onClick={() => handleSocialLogin(provider.name)}
          >
            <Icon className="h-4 w-4" />
            <span>{provider.name}</span>
          </Button>
        );
      })}
    </div>
  );
};
