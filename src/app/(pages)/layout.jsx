'use client';
import React from "react";
import SidebarComponent from "@/components/shared/SidebarComponent";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { InstructorLinks, StudentsLinks } from "@/Constants/sidebar-links";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import Cookies from "js-cookie";
function PagesLayout({ children }) {
  // not a best practice at all but when i use zustand the value of role is null cause its an async
  const userInfo = Cookies.get("userInfo");
  const role = userInfo ? JSON.parse(userInfo).role : "";
  const isInstructor = role === "Instructor";
  const selectedRole = isInstructor ? "Instructor" : "Student";
  return (
    <SidebarProvider>
      {/* The Main Side bar */}
      <SidebarComponent
        Links={selectedRole === "Instructor" ? InstructorLinks : StudentsLinks}
      />

      {/* The Main Content */}
      <main className="bg-background w-screen border rounded-2xl m-3 md:m-5 shadow-md">
        {/* Main Header */}
        <header className="flex justify-between items-center gap-2 border-b p-2">
          <div className="flex gap-2">
            <SidebarTrigger />
            <h1 className="font-bold text-xl text-primary border-l pl-2">
              Codexa
            </h1>
          </div>
          <div className="space-x-2 px-3">
            <ModeToggle />
            <LanguageToggle />
          </div>
        </header>

        {/* Main Content */}
        {children}
      </main>
    </SidebarProvider>
  );
}

export default PagesLayout;
