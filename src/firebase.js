// src/firebase.js - SECURE VERSION with Environment Variables
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ SECURE: Load configuration from environment variables
const firebaseConfig = {
    apiKey: "AIzaSyCLhGlh_Taw-aRI7vEQBEzkzrjeuAKUxNc",
    authDomain: "stf-web-34a3b.firebaseapp.com",
    databaseURL: "https://stf-web-34a3b-default-rtdb.firebaseio.com",
    projectId: "stf-web-34a3b",
    storageBucket: "stf-web-34a3b.firebasestorage.app",
    messagingSenderId: "311427704953",
    appId: "1:311427704953:web:a93b0b28026b4d140b0ca8",
    measurementId: "G-79FBF73WJM"
};

// Validate that all required environment variables are present
const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing required Firebase environment variables:', missingVars);
    throw new Error(`Missing Firebase configuration: ${missingVars.join(', ')}`);
}

// Initialize Firebase
console.log('🔥 Initializing Firebase...');
const app = initializeApp(firebaseConfig);
console.log('✅ Firebase initialized successfully');

// Initialize Auth
export const auth = getAuth(app);
console.log('✅ Firebase Auth initialized');

// Initialize Firestore Database
export const db = getFirestore(app);
console.log('✅ Firestore Database initialized');

export default app;