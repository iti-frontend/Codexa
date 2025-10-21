"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { ModeToggle } from "../ui/mode-toggle";

export function SettingsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-3 justify-start px-5 py-6 mt-5"
          size="lg"
        >
          <Settings />
          Settings
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <ModeToggle />
        </DropdownMenuItem>
        <DropdownMenuItem>Language</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
