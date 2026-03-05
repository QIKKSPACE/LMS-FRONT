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
 */
export const signupUser = async (name, email, password) => {
  try {
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

    console.log('📝 Creating user with email:', email);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✅ User created successfully:', user.uid);

    await updateFirebaseProfile(user, {
      displayName: name
    });

    // ✅ Create user profile with phoneVerified field
    const userProfile = {
      uid: user.uid,
      name: name,
      email: email,
      mobileNumber: '',
      phoneVerified: false,
      address: '',
      purchasedCourses: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    console.log('✅ User profile created in Firestore');

    return { 
      success: true, 
      user: {
        ...userProfile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("❌ Signup error:", error);
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
    if (!email || !password) {
      return {
        success: false,
        error: 'Please enter email and password'
      };
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    console.log('🔐 Login attempt for:', trimmedEmail);

    const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
    const user = userCredential.user;

    console.log('✅ User signed in successfully:', user.uid);

    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      console.log('✅ User profile found in Firestore');
      const userProfile = userDocSnap.data();
      
      const completeProfile = {
        ...userProfile,
        purchasedCourses: userProfile.purchasedCourses || [],
        phoneVerified: userProfile.phoneVerified || false,
        createdAt: userProfile.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: userProfile.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
      
      console.log('✅ User phone verified:', completeProfile.phoneVerified);
      
      return { 
        success: true, 
        user: completeProfile
      };
    } else {
      console.log('⚠️ User profile not found, creating new one');
      const userProfile = {
        uid: user.uid,
        name: user.displayName || trimmedEmail.split('@')[0],
        email: user.email,
        mobileNumber: '',
        phoneVerified: false,
        address: '',
        purchasedCourses: [],
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
    console.error("❌ Login error:", error);
    return { 
      success: false, 
      error: getErrorMessage(error.code) 
    };
  }
};

/**
 * ✅ FIXED: Sign out current user with proper cleanup
 */
export const logoutUser = async () => {
  try {
    console.log('🚪 Logging out user...');
    
    // ✅ Clear all session storage first
    sessionStorage.clear();
    
    // ✅ Clear local storage (if you use it)
    localStorage.clear();
    
    // ✅ Sign out from Firebase
    await signOut(auth);
    
    console.log('✅ User signed out successfully');
    
    return { success: true };
  } catch (error) {
    console.error("❌ Logout error:", error);
    
    // ✅ Even if Firebase logout fails, clear local data
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch (clearError) {
      console.error("❌ Error clearing storage:", clearError);
    }
    
    return { 
      success: false, 
      error: "Failed to logout. Please try again." 
    };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    if (!userId) {
      console.error('❌ Update failed: User ID is required');
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    if (!updates || Object.keys(updates).length === 0) {
      console.error('❌ Update failed: No updates provided');
      return {
        success: false,
        error: 'No updates provided'
      };
    }

    console.log('📝 Updating profile for user:', userId);
    console.log('📦 Updates to apply:', updates);

    const userDocRef = doc(db, 'users', userId);
    
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      console.error('❌ User not found in Firestore');
      return {
        success: false,
        error: 'User profile not found'
      };
    }

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    console.log('💾 Applying updates to Firestore...');
    await updateDoc(userDocRef, updateData);

    console.log('✅ Profile updated successfully in Firestore');

    const updatedDocSnap = await getDoc(userDocRef);
    
    if (updatedDocSnap.exists()) {
      const updatedUser = updatedDocSnap.data();
      console.log('✅ Fetched updated user profile');
      
      return { 
        success: true, 
        user: {
          ...updatedUser,
          purchasedCourses: updatedUser.purchasedCourses || [],
          phoneVerified: updatedUser.phoneVerified || false,
          createdAt: updatedUser.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: updatedUser.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        }
      };
    } else {
      console.error('❌ Failed to fetch updated profile');
      return {
        success: false,
        error: 'Failed to fetch updated profile'
      };
    }
  } catch (error) {
    console.error("❌ Update profile error:", error);
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

    console.log('📥 Fetching profile for user:', userId);

    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      console.log('✅ User profile fetched successfully');
      const userData = userDocSnap.data();
      
      const completeProfile = {
        ...userData,
        purchasedCourses: userData.purchasedCourses || [],
        phoneVerified: userData.phoneVerified || false,
        createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: userData.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
      
      console.log('✅ Phone verified status:', completeProfile.phoneVerified);
      
      return { 
        success: true, 
        user: completeProfile
      };
    } else {
      console.log('❌ User profile not found in Firestore');
      return { 
        success: false, 
        error: "User profile not found" 
      };
    }
  } catch (error) {
    console.error("❌ Get profile error:", error);
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
      console.log('🔄 Auth state changed: User signed in', firebaseUser.uid);
    } else {
      console.log('🔄 Auth state changed: User signed out');
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