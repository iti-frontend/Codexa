"use client";
import { cn } from "@/lib/utils";
import { motion as Motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

function AuthLayout({ children }) {
  const pathName = usePathname();
  const isRegister = pathName === "/register";
  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 overflow-hidden">
      {/* Form Section - Always visible */}
      <Motion.div
        key={isRegister ? "register-form" : "login-form"}
        initial={{ opacity: 0, x: isRegister ? 400 : -400 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className={cn(
          "flex-1 flex flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:p-10 w-full",
          isRegister ? "lg:order-2" : "lg:order-1"
        )}
      >
        <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto sm:max-w-md">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-6 sm:mb-7 md:mb-8">
            {/* <Image src="/logo.png" alt="logo" fill /> */}
          </div>
          <div className="w-full">{children}</div>
        </div>
      </Motion.div>

      {/* Image Section - Hidden on mobile, visible on desktop */}
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
        <Image
          src={isRegister ? "/auth/register.png" : "/auth/login.png"}
          alt="Auth Image"
          fill
          priority
          className="absolute inset-0 h-full w-full object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </Motion.div>
    </div>
  );
}
export default AuthLayout;
