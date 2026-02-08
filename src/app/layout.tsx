import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/shared/BottomNav";
import { AuthProvider } from "@/context/AuthContext";

// ?? FONT SETUP (Google Fonts - Zero Shift)
const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

// ?? VIEWPORT SETTINGS (Critical for Mobile App Feel)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Zoom rokne ke liye
  themeColor: "#ffffff", // Light mode status bar
};

// ?? SEO & PWA METADATA
export const metadata: Metadata = {
  title: "AuraTrakk Pro - Smart Bike Manager",
  description: "Track mileage, expenses, and live rides with AI-powered odometer scanning.",
  applicationName: "AuraTrakk",
  authors: [{ name: "Jitendra Singh", url: "https://jitendrasingh.online" }],
  keywords: ["Bike Tracker", "Mileage Calculator", "Expense Manager", "India", "Petrol Log"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AuraTrakk",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          outfit.variable
        )}
      >
        {/* ?? APP CONTAINER 
            Mobile view ko center mein rakhta hai desktop par.
        */}
<AuthProvider>
        <main className="app-container relative flex flex-col">
          {children}
<BottomNav />
        </main>
      </body>
    </html>
  );
}