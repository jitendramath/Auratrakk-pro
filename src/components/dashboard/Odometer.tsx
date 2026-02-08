"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface OdometerProps {
  value: number;
  className?: string;
}

export default function Odometer({ value, className }: OdometerProps) {
  // 1. Spring Physics (Bouncy & Smooth Effect)
  // Stiffness aur Damping se hum decide karte hain number kitni tezi se ghumega
  let spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  
  // 2. Value Format karna (Commas ke saath)
  let displayValue = useTransform(spring, (current) => 
    Math.round(current).toLocaleString("en-IN")
  );

  // 3. Effect: Jab value prop change ho, spring ko update karo
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <div className={cn("relative inline-block", className)}>
      {/* GLOW EFFECT BEHIND NUMBER */}
      <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50 pointer-events-none animate-pulse-slow" />
      
      {/* THE NUMBER */}
      <motion.span 
        className="relative z-10 text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/60 drop-shadow-sm"
      >
        {displayValue}
      </motion.span>
      
      {/* REFLECTION (Glassy Floor Effect) */}
      <motion.span 
        className="absolute left-0 top-full scale-y-[-0.3] opacity-10 blur-[2px] select-none pointer-events-none bg-clip-text text-transparent bg-gradient-to-b from-foreground to-transparent"
        aria-hidden="true"
      >
        {displayValue}
      </motion.span>
    </div>
  );
}