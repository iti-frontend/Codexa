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
  const { role } = useRoleStore();
  const { handleAuth, userInfo, setErr } = useAuthStore();
  const router = useRouter();
  const onSubmit = async (values) => {
    try {
      // Detect Role
      const RoleInstructor = role === "instructor";
      const endpoint = RoleInstructor
        ? ENDPOINTS.INSTRUCTOR_AUTH.LOGIN
        : ENDPOINTS.STUDENT_AUTH.LOGIN;

      const res = await api.post(endpoint, values);
      if (res.status === 200) {
        handleAuth(res.data);
        console.log(userInfo);
        console.log(res.data);
        form.reset();
        toast.success("Login Successful", {
          description: `Welcome back, ${res.data.student.name}`,
          duration: 3000,
        });
        console.log(userInfo);
        // Redirect to dashboard
        RoleInstructor
          ? router.push("/InstructorDashboard")
          : router.push("/StudentDashboard");
      } else {
        toast.error("Missing Credentials", {
          description: 'Please check your credentials and try again.',
        });
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast.error("Login Failed", {
        description: setErr(error.response.data.message),
      });
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
