
import { LayoutDashboard, Package, Settings, User, Heart } from "lucide-react";

export const navItems = [
    { href: "/account/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/account/orders", icon: Package, label: "Orders" },
    { href: "/account/wishlist", icon: Heart, label: "Wishlist" },
    { href: "/account/profile", icon: User, label: "Profile" },
    { href: "/account/settings", icon: Settings, label: "Settings" },
];
