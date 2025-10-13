"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import { LanguageToggle } from "../ui/language-toggle";
import { UserMenu } from "./user-menu";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function HomeNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "w-full shadow-xs font-inter bg-primary/10 sticky top-0 duration-300 z-20",
        isScrolled ? "bg-white shadow-md" : "bg-primary/10"
      )}
    >
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
                  className="text-gray-700 hover:text-primary transition text-lg"
                >
                  Community
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-primary transition text-lg"
                >
                  About
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  href="#reviews"
                  className="text-gray-700 hover:text-primary transition text-lg"
                >
                  Reviews
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* ===== Action Button ===== */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className={"flex gap-2"}>
            {/* Theme Toggle */}
            <NavigationMenuItem>
              <ModeToggle />
            </NavigationMenuItem>

            {/* Language Toggle */}
            <NavigationMenuItem>
              <LanguageToggle />
            </NavigationMenuItem>

            {/* User Menu */}
            <NavigationMenuItem>
              <UserMenu />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default HomeNavbar;
