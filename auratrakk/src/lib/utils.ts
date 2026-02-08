import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * ?? CN (Class Name) MERGER
 * Tailwind classes ko conditionally merge karne ke liye.
 * Example: cn("bg-red-500", isActive && "bg-green-500") -> Sahi class lagayega bina conflict ke.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ?? CURRENCY FORMATTER (Indian Rupee)
 * Example: 1500 -> "?1,500"
 */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0, // Point ke baad zero hata diye (clean look)
  }).format(amount);
}

/**
 * ?? DISTANCE FORMATTER
 * Example: 12500 -> "12,500 km"
 */
export function formatDistance(km: number) {
  return new Intl.NumberFormat("en-IN").format(km) + " km";
}

/**
 * ?? DATE FORMATTER (Short & Clean)
 * Example: "12 Feb, 10:30 AM"
 */
export function formatDate(date: Date | number) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * ?? DELAY (Artificial Lag for Smooth Loading UI)
 * Example: await delay(1000) -> 1 second wait
 */
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}