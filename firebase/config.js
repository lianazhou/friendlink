// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase config (DEFINE FIRST)
const firebaseConfig = {
  apiKey: "AIzaSyACs2JuLdKf35dBaIWVEH_S3H0en3wGNjc",
  authDomain: "friendlink-3fbd3.firebaseapp.com",
  projectId: "friendlink-3fbd3",
  storageBucket: "friendlink-3fbd3.firebasestorage.app",
  messagingSenderId: "933539472522",
  appId: "1:933539472522:web:f8b9e7d0e2ccf5fc1c7973",
  measurementId: "G-LCYDQ1M8DV"
};

// Initialize Firebase (USE AFTER DEFINING CONFIG)
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics (only in web environment)
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.log('Analytics not available in this environment:', error);
}

// Enable offline persistence for Firestore
try {
  db.settings({
    cacheSizeBytes: 50 * 1024 * 1024, // 50 MB
  });
} catch (error) {
  console.log('Firestore settings error (this is normal in some environments):', error);
}

// Add error logging for debugging
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user.uid);
  } else {
    console.log('User is signed out');
  }
});