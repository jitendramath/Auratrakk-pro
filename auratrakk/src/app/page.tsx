"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 🚀 Navigation ke liye
import { 
  Bike, 
  Fuel, 
  Wrench, 
  MapPin, 
  ScanLine, 
  ChevronRight, 
  Plus,
  TrendingUp,
  Wallet 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

// 🧩 Custom Components Imports
import Odometer from "@/components/dashboard/Odometer";
import AddEntryModal from "@/components/forms/AddEntryModal"; 

export default function Dashboard() {
  const router = useRouter(); // Hook for navigation

  // 🎭 STATE
  const [showManual, setShowManual] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"ride" | "fuel" | "expense">("fuel");

  // Dummy Data (Baad mein Firebase se aayega)
  const [odometer] = useState(12540); 
  const [mileage] = useState(45.2);
  const [expense] = useState(1200);

  // ⚡ HANDLERS
  const handleStartRide = () => {
    router.push("/ride"); // 🏁 Redirects to Live Ride Page
  };

  const openModal = (tab: "ride" | "fuel" | "expense") => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 px-6 pt-8 pb-32 animate-enter min-h-screen">
      
      {/* 1. HEADER & GREETING */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Aura<span className="text-primary">Trakk</span>
          </h1>
          <p className="text-xs text-muted-foreground font-medium tracking-wide">
            READY TO RIDE? 🏍️
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-[2px]">
          <div className="h-full w-full rounded-full bg-background border-2 border-transparent overflow-hidden">
             {/* Profile Pic Placeholder */}
             <img src="/images/user.png" alt="User" className="h-full w-full object-cover opacity-80" />
          </div>
        </div>
      </div>

      {/* 2. HERO ODOMETER (The Centerpiece) */}
      <section className="text-center py-6 relative">
        <span className="text-[10px] font-bold tracking-[3px] text-muted-foreground uppercase opacity-70">
          Total Distance
        </span>
        
        <div className="flex items-baseline justify-center gap-2 mt-2">
          {/* Animated Odometer Component */}
          <Odometer value={odometer} />
          <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg -translate-y-6">
            KM
          </span>
        </div>

        {/* Floating Ticker Pill */}
        <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-white/40 dark:bg-black/20 border border-white/20 backdrop-blur-md shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-foreground/80">
            System Operational
          </span>
        </div>
      </section>

      {/* 3. STATS ROW (Glass Pills) */}
      <section className="grid grid-cols-2 gap-4">
        {/* Mileage Card */}
        <Card className="glass-card border-none">
          <CardContent className="p-5 flex flex-col items-start h-full justify-between">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Avg. Mileage
                </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-foreground">{mileage}</span>
              <span className="text-xs text-muted-foreground">kmpl</span>
            </div>
          </CardContent>
        </Card>

        {/* Expense Card */}
        <Card className="glass-card border-none">
          <CardContent className="p-5 flex flex-col items-start h-full justify-between">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                    <Wallet className="h-3 w-3" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Month Spent
                </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-foreground">
                {formatCurrency(expense)}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. QUICK ACTIONS GRID */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
            Quick Actions
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          
          {/* Main Action: START RIDE (Connected to Router) */}
          <Button 
            onClick={handleStartRide}
            variant="default" 
            className="h-auto aspect-[1.3] flex-col gap-3 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/20 border-t border-white/20 active:scale-95 transition-transform"
          >
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-bold text-white">Start Ride</span>
          </Button>

          {/* Action: ADD FUEL (Opens Modal) */}
          <Button 
            onClick={() => openModal("fuel")}
            variant="glass" 
            className="h-auto aspect-[1.3] flex-col gap-3 rounded-3xl bg-white/60 dark:bg-white/5 hover:bg-white/80 active:scale-95 transition-transform"
          >
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Fuel className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm font-bold text-foreground">Add Fuel</span>
          </Button>

          {/* Action: MANUAL LOG (Toggles Hidden Section) */}
          <Button 
            onClick={() => setShowManual(!showManual)}
            variant="glass" 
            className="h-auto aspect-[1.3] flex-col gap-3 rounded-3xl bg-white/60 dark:bg-white/5 hover:bg-white/80 active:scale-95 transition-transform"
          >
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-bold text-foreground">Manual Log</span>
          </Button>

          {/* Action: EXPENSE (Opens Modal) */}
          <Button 
            onClick={() => openModal("expense")}
            variant="glass" 
            className="h-auto aspect-[1.3] flex-col gap-3 rounded-3xl bg-white/60 dark:bg-white/5 hover:bg-white/80 active:scale-95 transition-transform"
          >
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-bold text-foreground">Expense</span>
          </Button>
        </div>
      </section>

      {/* 5. HIDDEN MANUAL BOX (Collapsible) */}
      {showManual && (
        <div className="animate-in slide-in-from-top-4 fade-in duration-300">
          <Card className="glass-card border-l-4 border-l-primary overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">Manual Entry</span>
                <span className="text-xs text-muted-foreground">Update Odometer</span>
              </div>
              
              {/* AI SCANNER BUTTON (Logic in backend route) */}
              <Button className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition-opacity rounded-xl h-12 gap-2">
                <ScanLine className="h-4 w-4" />
                AI Smart Scan
              </Button>

              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Reading (e.g. 12550)"
                  className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button size="icon" className="h-12 w-12 shrink-0 rounded-xl">
                    <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 6. MODAL (Hidden by default, opens on button click) */}
      <AddEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultTab={modalTab} 
      />
      
    </div>
  );
}
