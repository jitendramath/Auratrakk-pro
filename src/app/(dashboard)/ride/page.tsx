"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, MapPin, Navigation, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { cn, formatCurrency } from "@/lib/utils";

export default function LiveRidePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // 🚦 RIDE STATE
  const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
  const [duration, setDuration] = useState(0); // Seconds
  const [distance, setDistance] = useState(0); // Kilometers
  const [speed, setSpeed] = useState(0);       // km/h
  const [cost, setCost] = useState(0);         // ₹ Estimated

  // 📍 GPS REFS (Ref isliye taaki re-render par value na khoye)
  const watchId = useRef<number | null>(null);
  const lastPos = useRef<{ lat: number; lng: number } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ⚙️ SETTINGS (Baad mein profile se le sakte hain)
  const PETROL_PRICE = 105; 
  const BIKE_MILEAGE = 45; 
  const COST_PER_KM = PETROL_PRICE / BIKE_MILEAGE; 

  // 🏁 START RIDE
  const startRide = () => {
    setStatus("running");
    
    // 1. Start Timer
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    // 2. Start GPS Tracking
    if ("geolocation" in navigator) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed: gpsSpeed } = position.coords;
          
          // Speed Update (m/s to km/h)
          setSpeed(gpsSpeed ? Math.round(gpsSpeed * 3.6) : 0);

          // Distance Calc (Haversine Logic)
          if (lastPos.current) {
            const dist = calculateDistance(
              lastPos.current.lat, 
              lastPos.current.lng, 
              latitude, 
              longitude
            );
            // Minimum movement threshold (GPS drift rokne ke liye)
            if (dist > 0.005) { 
              setDistance((prev) => {
                const newDist = prev + dist;
                setCost(newDist * COST_PER_KM); // Update Cost
                return newDist;
              });
            }
          }
          lastPos.current = { lat: latitude, lng: longitude };
        },
        (error) => console.error("GPS Error", error),
        { enableHighAccuracy: true, distanceFilter: 5 }
      );
    }
  };

  // ⏸️ PAUSE RIDE
  const pauseRide = () => {
    setStatus("paused");
    if (timerRef.current) clearInterval(timerRef.current);
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    setSpeed(0);
  };

  // 🛑 FINISH & SAVE
  const finishRide = async () => {
    pauseRide();
    if (!user) return;

    try {
      await addDoc(collection(db, `users/${user.uid}/rides`), {
        type: "ride",
        amount: Number(distance.toFixed(2)),
        duration: duration,
        cost: Number(cost.toFixed(2)),
        date: serverTimestamp(),
        description: "Live Tracked Ride 📍",
      });
      router.push("/history"); // Success -> History Page
    } catch (error) {
      console.error("Save failed", error);
      alert("Save failed! Screen shot lelo jaldi!");
    }
  };

  // 📐 HAVERSINE FORMULA (Earth Curve Distance)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth Radius (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ⏱️ FORMAT TIME (HH:MM:SS)
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      
      {/* 🌌 BACKGROUND ANIMATION (Speed Effect) */}
      <div className="absolute inset-0 opacity-20">
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/30 blur-[100px] rounded-full transition-all duration-1000",
          status === "running" && "scale-150 bg-blue-500/50 animate-pulse"
        )} />
      </div>

      {/* 1. TOP HUD (GPS & Time) */}
      <div className="relative z-10 p-6 flex justify-between items-start">
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          <div className={cn("h-2 w-2 rounded-full", status === "running" ? "bg-green-500 animate-ping" : "bg-red-500")} />
          <span className="text-[10px] font-bold tracking-widest uppercase">
            {status === "running" ? "GPS Active" : "GPS Ready"}
          </span>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Duration</p>
          <p className="text-2xl font-mono font-bold tracking-wider text-blue-400">
            {formatTime(duration)}
          </p>
        </div>
      </div>

      {/* 2. MAIN SPEEDOMETER (Center) */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
        <motion.div 
          animate={{ scale: status === "running" ? [1, 1.02, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-center"
        >
          <h1 className="text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
            {speed}
          </h1>
          <p className="text-xl font-bold text-zinc-500 uppercase tracking-[0.5em] -mt-2">
            KM/H
          </p>
        </motion.div>
      </div>

      {/* 3. STATS GRID (Distance & Cost) */}
      <div className="relative z-10 grid grid-cols-2 gap-4 px-6 mb-8">
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl backdrop-blur-md">
          <Navigation className="h-5 w-5 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{distance.toFixed(2)}</p>
          <p className="text-xs text-zinc-500 font-bold uppercase">Kilometers</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl backdrop-blur-md">
          <Zap className="h-5 w-5 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold">{formatCurrency(cost)}</p>
          <p className="text-xs text-zinc-500 font-bold uppercase">Est. Cost</p>
        </div>
      </div>

      {/* 4. CONTROLS (Swipe/Long Press Logic Placeholder) */}
      <div className="relative z-10 p-6 pb-12 bg-gradient-to-t from-black via-black/90 to-transparent">
        <AnimatePresence mode="wait">
          
          {status === "idle" && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Button 
                onClick={startRide}
                className="w-full h-16 rounded-full text-xl font-black italic bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/40"
              >
                START ENGINE <Play className="ml-2 h-5 w-5 fill-current" />
              </Button>
            </motion.div>
          )}

          {status === "running" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="grid grid-cols-4 gap-4"
            >
              <Button 
                onClick={pauseRide}
                className="col-span-1 h-16 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
              >
                <Pause className="h-6 w-6" />
              </Button>
              
              {/* FINISH BUTTON (Red) */}
              <Button 
                onClick={finishRide}
                className="col-span-3 h-16 rounded-2xl bg-red-600 hover:bg-red-500 text-lg font-bold tracking-wide shadow-lg shadow-red-600/20"
              >
                <Square className="mr-2 h-5 w-5 fill-current" />
                STOP RIDE
              </Button>
            </motion.div>
          )}

          {status === "paused" && (
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={startRide} className="h-16 rounded-2xl bg-green-600 text-lg font-bold">
                RESUME
              </Button>
              <Button onClick={finishRide} variant="destructive" className="h-16 rounded-2xl text-lg font-bold">
                END TRIP
              </Button>
            </div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}