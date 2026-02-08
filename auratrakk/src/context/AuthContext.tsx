"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

// 📝 TYPE DEFINITION
interface AuthContextType {
  user: User | null;       // Ya toh User object hoga, ya null (Guest)
  loading: boolean;        // Jab tak check kar rahe hain, loading true rahega
}

// 1. Context Create Karo
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// 2. Provider Component (Wrapper)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🎧 Firebase Listener: Jab bhi login/logout hoga, yeh chalega
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Check complete, ab app dikha sakte hain
    });

    // Cleanup (Jab component hatega, listener band karo)
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children} {/* Loading khatam hone ke baad hi app render karo */}
    </AuthContext.Provider>
  );
}

// 3. Custom Hook (Easy Access ke liye)
export const useAuth = () => useContext(AuthContext);