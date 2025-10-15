"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-3 rounded-2xl justify-start px-5 py-6 mt-5 border-b border-border"
          size="lg"
        >
          {/* User Image */}
          <Avatar className="relative">
            <AvatarImage src="/auth/login.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {/* User Details */}
          <div className="space-y-1 flex flex-col items-start justify-start">
            <h5>Codexa</h5>
            <h6 className="text-foreground/50 text-xs">Instructor</h6>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Change Password</DropdownMenuItem>
        <hr />
        <DropdownMenuItem asChild>
          <Link href="/login">Sign In</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
