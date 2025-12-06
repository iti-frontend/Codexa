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
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bot, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import AiChatWidget from "../ai/AiChatWidget";
import { useState } from "react";
import { ToolsLinks } from "@/Constants/sidebar-links";
import { useTranslation } from "react-i18next";
function SidebarComponent({ Links }) {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const { handleLogout } = useAuthStore();
  const pathName = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const logOut = () => {
    handleLogout();
    router.push("/login");
  };

  return (
    <Sidebar  className="!border-0">
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
              <link.icon size={18} /> {t(`sidebar.${link.nameKey}`)}
            </Link>
          </Button>
        ))}
        <h6 className="px-3 pt-4 text-sm text-foreground/70">{t("sidebar.tools")}</h6>
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
              <tool.icon size={18} /> {t(`sidebar.${tool.nameKey}`)}
            </Link>
          </Button>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-5">
        {/* AI Button */}
        <Button
          onClick={() => setIsAiOpen(true)}
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
            {t("sidebar.codexaAI")}
          </span>
        </Button>

        {/* Logout Button */}
        <Button
          variant="outline"
          onClick={logOut}
          className="bg-transparent text-red-500 hover:text-red-500 w-full"
        >
          <LogOut /> {t("sidebar.signout")}
        </Button>
      </SidebarFooter>
      <AiChatWidget open={isAiOpen} onClose={() => setIsAiOpen(false)} />

    </Sidebar>
  );
}
export default SidebarComponent;