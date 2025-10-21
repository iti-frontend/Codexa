"use client";

import { FormInput } from "@/components/auth/FormInput";
import RoleSelect from "@/components/auth/RoleSelect";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Form } from "@/components/ui/form";
import { useRegister } from "@/hooks/useRegister";
import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";

function RegisterPage() {
  const { form, onSubmit, isSubmitting } = useRegister();

  return (
    <>
      <RoleSelect>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-full"
          >
            <div className="space-y-4 w-full">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* first name */}
                <FormInput
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  icon={User}
                  error={form.formState.errors.firstName}
                />

                {/* last name */}
                <FormInput
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  icon={User}
                  error={form.formState.errors.lastName}
                />
              </div>

              {/* Email */}
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
                icon={Mail}
                error={form.formState.errors.email}
              />

              {/* Password */}
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

            <Button
              type="submit"
              className="w-full cursor-pointer bg-primary text-white py-2 rounded-lg shadow-md hover:bg-primary/90 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>

            <Divider>Or continue with</Divider>

            <SocialButtons />
          </form>
        </Form>
      </RoleSelect>
      <div className="text-center text-sm mt-3">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline transition-colors"
        >
          Login
        </Link>
      </div>
    </>
  );
}
export default RegisterPage;
