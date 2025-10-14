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

function SidebarComponent({ Links }) {
  const pathName = usePathname();
  return (
    <Sidebar className="!border-0">
      <SidebarHeader>
        <UserMenu />
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
      </SidebarContent>
      <SidebarFooter className="p-5">
        <SettingsMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
export default SidebarComponent;
