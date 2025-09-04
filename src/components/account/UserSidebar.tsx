
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/account/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/account/orders", icon: Package, label: "Orders" },
    { href: "/account/wishlist", icon: Heart, label: "Wishlist" },
    { href: "/account/profile", icon: User, label: "Profile" },
    { href: "/account/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside>
      <nav className="hidden md:flex flex-col gap-2 text-sm font-medium">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname === item.href && "bg-muted text-primary"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <nav className="md:hidden flex overflow-x-auto border-b mb-6">
         {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground transition-all text-sm shrink-0",
              pathname === item.href && "text-primary border-b-2 border-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
