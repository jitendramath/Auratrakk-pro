"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Fuel, Wrench, MapPin, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "ride" | "fuel" | "expense";
}

export default function AddEntryModal({ isOpen, onClose, defaultTab = "fuel" }: AddEntryModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);

  // Form States
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState(""); // Used for Pump Name or Expense Note
  const [odometer, setOdometer] = useState("");

  // 🏷️ SMART CHIPS CONFIG
  const quickTags = {
    fuel: ["Ranwa Pump", "Nayara", "Shell", "Power"],
    expense: ["Service", "Engine Oil", "Puncture", "Wash", "Challan"],
    ride: ["Office", "Home", "Trip", "Errand"]
  };

  // 💾 SAVE LOGIC
  const handleSubmit = async () => {
    if (!user || !amount) return;
    setLoading(true);

    try {
      // Data Object Construction
      const payload = {
        type: activeTab,
        amount: Number(amount),
        description: description, // Pump Name or Note
        odometer: Number(odometer) || 0, // Optional
        date: serverTimestamp(),
        userId: user.uid, // Security
      };

      // Firestore Save
      await addDoc(collection(db, `users/${user.uid}/rides`), payload);
      
      // Reset & Close
      setAmount("");
      setDescription("");
      setOdometer("");
      onClose();
    } catch (error) {
      console.error("Save Error:", error);
      alert("Save failed! Internet check karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          
          {/* BACKDROP BLUR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* 🔮 GLASS MODAL */}
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-2xl"
          >
            
            {/* HEADER & TABS */}
            <div className="p-4 pb-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">New Entry</h3>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* CUSTOM TABS SWITCHER */}
              <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl">
                {[
                  { id: "ride", label: "Ride", icon: MapPin },
                  { id: "fuel", label: "Fuel", icon: Fuel },
                  { id: "expense", label: "Expense", icon: Wrench },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all",
                      activeTab === tab.id
                        ? "bg-white dark:bg-zinc-800 shadow-sm text-primary scale-[1.02]"
                        : "text-muted-foreground hover:bg-white/50"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* FORM CONTENT */}
            <div className="p-6 space-y-5">
              
              {/* 1. AMOUNT INPUT */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">
                  {activeTab === 'ride' ? 'Distance (KM)' : 'Amount (₹)'}
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-4xl font-black bg-transparent border-none outline-none placeholder:text-muted-foreground/30 py-2"
                />
              </div>

              {/* 2. DESCRIPTION INPUT */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-muted-foreground uppercase ml-1">
                  {activeTab === 'fuel' ? 'Petrol Pump' : 'Description / Note'}
                </label>
                <input
                  type="text"
                  placeholder={activeTab === 'fuel' ? "Pump Name..." : "Details..."}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-input bg-white/50 dark:bg-black/20 px-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all"
                />

                {/* 🏷️ SMART CHIPS (Quick Select) */}
                <div className="flex flex-wrap gap-2">
                  {quickTags[activeTab as keyof typeof quickTags].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setDescription(tag)}
                      className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. OPTIONAL ODOMETER */}
              {activeTab === 'fuel' && (
                <div>
                   <label className="text-xs font-bold text-muted-foreground uppercase ml-1">
                    Current Odometer (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 12500"
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-input bg-white/50 dark:bg-black/20 px-4 py-2 text-sm outline-none"
                  />
                </div>
              )}

              {/* ACTION BUTTON */}
              <Button 
                onClick={handleSubmit}
                disabled={!amount || loading}
                className={cn(
                  "w-full h-14 text-lg rounded-2xl shadow-lg transition-all active:scale-95",
                  activeTab === 'fuel' ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/25" :
                  activeTab === 'expense' ? "bg-purple-600 hover:bg-purple-700 shadow-purple-600/25" :
                  "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25"
                )}
              >
                {loading ? <Loader2 className="animate-spin" /> : <Check className="mr-2" />}
                {loading ? "Saving..." : `Save ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
              </Button>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}