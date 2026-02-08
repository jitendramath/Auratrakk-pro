import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging"; // Notification ke liye

// ?? Secure Config: Yeh values .env.local se aayengi
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ?? SINGLETON LOGIC:
// Agar app pehle se initialized hai, toh wahi use karo.
// Agar nahi, toh naya banao. (Next.js Hot Reload Crash Fix)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ? Services Export
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ?? Messaging (Client Side Only Check)
// Next.js server par bhi chalta hai, aur server par 'window' nahi hota.
// Isliye messaging sirf tab initialize karenge jab hum Browser mein hon.
let messaging: any = null;
if (typeof window !== "undefined") {
    // Isse try-catch mein rakha hai kyunki kabhi-kabhi browser support nahi karta
    try {
        messaging = getMessaging(app);
    } catch (err) {
        console.warn("Firebase Messaging failed to init (Guest or Unsupported Browser)");
    }
}

export { app, auth, db, storage, messaging };