"use client";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import ChangePasswordDialog from "../auth/ChangePasswordDialog";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    name: "",
    role: "",
    profileImage: "/auth/login.png",
  });

  const { t } = useTranslation();
  const userInfo = Cookies.get("userInfo");

  useEffect(() => {
    try {
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        setUser({
          name: userData.name || "",
          role: userData.role?.toLowerCase() || "",
          profileImage: userData.profileImage || "/auth/login.png",
        });
      }
    } catch (error) {
      console.error("Error reading user info from cookies:", error);
    }
  }, [userInfo]);


  //  Dynamic PROFILE ROUTE
  const profileLink = "/profile";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="gap-3 rounded-2xl justify-start px-5 py-6 mt-5 border-b border-border"
            size="lg"
          >
            <Avatar className="relative">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex flex-col items-start justify-start">
              <h5>{user.name || "User"}</h5>
              <h6 className="text-foreground/50 text-xs">{user.role || ""}</h6>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={profileLink}>{t("sidebar.profile")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            {t("sidebar.changePassword")}
          </DropdownMenuItem>
          <hr />
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangePasswordDialog open={open} onOpenChange={setOpen} />
    </>
  );
}