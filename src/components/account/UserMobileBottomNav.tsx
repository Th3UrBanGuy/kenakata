
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "./navItems";


export function UserMobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-t-lg z-50">
        <div className="grid h-16 grid-cols-5 items-center">
        {navItems.map((item) => (
        <Link
            key={item.href}
            href={item.href}
            className={cn(
            "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-all text-xs h-full",
            pathname === item.href ? "text-primary bg-muted/50" : "hover:bg-muted/50"
            )}
        >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
        </Link>
        ))}
        </div>
    </nav>
  );
}
