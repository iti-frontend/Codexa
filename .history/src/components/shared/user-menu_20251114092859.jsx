"use client";


import React, { useState,useEffect } from "react";
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

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ name: "", role: "",profileImage: "/auth/login.png" });

  useEffect(() => {
    try {
      const userInfoCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userInfo="))
        ?.split("=")[1];

      if (userInfoCookie) {
        const userData = JSON.parse(decodeURIComponent(userInfoCookie));
        setUser({
          name: userData.name || "",
          role: userData.role?.toLowerCase() || "",
          profileImage: userData.profileImage || "/auth/login.png"
        });
      }
    } catch (error) {
      console.error("Error reading user info from cookies:", error);
    }
  }, []);

  const profileLink =
    user.role === "student"
      ? "/student/profile"
      : "/instructor/profile/";

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
              <AvatarImage src={user.profileImage} />
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
            <Link href={profileLink}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Change Password
          </DropdownMenuItem>
          <hr />
          <DropdownMenuItem asChild>
            <Link href="/login">Sign In</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangePasswordDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
