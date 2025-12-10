"use client";

import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
import { navItems } from "@/Constants/Home-data";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function HomeNavbar() {
  const { t } = useTranslation("home");

  return (
    <nav className="h-16 bg-background border-b sticky top-0 z-30">
      <div className="h-full flex items-center justify-between container mx-auto px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <HomeNavMenu className="hidden lg:flex flex-row items-center gap-4" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="space-x-3 hidden lg:flex">
            <ModeToggle />
            <LanguageToggle />
          </div>

          <UserAvatar className="hidden lg:flex" username={t("home.nav.user")} />

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
  const { t } = useTranslation("home");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent className="pt-7 flex flex-col gap-6">
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-3">
          <Logo />

          <div className="flex items-center gap-2">
            <ModeToggle />
            <LanguageToggle />
          </div>
        </SheetHeader>

        {/* Nav */}
        <HomeNavMenu className="flex flex-col gap-2 px-3" />

        {/* Footer */}
        <SheetFooter className="border-t gap-5">
          <UserAvatar username={t("home.nav.user")} />

          <Button
            asChild
            variant="outline"
            className="bg-transparent text-red-500 hover:text-red-500"
          >
            <Link href="/login">
              <LogOut className="w-4 h-4 mr-2" />
              {t("home.nav.logout")}
            </Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function HomeNavMenu({ className }) {
  const { t } = useTranslation("home");

  return (
    <div className={className}>
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Button
            key={item.key}
            asChild
            variant="primary"
            className="!rounded-md justify-start"
          >
            <Link href={item.href}>
              <Icon className="w-4 h-4 lg:hidden" />
              <span>{t(`home.nav.${item.key}`)}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}

function Logo() {
  return <h3 className="text-xl font-bold text-primary">Codexa</h3>;
}

function UserAvatar({ className, username }) {
  return (
    <Link href="/" className={cn("flex gap-2 items-center", className)}>
      <Avatar>
        <AvatarImage src="" />
        <AvatarFallback>{username?.[0]}</AvatarFallback>
      </Avatar>

      <span className="lg:hidden">{username}</span>
    </Link>
  );
}
