// Import Firebase modules
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7qu9-dbYzhBtz_oT-tuQc9eKdCtXhWGM",
  authDomain: "ubnd-3cb91.firebaseapp.com",
  projectId: "ubnd-3cb91",
  storageBucket: "ubnd-3cb91.firebasestorage.app",
  messagingSenderId: "129322785875",
  appId: "1:129322785875:web:353576c03df897a1637aa6",
  measurementId: "G-42T7LVP89Q",
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics (optional, only if supported)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { db, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc };
