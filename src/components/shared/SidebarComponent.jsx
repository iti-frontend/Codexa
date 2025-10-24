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
import { ToolsLinks } from "@/Constants/sidebar-links";
import { Bot, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

function SidebarComponent({ Links }) {
  const { handleLogout } = useAuthStore();
  const pathName = usePathname();
  return (
    <Sidebar className="!border-0">
      <SidebarHeader>
        <UserMenu />
      </SidebarHeader>
      <SidebarContent className="p-5">
        {/* Rendering Links */}
        {Links.map((link, index) => (
          <Button
            key={index}
            asChild
            data-active={pathName === link.href ? "true" : undefined}
            className={cn(
              "justify-start transition-colors",
              "data-[active=true]:bg-primary data-[active=true]:text-white",
              "data-[active=true]:hover:dark:bg-primary data-[active=true]:hover:dark:text-white"
            )}
            variant="ghost"
          >
            <Link href={link.href} className="items-center gap-2 font-semibold">
              <link.icon size={18} /> {link.name}
            </Link>
          </Button>
        ))}
        <h6 className="px-3 pt-4 text-sm text-foreground/70">Tools</h6>
        {ToolsLinks.map((tool, index) => (
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
        {/* AI Button */}
        <Button
          variant="ghost"
          className="
    group/button relative flex items-center justify-start
    w-fit overflow-hidden
    transition-all duration-300 ease-in-out
    hover:w-full
  "
        >
          <Bot className="shrink-0" />

          <span
            className="
      inline-block
      opacity-0 translate-x-[-0.5rem]
      group-hover/button:opacity-100 group-hover/button:translate-x-0
      transition-all duration-300 ease-in-out
      whitespace-nowrap
    "
          >
            Codexa AI
          </span>
        </Button>

        {/* Logout Button */}
        <Button
          asChild
          variant="outline"
          className="bg-transparent text-red-500 hover:text-red-500 w-full"
        >
          <Link href="/login" onClick={handleLogout}>
            <LogOut /> Sign out
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
export default SidebarComponent;
