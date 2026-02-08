"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Firebase import
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Mail, Lock, ChevronRight, Bike } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Success! Redirect to Dashboard
      router.push("/");
    } catch (err: any) {
      console.error(err);
      // Error handling (User friendly messages)
      if (err.code === 'auth/invalid-credential') {
        setError("Galat email ya password hai bhai.");
      } else {
        setError("Login failed. Internet check karo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      
      {/* 🔮 GLASS AUTH CARD */}
      <Card className="glass-card w-full max-w-md border-white/20 shadow-2xl animate-enter">
        <CardHeader className="space-y-1 text-center pb-8">
          {/* Logo / Icon Animation */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <Bike className="h-8 w-8 text-primary animate-pulse" />
          </div>
          
          <CardTitle className="text-2xl font-black tracking-tight">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-base">
            Apni ride track karne ke liye login karein.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* EMAIL INPUT */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-input bg-white/50 px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-white"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Password (min 6 chars)"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-input bg-white/50 px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-white"
                />
              </div>
              
              {/* Error Message Display */}
              {error && (
                <p className="text-xs font-medium text-destructive px-1 animate-in slide-in-from-left-1">
                  ⚠️ {error}
                </p>
              )}
            </div>

            {/* LOGIN BUTTON */}
            <Button 
              type="submit" 
              className="w-full h-12 text-base rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-all shadow-lg shadow-blue-500/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login Now <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* DIVIDER */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/0 px-2 text-muted-foreground backdrop-blur-sm rounded-md">
                  Or continue with
                </span>
              </div>
            </div>

            {/* SOCIAL BUTTON (Disabled for now visually) */}
            <Button variant="glass" type="button" className="w-full h-11" disabled>
               Google (Coming Soon)
            </Button>

          </form>

          {/* FOOTER: SIGN UP LINK */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">New Rider? </span>
            <Link 
              href="/signup" 
              className="font-bold text-primary hover:underline underline-offset-4 transition-colors"
            >
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}