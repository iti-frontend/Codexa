"use client";
import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
import { navItems } from "@/Constants/Home-data";
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
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
export default function HomeNavbar() {
  const { t } = useTranslation();

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
  const { t } = useTranslation();

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
              <LogOut /> {t("home.nav.logout")}
            </Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function HomeNavMenu(props) {
  const { t } = useTranslation();

  return (
    <div {...props}>
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Button
            asChild
            variant={"primary"}
            className={"!rounded-md justify-start"}
            key={item.href}
          >
            <a key={item.href} href={item.href}>
              <Icon className="w-4 h-4 lg:hidden" />
              <span className="block hotext-primary">{t(`home.nav.${item.translationKey}`)}</span>
            </a>
          </Button>
        );
      })}
    </div>
  );
}

function Logo() {
  return <h3 className="text-xl font-bold text-primary">Codexa</h3>;
}

function UserAvatar({ className }) {
  const { t } = useTranslation();

  return (
    <Link href="/" className={cn("flex gap-2 items-center", className)}>
      <Avatar>
        <AvatarImage src="" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <span className="lg:hidden">{t("home.nav.user")}</span>
    </Link>
  );
}