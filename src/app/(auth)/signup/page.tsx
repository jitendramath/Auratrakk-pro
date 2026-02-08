"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Mail, Lock, User, Sparkles } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form Data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password kam se kam 6 characters ka hona chahiye.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create User in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Set Display Name (Immediate Personalization)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name
        });
      }

      // Success!
      router.push("/");
      
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Yeh email pehle se registered hai. Login karo.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Email address sahi nahi lag raha.");
      } else {
        setError("Signup failed. Try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      
      <Card className="glass-card w-full max-w-md border-white/20 shadow-2xl animate-enter">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
          
          <CardTitle className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Join AuraTrakk
          </CardTitle>
          <CardDescription className="text-base">
            Apna account banao aur smart riding shuru karo.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* NAME INPUT */}
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Full Name (e.g. Jitendra Singh)"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-input bg-white/50 px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all focus:bg-white"
                />
              </div>
            </div>

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
                  className="flex h-12 w-full rounded-xl border border-input bg-white/50 px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all focus:bg-white"
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
                  className="flex h-12 w-full rounded-xl border border-input bg-white/50 px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all focus:bg-white"
                />
              </div>
              
              {error && (
                <p className="text-xs font-medium text-destructive px-1 animate-in slide-in-from-left-1">
                  ⚠️ {error}
                </p>
              )}
            </div>

            {/* SIGNUP BUTTON */}
            <Button 
              type="submit" 
              className="w-full h-12 text-base rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all shadow-lg shadow-purple-500/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* FOOTER: LOGIN LINK */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link 
              href="/login" 
              className="font-bold text-primary hover:underline underline-offset-4 transition-colors"
            >
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}