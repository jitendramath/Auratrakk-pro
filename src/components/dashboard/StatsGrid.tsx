"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsGridProps {
  mileage: number;      // e.g., 45.2
  expense: number;      // e.g., 1200
  mileageTrend?: number; // Optional: Pichle mahine se kitna up/down hai (percentage)
}

export default function StatsGrid({ 
  mileage, 
  expense, 
  mileageTrend = 2.5 // Dummy trend value for visual appeal
}: StatsGridProps) {
  
  return (
    <section className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
      
      {/* 1. MILEAGE CARD (Green Accent) */}
      <Card className="glass-card border-none relative overflow-hidden group">
        {/* Background Gradient Blob */}
        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-green-500/10 blur-2xl group-hover:bg-green-500/20 transition-all" />
        
        <CardContent className="p-5 flex flex-col justify-between h-full">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            {/* Trend Badge */}
            <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-md">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              {mileageTrend}%
            </span>
          </div>

          {/* Value */}
          <div className="mt-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Avg. Mileage
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground tracking-tight">
                {mileage}
              </span>
              <span className="text-xs font-bold text-muted-foreground">kmpl</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. EXPENSE CARD (Purple Accent) */}
      <Card className="glass-card border-none relative overflow-hidden group">
        {/* Background Gradient Blob */}
        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-all" />

        <CardContent className="p-5 flex flex-col justify-between h-full">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Wallet className="h-4 w-4" />
            </div>
            {/* Trend Badge (Dummy Logic: Expense Badha hai) */}
            <span className="flex items-center text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded-md">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              12%
            </span>
          </div>

          {/* Value */}
          <div className="mt-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              This Month
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground tracking-tight">
                {formatCurrency(expense)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

    </section>
  );
}