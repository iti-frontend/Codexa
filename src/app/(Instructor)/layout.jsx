import SidebarComponent from "@/components/shared/SidebarComponent";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { InstructorLinks } from "@/Constants/sidebar-links";

function InstructorLayout({ children }) {
  return (
    <SidebarProvider>
      {/* The Main Side bar */}
      <SidebarComponent Links={InstructorLinks} />

      {/* The Main Content */}
      <main className="bg-background w-screen border rounded-xl m-5 p-5">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
export default InstructorLayout;
