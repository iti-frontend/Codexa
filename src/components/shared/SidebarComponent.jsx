"use client";
import { UserMenu } from "./user-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SettingsMenu } from "./settings-menu";
import { ToolsLinks } from "@/Constants/sidebar-links";


function SidebarComponent({ Links }) {
  const pathName = usePathname();
  return (
    <Sidebar className="!border-0">
      <SidebarHeader>
        <UserMenu/>
      </SidebarHeader>
      <SidebarContent className="p-5 space-y-2">
        {/* Rendering Links */}
        {Links.map((link, index) => (
          <Button
            key={index}
            asChild
            className={cn(
              "justify-start",
              pathName === link.href &&
                "bg-primary-foreground text-primary/80 hover:bg-primary-foreground hover:text-primary/80"
            )}
            variant="ghost"
          >
            <Link href={link.href} className="items-center gap-2 font-semibold">
              <link.icon size={18} /> {link.name}
            </Link>
          </Button>
        ))}
        <h6 className="px-3 pt-4 text-sm text-foreground/70">Tools</h6>
        {ToolsLinks.map((tool,index)=>(
          <Button
            key={index}
            asChild
            className={cn(
              "justify-start",
              pathName === tool.href &&
                "bg-primary-foreground text-primary/80 hover:bg-primary-foreground hover:text-primary/80"
            )}
            variant="ghost"
          >
            <Link href={tool.href} className="items-center gap-2 font-semibold">
              <tool.icon size={18} /> {tool.name}
            </Link>
          </Button>
      ))}
      </SidebarContent>
      <SidebarFooter className="p-5">
        <SettingsMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
export default SidebarComponent;
