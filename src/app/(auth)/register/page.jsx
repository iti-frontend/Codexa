"use client";

import { FormInput } from "@/components/auth/FormInput";
import RoleSelect from "@/components/auth/RoleSelect";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Form } from "@/components/ui/form";
import { useRegister } from "@/hooks/userRegister";
import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const { form, onSubmit, isSubmitting } = useRegister();
  const router = useRouter();
  const handleRegister = () => {
    router.push("/InstructorDashboard");
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
        {/* Heading */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-primary">Create an account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your details to register
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* first name */}
            <FormInput
              control={form.control}
              name="firstName"
              label="First Name"
              placeholder="Jhon"
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

          {/* Role */}
          <RoleSelect />

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
          className="w-full cursor-pointer bg-primary text-white py-2 rounded-lg shadow-md"
          disabled={isSubmitting}
          onClick={handleRegister}
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </Button>

        <Divider>Or continue with</Divider>

        <SocialButtons />

        <div className="text-center text-sm">
          already have account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline transition-colors"
          >
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
export default RegisterPage;
