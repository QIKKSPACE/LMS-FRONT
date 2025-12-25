import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

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
console.log(' Initializing Firebase...');
const app = initializeApp(firebaseConfig);
console.log(' Firebase initialized successfully');

// Initialize Auth
export const auth = getAuth(app);
console.log(' Firebase Auth initialized');

// Initialize Firestore Database
export const db = getFirestore(app);
console.log(' Firestore Database initialized');

//  FIX: Initialize App Check for development
// This tells Firebase your app is legitimate
if (typeof window !== 'undefined') {
  try {
    console.log(' Initializing Firebase App Check...');
    
    // For development/testing - use debug token
    //  IMPORTANT: In production, get proper reCAPTCHA site key from Firebase Console
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6LcVXXXXXXXXXXXXXXXXXXXXXXXXXXXX'), // Placeholder
      isTokenAutoRefreshEnabled: true
    });
    
    console.log(' App Check initialized');
  } catch (error) {
    console.warn(' App Check initialization failed:', error);
    console.log(' Continuing without App Check (development mode)');
  }
}

export default app;