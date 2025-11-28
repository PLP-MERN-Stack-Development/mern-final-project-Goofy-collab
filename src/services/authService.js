// src/services/authService.js

import api, { setAuthToken, removeAuthToken } from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

const authService = {
  /**
   * Sign in user
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} User data and token
   */
  signIn: async (credentials) => {
    try {
      const response = await api.post('/auth/signin', credentials, {
        includeAuth: false // Don't include auth token for login
      });

      // Store token and user data
      if (response.token) {
        setAuthToken(response.token);
      }
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return {
        success: true,
        user: response.user,
        token: response.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Sign up new user
   * @param {Object} userData - New user data
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @returns {Promise<Object>} User data and token
   */
  signUp: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData, {
        includeAuth: false
      });

      // Store token and user data
      if (response.token) {
        setAuthToken(response.token);
      }
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return {
        success: true,
        user: response.user,
        token: response.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Sign out current user
   * @returns {Promise<Object>} Success status
   */
  signOut: async () => {
    try {
      await api.post('/auth/signout');
      
      // Clear local storage
      removeAuthToken();
      
      return {
        success: true
      };
    } catch (error) {
      // Even if API call fails, clear local data
      removeAuthToken();
      
      return {
        success: true // Return success anyway since we cleared local data
      };
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      
      // Update stored user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return {
        success: true,
        user: response.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (updates) => {
    try {
      const response = await api.patch('/auth/profile', updates);
      
      // Update stored user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return {
        success: true,
        user: response.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Upload user avatar
   * @param {File} file - Avatar image file
   * @returns {Promise<Object>} Updated user data with new avatar URL
   */
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.upload('/auth/avatar', formData);

      // Update stored user data
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...storedUser, avatar: response.avatarUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return {
        success: true,
        avatarUrl: response.avatarUrl,
        user: updatedUser
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Success status
   */
  changePassword: async (passwordData) => {
    try {
      await api.post('/auth/change-password', passwordData);

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Request password reset email
   * @param {string} email - User email
   * @returns {Promise<Object>} Success status
   */
  forgotPassword: async (email) => {
    try {
      await api.post('/auth/forgot-password', { email }, {
        includeAuth: false
      });

      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Reset password with token
   * @param {Object} resetData - Reset data
   * @param {string} resetData.token - Reset token from email
   * @param {string} resetData.password - New password
   * @returns {Promise<Object>} Success status
   */
  resetPassword: async (resetData) => {
    try {
      await api.post('/auth/reset-password', resetData, {
        includeAuth: false
      });

      return {
        success: true,
        message: 'Password reset successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Verify email with token
   * @param {string} token - Verification token from email
   * @returns {Promise<Object>} Success status
   */
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verify-email', { token }, {
        includeAuth: false
      });

      // Update user's email verification status
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...storedUser, emailVerified: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return {
        success: true,
        message: 'Email verified successfully',
        user: updatedUser
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Resend verification email
   * @returns {Promise<Object>} Success status
   */
  resendVerificationEmail: async () => {
    try {
      await api.post('/auth/resend-verification');

      return {
        success: true,
        message: 'Verification email sent'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} New token
   */
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh-token');

      if (response.token) {
        setAuthToken(response.token);
      }

      return {
        success: true,
        token: response.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Delete user account
   * @param {Object} confirmData - Confirmation data
   * @param {string} confirmData.password - User password for confirmation
   * @returns {Promise<Object>} Success status
   */
  deleteAccount: async (confirmData) => {
    try {
      await api.delete('/auth/account', {
        body: confirmData
      });

      // Clear all local data
      removeAuthToken();

      return {
        success: true,
        message: 'Account deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Check if email is available
   * @param {string} email - Email to check
   * @returns {Promise<Object>} Availability status
   */
  checkEmailAvailability: async (email) => {
    try {
      const response = await api.get('/auth/check-email', { email }, {
        includeAuth: false
      });

      return {
        success: true,
        available: response.available
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * OAuth sign in with provider
   * @param {string} provider - OAuth provider (google, facebook, etc.)
   * @param {string} accessToken - Access token from provider
   * @returns {Promise<Object>} User data and token
   */
  oauthSignIn: async (provider, accessToken) => {
    try {
      const response = await api.post(`/auth/oauth/${provider}`, {
        accessToken
      }, {
        includeAuth: false
      });

      // Store token and user data
      if (response.token) {
        setAuthToken(response.token);
      }
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return {
        success: true,
        user: response.user,
        token: response.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Get user's sessions (logged in devices)
   * @returns {Promise<Object>} List of active sessions
   */
  getSessions: async () => {
    try {
      const response = await api.get('/auth/sessions');

      return {
        success: true,
        sessions: response.sessions
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Revoke a specific session
   * @param {string} sessionId - Session ID to revoke
   * @returns {Promise<Object>} Success status
   */
  revokeSession: async (sessionId) => {
    try {
      await api.delete(`/auth/sessions/${sessionId}`);

      return {
        success: true,
        message: 'Session revoked successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Revoke all other sessions (keep current)
   * @returns {Promise<Object>} Success status
   */
  revokeAllOtherSessions: async () => {
    try {
      await api.post('/auth/sessions/revoke-all');

      return {
        success: true,
        message: 'All other sessions revoked'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Enable two-factor authentication
   * @returns {Promise<Object>} QR code and secret
   */
  enableTwoFactor: async () => {
    try {
      const response = await api.post('/auth/2fa/enable');

      return {
        success: true,
        qrCode: response.qrCode,
        secret: response.secret
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Verify and confirm two-factor authentication
   * @param {string} code - 6-digit code from authenticator app
   * @returns {Promise<Object>} Success status
   */
  verifyTwoFactor: async (code) => {
    try {
      await api.post('/auth/2fa/verify', { code });

      return {
        success: true,
        message: 'Two-factor authentication enabled'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Disable two-factor authentication
   * @param {string} password - User password for confirmation
   * @returns {Promise<Object>} Success status
   */
  disableTwoFactor: async (password) => {
    try {
      await api.post('/auth/2fa/disable', { password });

      return {
        success: true,
        message: 'Two-factor authentication disabled'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default authService;