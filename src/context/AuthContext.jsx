// src/context/AuthContext.jsx - OPTIMIZED VERSION
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

  // Memoize auth state listener to prevent recreation
  useEffect(() => {
    console.log('Setting up auth state listener');
    let isMounted = true;
    
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (!isMounted) return;

      try {
        if (firebaseUser) {
          console.log('Firebase user detected:', firebaseUser.uid);
          
          // OPTIMIZATION: Check if we already have this user's data
          const cachedUser = sessionStorage.getItem(`user_${firebaseUser.uid}`);
          if (cachedUser) {
            console.log('Using cached user profile');
            setUser(JSON.parse(cachedUser));
            setIsLoading(false);
            setAuthInitialized(true);
            return;
          }

          // Fetch profile only if not cached
          const result = await getUserProfile(firebaseUser.uid);
          
          if (result.success && isMounted) {
            console.log('User profile loaded successfully');
            const userData = result.user;
            setUser(userData);
            // Cache user data
            sessionStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(userData));
          } else if (isMounted) {
            console.log('Creating basic user profile');
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              mobileNumber: '',
              address: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            setUser(newProfile);
            sessionStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(newProfile));
          }
        } else {
          console.log('No user signed in');
          setUser(null);
          sessionStorage.clear(); // Clear all cached data
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
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
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  // OPTIMIZATION: Memoize signup function
  const signup = useCallback(async (name, email, password) => {
    console.log('Signup attempt for:', email);
    
    try {
      setIsLoading(true);
      const result = await signupUser(name, email, password);
      
      if (result.success) {
        console.log('Signup successful');
        setUser(result.user);
        // Cache immediately
        sessionStorage.setItem(`user_${result.user.uid}`, JSON.stringify(result.user));
        return { success: true, user: result.user };
      } else {
        console.error('Signup failed:', result.error);
        setIsLoading(false);
        return result;
      }
    } catch (error) {
      console.error('Signup exception:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred during signup' 
      };
    }
  }, []);

  // OPTIMIZATION: Memoize login function
  const login = useCallback(async (email, password) => {
    console.log('Login attempt for:', email);
    
    try {
      setIsLoading(true);
      const result = await loginUser(email, password);
      
      if (result.success) {
        console.log('Login successful');
        setUser(result.user);
        // Cache immediately
        sessionStorage.setItem(`user_${result.user.uid}`, JSON.stringify(result.user));
        return { success: true, user: result.user };
      } else {
        console.error('Login failed:', result.error);
        setIsLoading(false);
        return result;
      }
    } catch (error) {
      console.error('Login exception:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred during login' 
      };
    }
  }, []);

  // OPTIMIZATION: Memoize logout function
  const logout = useCallback(async () => {
    console.log('Logout initiated');
    
    try {
      setIsLoading(true);
      const result = await logoutUser();
      
      if (result.success) {
        console.log('Logout successful');
        setUser(null);
        sessionStorage.clear();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  }, []);

  // OPTIMIZATION: Memoize updateProfile function
  const updateProfile = useCallback(async (updatedData) => {
    if (!user || !user.uid) {
      console.error('Update profile failed: No user logged in');
      return { success: false, error: 'No user logged in' };
    }

    console.log('Updating profile for user:', user.uid);

    try {
      const result = await updateUserProfile(user.uid, updatedData);
      
      if (result && result.success) {
        console.log('Profile update successful');
        setUser(result.user);
        // Update cache
        sessionStorage.setItem(`user_${result.user.uid}`, JSON.stringify(result.user));
        return { success: true, user: result.user };
      } else {
        const errorMsg = result?.error || 'Failed to update profile';
        console.error('Profile update failed:', errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('Profile update exception:', error);
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred during profile update' 
      };
    }
  }, [user]);

  // OPTIMIZATION: Memoize context value
  const value = useMemo(() => ({
    user,
    isLoading,
    signup,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    authInitialized
  }), [user, isLoading, signup, login, logout, updateProfile, authInitialized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};