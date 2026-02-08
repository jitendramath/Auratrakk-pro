"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Settings, Bell, Moon, ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login"); // History stack clear karke login pe bhejo
  };

  // Avatar Initials Generator
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  return (
    <div className="px-4 py-8 pb-32 min-h-screen space-y-6 animate-enter">
      
      {/* 1. HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight">Settings</h1>
        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
          <Settings className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* 2. PROFILE CARD (The ID Badge) */}
      <Card className="glass-card border-none overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90" />
        
        <CardContent className="pt-16 pb-6 px-6 relative">
          <div className="flex flex-col items-center">
            
            {/* AVATAR */}
            <div className="h-24 w-24 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shadow-xl mb-3 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600">
                  {user?.displayName ? getInitials(user.displayName) : "G"}
                </span>
              )}
            </div>

            {/* INFO */}
            <h2 className="text-xl font-bold text-foreground">
              {user?.displayName || "Guest Rider"}
            </h2>
            <p className="text-sm text-muted-foreground font-medium mb-4">
              {user?.email || "No account linked"}
            </p>

            {/* BADGE */}
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
              user ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-orange-100 text-orange-700"
            )}>
              {user ? "Pro Member" : "Guest Mode"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. SETTINGS MENU LIST */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
          Preferences
        </h3>

        {/* NOTIFICATIONS */}
        <Button variant="glass" className="w-full justify-between h-14 rounded-2xl group">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600">
              <Bell className="h-4 w-4" />
            </div>
            <span className="font-semibold text-foreground">Notifications</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-active:translate-x-1 transition-transform" />
        </Button>

        {/* DARK MODE (Placeholder for now) */}
        <Button variant="glass" className="w-full justify-between h-14 rounded-2xl group">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
              <Moon className="h-4 w-4" />
            </div>
            <span className="font-semibold text-foreground">Appearance</span>
          </div>
          <div className="text-xs font-bold text-muted-foreground bg-secondary px-2 py-1 rounded-md">
            Auto
          </div>
        </Button>

        {/* ACCOUNT SECURITY */}
        <Button variant="glass" className="w-full justify-between h-14 rounded-2xl group">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-semibold text-foreground">Security</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-active:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* 4. LOGOUT ZONE */}
      <div className="pt-4">
        {user ? (
          <Button 
            variant="destructive" 
            className="w-full h-14 rounded-2xl shadow-lg shadow-red-500/20 font-bold tracking-wide"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        ) : (
          <Button 
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 font-bold"
            onClick={() => router.push("/login")}
          >
            <User className="mr-2 h-4 w-4" />
            Sign In / Register
          </Button>
        )}
        
        <p className="text-center text-[10px] text-muted-foreground/60 mt-4 font-medium">
          AuraTrakk v2.0 • Build 2402 • Made with ❤️
        </p>
      </div>

    </div>
  );
}