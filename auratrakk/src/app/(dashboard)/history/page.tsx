"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, formatDistance, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Fuel, MapPin, Wrench, Calendar, Filter, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// 📝 Data Type
interface LogEntry {
  id: string;
  type: "ride" | "fuel" | "expense";
  amount: number;
  description: string;
  date: Timestamp;
  odometer?: number;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "ride" | "fuel" | "expense">("all");

  // 🔥 REAL-TIME DATA FETCHING
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/rides`),
      orderBy("date", "desc") // Latest pehle
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LogEntry[];
      
      setLogs(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 🧹 FILTER LOGIC
  const filteredLogs = filter === "all" 
    ? logs 
    : logs.filter((log) => log.type === filter);

  return (
    <div className="px-4 py-8 pb-32 min-h-screen">
      
      {/* 1. HEADER & FILTERS */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl pb-4 pt-2 -mx-4 px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight">History</h1>
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "all", label: "All", icon: Filter },
            { id: "ride", label: "Rides", icon: MapPin },
            { id: "fuel", label: "Fuel", icon: Fuel },
            { id: "expense", label: "Expense", icon: Wrench },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                filter === f.id
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background border-border text-muted-foreground hover:bg-secondary"
              )}
            >
              <f.icon className="h-3 w-3" />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LOADING STATE */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p className="text-sm font-medium">Fetching records...</p>
        </div>
      )}

      {/* 3. EMPTY STATE */}
      {!loading && filteredLogs.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center">
            <Filter className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div>
            <h3 className="text-lg font-bold">No records found</h3>
            <p className="text-sm text-muted-foreground">Try changing the filter or add a new entry.</p>
          </div>
        </div>
      )}

      {/* 4. THE LIST (ANIMATED) */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-card border-none hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  
                  {/* ICON BOX */}
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                    log.type === "ride" && "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
                    log.type === "fuel" && "bg-orange-100 dark:bg-orange-900/20 text-orange-600",
                    log.type === "expense" && "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
                  )}>
                    {log.type === "ride" && <MapPin className="h-6 w-6" />}
                    {log.type === "fuel" && <Fuel className="h-6 w-6" />}
                    {log.type === "expense" && <Wrench className="h-6 w-6" />}
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm truncate pr-2">
                        {log.description || (log.type === 'ride' ? 'Ride Entry' : 'Unknown')}
                      </h4>
                      <span className={cn(
                        "font-black text-sm whitespace-nowrap",
                        log.type === "ride" ? "text-blue-600" : "text-foreground"
                      )}>
                        {log.type === "ride" 
                          ? `+${log.amount} km` 
                          : formatCurrency(log.amount)
                        }
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[11px] text-muted-foreground font-medium">
                        {formatDate(log.date?.toDate())}
                      </p>
                      {log.odometer && (
                        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                          ODO: {log.odometer}
                        </span>
                      )}
                    </div>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}