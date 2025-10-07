import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth-schemas";
import { toast } from "sonner";

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

  const onSubmit = async (values) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Login values:", values);
      form.reset();

      toast.success("Login Successful", {
        description: `Welcome back, ${values.email}`,
        duration: 3000,
      });
    } catch (error) {
      toast.error("Login Failed", {
        description: "Please check your credentials and try again",
      });
      console.log(error);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
