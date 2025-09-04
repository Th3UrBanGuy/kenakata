
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/account/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/account/orders", icon: Package, label: "Orders" },
    { href: "/account/profile", icon: User, label: "Profile" },
    { href: "/account/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="hidden md:block">
      <nav className="grid items-start gap-2 text-sm font-medium">
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
    </aside>
  );
}
