import React from 'react'
import SidebarComponent from "@/components/shared/SidebarComponent";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { InstructorLinks, StudentsLinks } from "@/Constants/sidebar-links";
function PagesLayout({children}) {
    const role ='instructor' 
  return (
        <SidebarProvider>
      {/* The Main Side bar */}
      <SidebarComponent Links={ role==='instructor' ? InstructorLinks : StudentsLinks}  />

      {/* The Main Content */}
      <main className="bg-background w-screen border rounded-xl m-5 p-5">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default PagesLayout;