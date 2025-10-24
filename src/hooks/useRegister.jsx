import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerSchema } from "@/schemas/auth-schemas";
import { useRoleStore } from "@/store/useRoleStore";
import { ENDPOINTS } from "@/Constants/api-endpoints";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

export const useRegister = () => {
  // Hooks
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "student",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const { role } = useRoleStore();
  const { handleAuth, setErr, userInfo } = useAuthStore();
  const router = useRouter();

  // On Submit Function
  const onSubmit = async (values) => {
    try {
      // Detect Role
      const RoleInstructor = role === "instructor";
      const endpoint = RoleInstructor
        ? ENDPOINTS.INSTRUCTOR_AUTH.REGISTER
        : ENDPOINTS.STUDENT_AUTH.REGISTER;

      // Payload Data
      const payload = {
        name: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        password: values.password,
      };

      const res = await api.post(endpoint, payload);
      if (res.status === 200) {
        handleAuth(res.data);
        console.log(userInfo);
        toast.success("Registration Successful", {
          description: `Welcome, ${values.email}`,
          duration: 3000,
        });
      }
      console.log(res.data);

      form.reset();

      toast.success("Registration Successful", {
        description: `Welcome, ${values.email}`,
        duration: 3000,
      });

      // Redirect to dashboard
      RoleInstructor
        ? router.push("/InstructorDashboard")
        : router.push("/StudentDashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Please check your credentials and try again";

      toast.error("Registration Failed", {
        description: errorMessage,
      });
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
