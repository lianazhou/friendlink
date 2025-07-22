// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase config (DEFINE FIRST)
const firebaseConfig = {
  apiKey: "AIzaSyACs2JuLdKf35dBaIWVEH_S3H0en3wGNjc",
  authDomain: "friendlink-3fbd3.firebaseapp.com",
  projectId: "friendlink-3fbd3",
  storageBucket: "friendlink-3fbd3.appspot.com",
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