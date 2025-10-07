import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/auth-schemas";
import { toast } from "sonner";

export const useRegister = () => {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("register values:", values);
      form.reset();

      toast.success("register Successful", {
        description: `Welcome, ${values.email}`,
        duration: 3000,
      });
    } catch (error) {
      toast.error("register Failed", {
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
