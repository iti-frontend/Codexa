import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Divider } from "@/components/ui/divider";
import { Toaster, toast } from "sonner";
import login from "@/assets/login.png";
import { motion } from "framer-motion";
import { FaFacebook, FaGithub,FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";


// Validation Schema
const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // HandleSubmit
  const onSubmit = (values) => {
    console.log(values);
    form.reset();
    toast.success("Login Success ", {
      description: `Welcome back, ${values.email}`,
      duration: 3000,
      action: {
        label: "Undo",
      },
    });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <Toaster position="top-center" richColors />

      {/* Full Page Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full h-screen bg-white shadow-lg overflow-hidden">

        {/* Form__Section */}
        <motion.div
          initial={{ opacity: 0, x: -400 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="flex items-center justify-center h-full w-full bg-white p-6"
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full max-w-sm mx-auto"
            >
              <h2 className="text-primary font-bold text-center text-3xl">
                Welcome Back!
              </h2>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-1 font-bold">Email</FormLabel>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <FormControl>
                        <Input
                          placeholder="example@gmail.com"
                          {...field}
                          className={`pl-8 ${form.formState.errors.email ? "border-red-500 border-1" : ""}`}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-1 font-bold">Password</FormLabel>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                          className={`pl-8 ${form.formState.errors.password ? "border-red-500 border-1" : ""}`}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <a href="/forgot-password" className="text-sm text-primary underline">
                  Forgot password?
                </a>
              </div>

              {/* Login__Button */}
              
              <Button className="w-full cursor-pointer bg-primary text-white py-2 rounded-lg shadow-md" asChild>
                  <Link to="/" > Login </Link>
              </Button>

              

          
              <Divider className="my-3">Or continue with</Divider>

              {/* Social__Icons */}
              <div className="flex items-center justify-center gap-3 mt-3">
                <Button variant="outline" type="button" className="cursor-pointer ">
                  <FaGoogle className="h-5 w-5 " />
                  Google
                </Button>
                <Button variant="outline" type="button" className="cursor-pointer">
                  <FaGithub className="h-5 w-5 " />
                  GitHub
                </Button>
                <Button variant="outline" type="button" className="cursor-pointer">
                  <FaFacebook className="h-5 w-5 " />
                  Facebook
                </Button>
              </div>

              <div className="text-center text-sm mt-4">
                Don’t have an account?{" "}
                <Link to="/register" className="text-primary underline">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </motion.div>

        {/* Login__Image  */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="hidden md:block h-screen w-full"
        >
          <img
            src={login}
            alt="login"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
}
