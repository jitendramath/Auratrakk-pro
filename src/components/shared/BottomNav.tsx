"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  // Navigation Items Config
  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "History",
      href: "/history",
      icon: History,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[280px]">
      {/* 💎 GLASS PILL CONTAINER 
        - Backdrop Blur: High
        - Border: Subtle white/20
        - Shadow: Deep glow
      */}
      <nav className="flex items-center justify-between px-6 py-4 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl shadow-black/5 ring-1 ring-black/5">
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 transition-all duration-300",
                isActive 
                  ? "text-primary scale-110" 
                  : "text-muted-foreground hover:text-foreground hover:scale-105"
              )}
            >
              {/* Active Indicator Dot (Optional but looks pro) */}
              {isActive && (
                <span className="absolute -top-3 h-1 w-1 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(59,130,246,0.5)]" />
              )}

              <Icon 
                className={cn(
                  "h-6 w-6 transition-all", 
                  isActive && "fill-primary/20" // Icon ke andar halka rang bharega
                )} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              
              {/* Text Label (Sirf active hone par dikha sakte ho, ya hamesha) 
                  Abhi clean look ke liye hata diya hai, sirf icon rakha hai.
              */}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}