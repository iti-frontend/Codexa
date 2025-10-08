import React from "react";
import { Button } from "@/components/ui/button";
import { SOCIAL_PROVIDERS } from "@/Constants/social-providers";

export const SocialButtons = () => {
  const handleSocialLogin = (provider) => {
    console.log(`Social login with: ${provider}`);
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
