import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { 
  signupUser, 
  loginUser, 
  logoutUser, 
  updateUserProfile,
  getUserProfile,
  onAuthChange 
} from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // ✅ Function to refresh user data from Firestore
  const refreshUserData = useCallback(async () => {
    if (!user || !user.uid) {
      console.log('⚠️ No user to refresh');
      return { success: false, error: 'No user logged in' };
    }

    console.log('🔄 Refreshing user data for:', user.uid);

    try {
      const result = await getUserProfile(user.uid);
      
      if (result.success && result.user) {
        console.log('✅ User data refreshed successfully');
        console.log('📦 New purchasedCourses:', result.user.purchasedCourses);
        
        // Update user state
        setUser(result.user);
        
        // Update cache
        sessionStorage.setItem(`user_${result.user.uid}`, JSON.stringify(result.user));
        
        return { success: true, user: result.user };
      } else {
        console.error('❌ Failed to refresh user data:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
      return { success: false, error: error.message };
    }
  }, [user]);

  // ✅ Auth state listener
  useEffect(() => {
    console.log('🔧 Setting up auth state listener');
    let isMounted = true;
    
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (!isMounted) return;

      try {
        if (firebaseUser) {
          console.log('👤 Firebase user detected:', firebaseUser.uid);
          
          // Check cache first
          const cachedUser = sessionStorage.getItem(`user_${firebaseUser.uid}`);
          if (cachedUser) {
            console.log('📦 Using cached user profile');
            setUser(JSON.parse(cachedUser));
            setIsLoading(false);
            setAuthInitialized(true);
            return;
          }

          // Fetch fresh profile
          const result = await getUserProfile(firebaseUser.uid);
          
          if (result.success && isMounted) {
            console.log('✅ User profile loaded successfully');
            const userData = result.user;
            setUser(userData);
            sessionStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(userData));
          } else if (isMounted) {
            console.log('⚠️ Creating basic user profile');
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              mobileNumber: '',
              phoneVerified: false,
              address: '',
              purchasedCourses: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            setUser(newProfile);
            sessionStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(newProfile));
          }
        } else {
          console.log('🚪 No user signed in - clearing state');
          setUser(null);
          sessionStorage.clear();
        }
      } catch (error) {
        console.error('❌ Error in auth state change:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    });

    return () => {
      isMounted = false;
      console.log('🧹 Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  // ✅ Signup function
  const signup = useCallback(async (name, email, password) => {
    console.log('📝 Signup attempt for:', email);
    
    try {
      setIsLoading(true);
      const result = await signupUser(name, email, password);
      
      if (result.success) {
        console.log('✅ Signup successful');
        const userData = {
          ...result.user,
          purchasedCourses: result.user.purchasedCourses || []
        };
        setUser(userData);
        sessionStorage.setItem(`user_${userData.uid}`, JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        console.error('❌ Signup failed:', result.error);
        setIsLoading(false);
        return result;
      }
    } catch (error) {
      console.error('❌ Signup exception:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred during signup' 
      };
    }
  }, []);

  // ✅ Login function
  const login = useCallback(async (email, password) => {
    console.log('🔐 Login attempt for:', email);
    
    try {
      setIsLoading(true);
      const result = await loginUser(email, password);
      
      if (result.success) {
        console.log('✅ Login successful');
        const userData = {
          ...result.user,
          purchasedCourses: result.user.purchasedCourses || []
        };
        setUser(userData);
        sessionStorage.setItem(`user_${userData.uid}`, JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        console.error('❌ Login failed:', result.error);
        setIsLoading(false);
        return result;
      }
    } catch (error) {
      console.error('❌ Login exception:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred during login' 
      };
    }
  }, []);

  // ✅ FIXED: Logout function with proper cleanup
  const logout = useCallback(async () => {
    console.log('🚪 Logout initiated');
    
    try {
      setIsLoading(true);
      
      // ✅ Clear state BEFORE calling Firebase logout
      const tempUser = user; // Save for logging
      setUser(null);
      sessionStorage.clear();
      localStorage.clear();
      
      console.log('🧹 Local state cleared for user:', tempUser?.uid);
      
      // ✅ Then call Firebase logout
      const result = await logoutUser();
      
      if (result.success) {
        console.log('✅ Firebase logout successful');
      } else {
        console.error('⚠️ Firebase logout had issues but local state is cleared');
      }
      
      setIsLoading(false);
      
      // ✅ Force page reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // ✅ Even on error, clear everything
      setUser(null);
      sessionStorage.clear();
      localStorage.clear();
      setIsLoading(false);
      
      // ✅ Still reload page
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  }, [user]);

  // ✅ Update profile function
  const updateProfile = useCallback(async (updatedData) => {
    if (!user || !user.uid) {
      console.error('❌ Update profile failed: No user logged in');
      return { success: false, error: 'No user logged in' };
    }

    console.log('📝 Updating profile for user:', user.uid);

    try {
      const result = await updateUserProfile(user.uid, updatedData);
      
      if (result && result.success) {
        console.log('✅ Profile update successful');
        const userData = {
          ...result.user,
          purchasedCourses: result.user.purchasedCourses || user.purchasedCourses || []
        };
        setUser(userData);
        sessionStorage.setItem(`user_${userData.uid}`, JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        const errorMsg = result?.error || 'Failed to update profile';
        console.error('❌ Profile update failed:', errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('❌ Profile update exception:', error);
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred during profile update' 
      };
    }
  }, [user]);

  // ✅ Memoize context value
  const value = useMemo(() => ({
    user,
    isLoading,
    signup,
    login,
    logout,
    updateProfile,
    refreshUserData,
    isAuthenticated: !!user,
    authInitialized
  }), [user, isLoading, signup, login, logout, updateProfile, refreshUserData, authInitialized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};