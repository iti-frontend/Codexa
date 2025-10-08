import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import registerImg from "@/assets/register.png";
import loginImg from "@/assets/login.png";
import { motion as Motion } from "framer-motion";

export default function AuthLayout() {
  const { pathname } = useLocation();
  const isRegister = pathname.includes("register");

  return (
    <div className="grid min-h-screen lg:grid-cols-2 overflow-hidden">
      {/* Form Section */}
      <Motion.div
        key={isRegister ? "register-form" : "login-form"}
        initial={{ opacity: 0, x: isRegister ? 400 : -400 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className={cn(
          "flex flex-col gap-4 p-6 md:p-10",
          isRegister ? "lg:order-2" : "lg:order-1"
        )}
      >
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md flex flex-col items-center">
            <img src="/logo.png" alt="logo" className="w-28 h-28 mb-6" />
            <Outlet />
          </div>
        </div>
      </Motion.div>

      {/* Image Section */}
      <Motion.div
        key={isRegister ? "register-img" : "login-img"}
        initial={{ opacity: 0, x: isRegister ? -400 : 400 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className={cn(
          "bg-muted relative hidden lg:block",
          isRegister ? "lg:order-1" : "lg:order-2"
        )}
      >
        <img
          src={isRegister ? registerImg : loginImg}
          alt="Auth Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </Motion.div>
    </div>
  );
}
