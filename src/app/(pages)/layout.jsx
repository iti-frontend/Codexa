import React from "react";
import SidebarComponent from "@/components/shared/SidebarComponent";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { InstructorLinks, StudentsLinks } from "@/Constants/sidebar-links";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
function PagesLayout({ children }) {
  const role = "student";
  return (
    <SidebarProvider>
      {/* The Main Side bar */}
      <SidebarComponent
        Links={role === "instructor" ? InstructorLinks : StudentsLinks}
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
