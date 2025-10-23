import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema } from "@/schemas/auth-schemas";
import { useRoleStore } from "@/store/useRoleStore";
import { useRouter } from "next/navigation";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import api from "@/lib/axios";

export const useLogin = () => {
  // Hooks
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    mode: "onBlur",
  });
  const { role } = useRoleStore();
  const router = useRouter();

  const onSubmit = async (values) => {
    try {
      // Detect Role
      const RoleInstructor = role === "instructor";
      const endpoint = RoleInstructor
        ? ENDPOINTS.INSTRUCTOR_AUTH.LOGIN
        : ENDPOINTS.STUDENT_AUTH.LOGIN;

      await api.post(endpoint, values);

      form.reset();

      toast.success("Login Successful", {
        description: `Welcome back, ${values.email}`,
        duration: 3000,
      });

      // Redirect to dashboard
      RoleInstructor
        ? router.push("/InstructorDashboard")
        : router.push("/StudentDashboard");
    } catch (error) {
      toast.error("Login Failed", {
        description: "Please check your credentials and try again",
      });
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
