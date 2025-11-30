// src/services/userService.js

import api from './api';

const userService = {
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return { success: true, user: response.user || response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getUserStats: async (id) => {
    try {
      const response = await api.get(`/users/${id}/stats`);
      return { success: true, stats: response.stats || response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getFollowers: async (id, options = {}) => {
    try {
      const response = await api.get(`/users/${id}/followers`, options);
      return { success: true, followers: response.followers || response.data || [] };
    } catch (error) {
      return { success: false, error: error.message, followers: [] };
    }
  },

  getFollowing: async (id, options = {}) => {
    try {
      const response = await api.get(`/users/${id}/following`, options);
      return { success: true, following: response.following || response.data || [] };
    } catch (error) {
      return { success: false, error: error.message, following: [] };
    }
  }
};

export default userService;
