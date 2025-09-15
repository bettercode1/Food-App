import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Check if we should force demo mode (useful for deployed demos)
const FORCE_DEMO_MODE = import.meta.env.VITE_FORCE_DEMO_MODE === 'true';

// Check if Firebase environment variables are properly set
const validateFirebaseConfig = () => {
  if (FORCE_DEMO_MODE) {
    console.warn('🎭 FORCE_DEMO_MODE enabled - Firebase disabled for demo purposes');
    return false;
  }
  
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing Firebase environment variables:', missingVars);
    console.warn('Please check your .env file and ensure all Firebase credentials are set.');
    console.warn('Demo authentication will be used as fallback.');
    return false;
  }
  
  return true;
};

// Firebase configuration with fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate configuration
const isConfigValid = validateFirebaseConfig();

// Initialize Firebase only if config is valid
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let analytics: any = null;

if (isConfigValid) {
  console.log('⚙️ Initializing Firebase with config valid');
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    console.log('✅ Firebase services initialized:', { 
      auth: !!auth, 
      db: !!db, 
      storage: !!storage 
    });

    // Initialize Analytics (only in browser and if measurement ID is provided)
    analytics = typeof window !== 'undefined' && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID 
      ? getAnalytics(app) 
      : null;

    // Connect to emulators in development
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
      try {
        connectAuthEmulator(auth, "http://localhost:9099");
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectStorageEmulator(storage, "localhost", 9199);
      } catch (error) {
        console.log('Firebase emulators already connected or not available');
      }
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    console.error('Please check your Firebase configuration in .env file');
    console.warn('Demo authentication will be used as fallback.');
  }
} else {
  console.warn('Firebase not initialized due to missing configuration');
  console.warn('Demo authentication will be used as fallback.');
}

// Export services with fallback handling
export { auth, db, storage, analytics };
export default app;

// Export function to check if Firebase is available
export const isFirebaseAvailable = () => isConfigValid && auth && db;
