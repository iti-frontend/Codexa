import SidebarComponent from "@/components/shared/SidebarComponent";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { InstructorLinks } from "@/Constants/sidebar-links";

function StudentLayout({ children }) {
  return (
    <SidebarProvider>
      {/* The Main Side bar */}
      <SidebarComponent Links={InstructorLinks} />

      {/* The Main Content */}
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
export default StudentLayout;
