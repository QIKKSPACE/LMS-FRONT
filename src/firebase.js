// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// IMPORTANT: Use the SAME config as your admin panel
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;