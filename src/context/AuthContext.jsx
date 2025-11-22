import React, { createContext, useState, useContext, useEffect } from 'react';

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

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Sign up function
  const signup = async (name, email, password) => {
    try {
      // Get existing users from localStorage
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
        mobileNumber: '',
        address: ''
      };

      // Add to users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Set as current user (without password in state)
      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      // Get existing users from localStorage
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Find user by email
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Check password
      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      // Set as current user (without password in state)
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  // Update user profile
  const updateProfile = (updatedData) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      // Get existing users from localStorage
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Find and update user
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        localStorage.setItem('users', JSON.stringify(users));

        // Update current user (without password)
        const updatedUser = { ...users[userIndex] };
        delete updatedUser.password;
        
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        return { success: true, user: updatedUser };
      }

      throw new Error('User not found');
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isLoading,
    signup,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};