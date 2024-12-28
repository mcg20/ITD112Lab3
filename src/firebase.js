// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7SQeO9PgEwu49KjFLPjx0kNO1B7gg7Lg",
  authDomain: "itd112lab3-7aa93.firebaseapp.com",
  projectId: "itd112lab3-7aa93",
  storageBucket: "itd112lab3-7aa93.firebasestorage.app",
  messagingSenderId: "805155168449",
  appId: "1:805155168449:web:e1caeb73a2ccf590c8f440"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore (ensure this comes AFTER app initialization)
const db = getFirestore(app);

export { db };
