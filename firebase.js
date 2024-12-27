// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7qu9-dbYzhBtz_oT-tuQc9eKdCtXhWGM",
  authDomain: "ubnd-3cb91.firebaseapp.com",
  projectId: "ubnd-3cb91",
  storageBucket: "ubnd-3cb91.firebasestorage.app",
  messagingSenderId: "129322785875",
  appId: "1:129322785875:web:353576c03df897a1637aa6",
  measurementId: "G-42T7LVP89Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc };
