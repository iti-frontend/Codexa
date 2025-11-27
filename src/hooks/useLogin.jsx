import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema } from "@/schemas/auth-schemas";
import { useRoleStore } from "@/store/useRoleStore";
import { useRouter } from "next/navigation";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

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

  const { role } = useRoleStore(); // student | instructor | admin
  const { handleAuth, setErr } = useAuthStore();
  const router = useRouter();

  const onSubmit = async (values) => {
    try {
      // Detect Role
      const isInstructor = role === "instructor";
      const isAdmin = role === "admin";

      // Endpoint based on role
      const endpoint = isAdmin
        ? ENDPOINTS.ADMIN_AUTH.LOGIN
        : isInstructor
          ? ENDPOINTS.INSTRUCTOR_AUTH.LOGIN
          : ENDPOINTS.STUDENT_AUTH.LOGIN;

      const res = await api.post(endpoint, values);

      if (res.status === 200) {
        handleAuth(res.data);

        // Detect returned user object
        const user =
          res.data.admin ||
          res.data.instructor ||
          res.data.student ||
          null;

        form.reset();

        toast.success("Login Successful", {
          description: `Welcome back, ${user?.name || "User"}`,
          duration: 3000,
        });

        // Redirect based on role
        if (isAdmin) {
          router.push("/admin");
        } else if (isInstructor) {
          router.push("/instructor");
        } else {
          router.push("/student");
        }
      } else {
        toast.error("Missing Credentials", {
          description: "Please check your credentials and try again.",
        });
      }
    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error("Login Failed", {
        description: setErr(error.response?.data?.message),
      });
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
