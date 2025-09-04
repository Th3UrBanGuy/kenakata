
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
    <>
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
      
      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-t-lg z-50">
         <div className="grid h-16 grid-cols-5 items-center">
            {navItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-all text-sm h-full",
                pathname === item.href ? "text-primary bg-muted/50" : "hover:bg-muted/50"
                )}
            >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
            </Link>
            ))}
         </div>
      </nav>
    </>
  );
}
