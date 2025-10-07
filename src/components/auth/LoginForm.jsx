import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { FormInput } from "./FormInput";
import { SocialButtons } from "./SocialButtons";
import { useLogin } from "@/hooks/useLogin";
import { RememberForgot } from "./RememberForgot";

export const LoginForm = () => {
  const { form, onSubmit, isSubmitting } = useLogin();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
        {/* Heading */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-primary">Welcome Back!</h2>
          <p className="text-gray-600 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        <div className="space-y-4">
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            icon={Mail}
            error={form.formState.errors.email}
          />

          <FormInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            icon={Lock}
            error={form.formState.errors.password}
          />
        </div>

        {/* Remember me and forgot password*/}
        <RememberForgot control={form.control} />

        <Button
          type="submit"
          className="w-full cursor-pointer bg-primary text-white py-2 rounded-lg shadow-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>

        <Divider>Or continue with</Divider>

        <SocialButtons />

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline transition-colors"
          >
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};
