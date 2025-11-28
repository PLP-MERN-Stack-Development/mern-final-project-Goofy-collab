// src/hooks/useAuth.js
import { useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook for authentication
 * Provides easy access to auth state and methods
 * 
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated
  } = context;

  // Memoized helper functions
  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    return user.permissions?.includes(permission) || false;
  }, [user]);

  const getUserInitials = useCallback(() => {
    if (!user) return '';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  }, [user]);

  const getAvatarUrl = useCallback(() => {
    if (user?.avatar) return user.avatar;
    // Fallback to generated avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`;
  }, [user]);

  const isUserProfile = useCallback((userId) => {
    return user?.id === userId;
  }, [user]);

  // Enhanced sign in with remember me
  const signInWithRemember = useCallback(async (email, password, remember = true) => {
    const result = await signIn(email, password);
    if (result.success && !remember) {
      // If "remember me" is false, we could implement session-only storage
      // For now, we'll just note it in the result
      console.log('Sign in without remember me');
    }
    return result;
  }, [signIn]);

  // Check if user session is expired
  const isSessionValid = useCallback(() => {
    if (!user) return false;
    
    const token = localStorage.getItem('token');
    if (!token) return false;

    // In production, you would decode the JWT and check expiration
    // For now, we'll assume it's valid if it exists
    return true;
  }, [user]);

  // Refresh user data
  const refreshUserData = useCallback(async () => {
    // In production, fetch fresh user data from API
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return { success: true, user: JSON.parse(storedUser) };
      }
      return { success: false, error: 'No user data found' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Update specific user fields
  const updateUserField = useCallback(async (field, value) => {
    return await updateProfile({ [field]: value });
  }, [updateProfile]);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      // Simulate API call
      // In production: await fetch('/api/auth/change-password', {...})
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Request password reset
  const requestPasswordReset = useCallback(async (email) => {
    try {
      // Simulate API call
      // In production: await fetch('/api/auth/forgot-password', {...})
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: 'Password reset email sent' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Reset password with token
  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      // Simulate API call
      // In production: await fetch('/api/auth/reset-password', {...})
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: 'Password reset successfully' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Verify email
  const verifyEmail = useCallback(async (token) => {
    try {
      // Simulate API call
      // In production: await fetch('/api/auth/verify-email', {...})
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: 'Email verified successfully' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Resend verification email
  const resendVerificationEmail = useCallback(async () => {
    try {
      // Simulate API call
      // In production: await fetch('/api/auth/resend-verification', {...})
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: 'Verification email sent' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Delete account
  const deleteAccount = useCallback(async (password) => {
    try {
      // Simulate API call
      // In production: await fetch('/api/auth/delete-account', {...})
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await signOut();
      return { success: true, message: 'Account deleted successfully' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [signOut]);

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated,

    // Core methods
    signIn,
    signUp,
    signOut,
    updateProfile,

    // Enhanced methods
    signInWithRemember,
    updateUserField,
    changePassword,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    deleteAccount,

    // Helper methods
    isAdmin,
    hasPermission,
    getUserInitials,
    getAvatarUrl,
    isUserProfile,
    isSessionValid,
    refreshUserData
  };
};

// Export as default as well for convenience
export default useAuth;