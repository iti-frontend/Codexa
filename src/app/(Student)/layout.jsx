import SidebarComponent from "@/components/shared/SidebarComponent";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function StudentLayout({ children }) {
  return (
    <SidebarProvider>
      {/* The Main Side bar */}
      <SidebarComponent />

      {/* The Main Content */}
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
export default StudentLayout;
