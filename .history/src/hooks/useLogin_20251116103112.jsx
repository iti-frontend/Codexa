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
  const { handleAuth, setErr } = useAuthStore();
  const router = useRouter();

  // ---- Detect User Safely ----
  const detectUser = (data) => {
    return data.instructor || data.student || data.admin || null;
  };

  const onSubmit = async (values) => {
    try {

      const endpoint =
        role === "instructor"
          ? ENDPOINTS.INSTRUCTOR_AUTH.LOGIN
          : ENDPOINTS.STUDENT_AUTH.LOGIN;

      const res = await api.post(endpoint, values);

      if (res.status === 200) {

        handleAuth(res.data);

        const user = detectUser(res.data);

        form.reset();

        toast.success("Login Successful", {
          description: user
            ? `Welcome back, ${user.name}`
            : "Welcome back!",
          duration: 3000,
        });

        // Redirect
        router.push(role === "instructor" ? "/instructor" : "/student");

      } else {
        toast.error("Missing Credentials", {
          description: "Please check your credentials and try again.",
        });
      }

    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error("Login Failed", {
        description: setErr(error?.response?.data?.message),
      });
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
