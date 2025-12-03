// src/services/authService.js - FIXED WITH purchasedCourses
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "../firebase";

/**
 * Sign up a new user with email and password
 * Also creates user profile in Firestore Database
 */
export const signupUser = async (name, email, password) => {
  try {
    // Validate inputs
    if (!name || !email || !password) {
      return {
        success: false,
        error: 'Please fill in all fields'
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long'
      };
    }

    console.log('Creating user with email:', email);

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('User created successfully:', user.uid);

    // Update display name in Firebase Auth
    await updateFirebaseProfile(user, {
      displayName: name
    });

    // ✅ Create user profile in Firestore Database with purchasedCourses
    const userProfile = {
      uid: user.uid,
      name: name,
      email: email,
      mobileNumber: '',
      address: '',
      purchasedCourses: [], // ✅ Initialize empty array
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Store in Firestore at collection: users, document: userId
    await setDoc(doc(db, 'users', user.uid), userProfile);

    console.log('User profile created in Firestore');

    // Return profile with ISO string timestamps for consistency
    return { 
      success: true, 
      user: {
        ...userProfile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Signup error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    return { 
      success: false, 
      error: getErrorMessage(error.code) 
    };
  }
};

/**
 * Sign in existing user with email and password
 */
export const loginUser = async (email, password) => {
  try {
    // Validate inputs
    if (!email || !password) {
      return {
        success: false,
        error: 'Please enter email and password'
      };
    }

    // Trim whitespace from email and password
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    console.log('Login attempt for:', trimmedEmail);

    // Sign in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
    const user = userCredential.user;

    console.log('User signed in successfully:', user.uid);

    // Fetch user profile from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      console.log('User profile found in Firestore');
      const userProfile = userDocSnap.data();
      
      // ✅ Ensure purchasedCourses exists
      const completeProfile = {
        ...userProfile,
        purchasedCourses: userProfile.purchasedCourses || [],
        createdAt: userProfile.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: userProfile.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
      
      console.log('✅ User purchased courses:', completeProfile.purchasedCourses.length);
      
      return { 
        success: true, 
        user: completeProfile
      };
    } else {
      console.log('User profile not found, creating new one');
      // ✅ Profile doesn't exist, create one with purchasedCourses
      const userProfile = {
        uid: user.uid,
        name: user.displayName || trimmedEmail.split('@')[0],
        email: user.email,
        mobileNumber: '',
        address: '',
        purchasedCourses: [], // ✅ Initialize empty array
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      return { 
        success: true, 
        user: {
          ...userProfile,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    return { 
      success: false, 
      error: getErrorMessage(error.code) 
    };
  }
};

/**
 * Sign out current user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { 
      success: false, 
      error: "Failed to logout" 
    };
  }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    if (!userId) {
      console.error('Update failed: User ID is required');
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    if (!updates || Object.keys(updates).length === 0) {
      console.error('Update failed: No updates provided');
      return {
        success: false,
        error: 'No updates provided'
      };
    }

    console.log('Updating profile for user:', userId);
    console.log('Updates to apply:', updates);

    const userDocRef = doc(db, 'users', userId);
    
    // First check if user exists
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      console.error('User not found in Firestore');
      return {
        success: false,
        error: 'User profile not found'
      };
    }

    // Add updatedAt timestamp
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    console.log('Applying updates to Firestore...');
    await updateDoc(userDocRef, updateData);

    console.log('Profile updated successfully in Firestore');

    // Fetch updated profile
    const updatedDocSnap = await getDoc(userDocRef);
    
    if (updatedDocSnap.exists()) {
      const updatedUser = updatedDocSnap.data();
      console.log('Fetched updated user profile:', updatedUser);
      
      // ✅ Convert Firestore timestamps to ISO strings and ensure purchasedCourses exists
      return { 
        success: true, 
        user: {
          ...updatedUser,
          purchasedCourses: updatedUser.purchasedCourses || [],
          createdAt: updatedUser.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: updatedUser.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        }
      };
    } else {
      console.error('Failed to fetch updated profile');
      return {
        success: false,
        error: 'Failed to fetch updated profile'
      };
    }
  } catch (error) {
    console.error("Update profile error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    return { 
      success: false, 
      error: `Failed to update profile: ${error.message}` 
    };
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId) => {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    console.log('Fetching profile for user:', userId);

    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      console.log('User profile fetched successfully');
      const userData = userDocSnap.data();
      
      // ✅ Convert Firestore timestamps to ISO strings and ensure purchasedCourses exists
      const completeProfile = {
        ...userData,
        purchasedCourses: userData.purchasedCourses || [],
        createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: userData.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
      
      console.log('✅ Purchased courses count:', completeProfile.purchasedCourses.length);
      
      return { 
        success: true, 
        user: completeProfile
      };
    } else {
      console.log('User profile not found in Firestore');
      return { 
        success: false, 
        error: "User profile not found" 
      };
    }
  } catch (error) {
    console.error("Get profile error:", error);
    return { 
      success: false, 
      error: "Failed to fetch profile" 
    };
  }
};

/**
 * Listen to authentication state changes
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      console.log('Auth state changed: User signed in', firebaseUser.uid);
    } else {
      console.log('Auth state changed: User signed out');
    }
    callback(firebaseUser);
  });
};

/**
 * Convert Firebase error codes to user-friendly messages
 */
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed. Please contact support.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'Invalid email or password';
    case 'auth/wrong-password':
      return 'Invalid email or password';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection';
    case 'auth/requires-recent-login':
      return 'Please log in again to perform this action';
    case 'auth/missing-password':
      return 'Please enter your password';
    case 'auth/invalid-login-credentials':
      return 'Invalid email or password';
    default:
      return `Authentication error. Please try again.`;
  }
};