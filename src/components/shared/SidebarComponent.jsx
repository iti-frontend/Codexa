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
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { useLiveSessions } from "@/hooks/useLiveSessions";

function SidebarComponent({ Links, side = "left", ToolsLinks }) {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const { handleLogout } = useAuthStore();
  const pathName = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  // Fetch live sessions to check for active status
  const { sessions, refetch } = useLiveSessions();
  const hasActiveSession = sessions?.some((session) => session.status === "live");

  // Refetch sessions when pathname changes to keep status updated
  useEffect(() => {
    refetch();
  }, [pathName, refetch]);

  const logOut = () => {
    handleLogout();
    router.push("/login");
  };

  return (
    <Sidebar side={side} className="border-x">
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
              {link.nameKey === "liveSessions" && hasActiveSession && (
                <Badge className="bg-transparent animate-pulse border-none">
                  🔴
                </Badge>
              )}
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
