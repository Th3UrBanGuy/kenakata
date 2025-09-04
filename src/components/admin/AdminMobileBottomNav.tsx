
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/toolbox", label: "Toolbox", icon: Wrench },
  ];

export function AdminMobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-t-lg z-50">
        <div className="grid h-16 grid-cols-2 items-center">
        {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
                 <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                    "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-all text-sm h-full",
                    isActive ? "text-primary bg-muted/50" : "hover:bg-muted/50"
                    )}
                >
                    <item.icon className="h-5 w-5" />
                    <span className="text-xs">{item.label}</span>
                </Link>
            )
        })}
        </div>
    </nav>
  );
}
