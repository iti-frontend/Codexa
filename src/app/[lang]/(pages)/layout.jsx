'use client';
import React from "react";
import SidebarComponent from "@/components/shared/SidebarComponent";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { getAdminLinks, getInstructorLinks, getStudentsLinks } from "@/Constants/sidebar-links";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import Cookies from "js-cookie";
import { use } from 'react';

function PagesLayout({ children, params }) {
  // Unwrap params
  const { lang } = use(params);
  const isRTL = lang === "ar";
  const sidebarSide = isRTL ? "right" : "left";

  // قراءة دور المستخدم
  const userInfo = Cookies.get("userInfo");
  const role = userInfo ? JSON.parse(userInfo).role : "";
  const selectedRole = role === "Admin" ? "Admin" : role === "Instructor" ? "Instructor" : "Student";

  // اختيار اللينكس حسب الدور مع تمرير اللغة
  const Links = selectedRole === "Admin" ? getAdminLinks(lang)
    : selectedRole === "Instructor" ? getInstructorLinks(lang)
      : getStudentsLinks(lang);


  return (
    <SidebarProvider>
      {/* Sidebar */}
      <SidebarComponent side={sidebarSide} Links={Links} />

      {/* Main Content - استخدام SidebarInset عشان ياخد المساحة الصح */}
      <SidebarInset>
        {/* Header */}
        <header className={`flex justify-between items-center border-b p-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex gap-2 items-center ${isRTL ? "flex-row-reverse" : ""}`}>
            <SidebarTrigger />
            <h1 className={`font-bold text-xl text-primary ${isRTL ? "border-r pl-0 pr-2" : "border-l pl-2"}`}>
              Codexa
            </h1>
          </div>
          <div className="flex gap-2">
            <ModeToggle />
            <LanguageToggle />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-3">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default PagesLayout;