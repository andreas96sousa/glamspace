import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase with safety check
const isConfigured = !!firebaseConfig.apiKey;

if (!isConfigured && typeof window !== "undefined") {
  console.warn("Firebase: API Key ausente. Configure o arquivo .env.local.");
}

let app;
let auth: any;
let db: any;

try {
  if (isConfigured) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    // Fallback semi-funcional ou nulo para evitar erros de importação
    app = getApps().length > 0 ? getApp() : null;
    auth = null;
    db = null;
  }
} catch (error) {
  console.error("Erro ao inicializar Firebase:", error);
}

export { auth, db, app };
