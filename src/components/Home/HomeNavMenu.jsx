"use client";

import { navItems } from "@/Constants/Home-data";
import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeNavMenu(props) {
  const pathname = usePathname();

  return (
    <div {...props}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            data-active={isActive}
            className="flex items-center gap-2 px-3 py-2 rounded-md transition w-full text-sm
                       hover:bg-accent hover:text-accent-foreground
                       data-[active=true]:bg-primary data-[active=true]:text-white"
          >
            <Icon className="w-4 h-4 md:hidden" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
export default HomeNavMenu;
