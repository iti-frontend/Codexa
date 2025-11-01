"use client";

import { useEffect } from "react";
import { FormInput } from "@/components/auth/FormInput";
import { RememberForgot } from "@/components/auth/RememberForgot";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Form } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLogin } from "@/hooks/useLogin";
import { useRoleStore } from "@/store/useRoleStore";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { form, onSubmit, isSubmitting } = useLogin();
  const { role, setRole } = useRoleStore();

  // Ensure default role
  useEffect(() => {
    if (!role) setRole("student");
  }, [role, setRole]);

  const renderForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
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

        {/* Remember me & forgot password */}
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
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline transition-colors"
          >
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      <Tabs
        defaultValue={role || "student"}
        onValueChange={(value) => setRole(value)}
        className="w-full"
      >
        {/* Heading */}
        <div className="text-center space-y-2 mb-3">
          <h2 className="text-2xl font-bold text-primary">Welcome Back</h2>
          <p className="text-gray-600 text-sm">
            Sign in to your {role} account to continue
          </p>
        </div>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="instructor">Instructor</TabsTrigger>
        </TabsList>

        <TabsContent value="student">{renderForm()}</TabsContent>
        <TabsContent value="instructor">{renderForm()}</TabsContent>
      </Tabs>
    </div>
  );
}
