import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User } from "lucide-react";
import Link from "next/link";

function HomeNavbar() {
  return (
    <header className="w-fullshadow-xs font-inter bg-primary/10 ">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        {/* ===== Logo ===== */}
        <Link href="/" className="text-2xl font-bold text-primary">
          Codexa
        </Link>

        {/* ===== Navigation Menu ===== */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  href="#community"
                  className="text-gray-700 hover:text-primary transition text-[18px]"
                >
                  Community
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-[#e78a53] transition text-[18px]"
                >
                  About
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  href="#reviews"
                  className="text-gray-700 hover:text-[#e78a53] transition text-[18px]"
                >
                  Reviews
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* ===== Login Button ===== */}

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer text-muted-foreground"
              >
                <Menu className="h-8 w-8 text-2xl " />
              </Button>
            </SheetTrigger>

            <SheetContent side="top" className="w-full p-3">
              <h3 className="sr-only">Main Navigation</h3>
              <nav className="flex flex-col gap-6 text-lg">
                <Link
                  href="/"
                  className="font-bold text-primary text-xl border-b border-gray-300"
                >
                  Codexa
                </Link>
                <a href="#community" className="hover:text-primary transition">
                  Community
                </a>
                <a href="#about" className="hover:text-primary transition">
                  {" "}
                  About
                </a>
                <a href="#reviews" className="hover:text-primary transition">
                  {" "}
                  Reviews
                </a>
              </nav>
              <Button size="sm" className="bg-primary text-xl text-secondary">
                <Link className="flex items-center gap-2" href="/login">
                  <User /> Login
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default HomeNavbar;
