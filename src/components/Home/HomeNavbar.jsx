import Link from "next/link";
import { ArrowUpRight, LogOut, Menu } from "lucide-react";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { ModeToggle } from "../ui/mode-toggle";
import { LanguageToggle } from "../ui/language-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import HomeNavMenu from "./HomeNavMenu";
import { cn } from "@/lib/utils";

export default function HomeNavbar() {
  return (
    <nav className="h-16 bg-background border-b sticky top-0 z-30">
      <div className="h-full flex items-center justify-between container mx-auto px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <HomeNavMenu className="hidden lg:flex flex-row items-center gap-4" />

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Toggles */}
          <div className="space-x-3 hidden lg:flex">
            <ModeToggle />
            <LanguageToggle />
          </div>

          {/* User Button */}
          <UserAvatar className="hidden lg:flex" />

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavigationSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent className="pt-7 flex flex-col gap-6">
        {/* Sheet header */}
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-3">
          <Logo />
          <div className="flex items-center gap-2">
            <ModeToggle />
            <LanguageToggle />
          </div>
        </SheetHeader>

        {/* Mobile nav */}
        <HomeNavMenu className="flex flex-col gap-2 px-3" />

        {/* Sheet Footer */}
        <SheetFooter className="border-t gap-5">
          <UserAvatar />

          {/* Logout Button */}
          <Button
            asChild
            variant="outline"
            className="bg-transparent text-red-500 hover:text-red-500"
          >
            <Link href="/login">
              <LogOut /> Sign out
            </Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Logo() {
  return <h3 className="text-xl font-bold text-primary">Codexa</h3>;
}

function UserAvatar({ className }) {
  return (
    <Link href="/" className={cn("flex gap-2 items-center", className)}>
      <Avatar>
        <AvatarImage src="" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <span className="lg:hidden">Abanoub Abdelmessih</span>
    </Link>
  );
}
