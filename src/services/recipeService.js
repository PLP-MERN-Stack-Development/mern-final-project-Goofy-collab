// src/services/recipeService.js

import api, { createAbortController } from './api';

/**
 * Recipe Service
 * Handles all recipe-related API calls
 */

const recipeService = {
  /**
   * Get all recipes with optional filters
   * @param {Object} filters - Filter parameters
   * @param {string} filters.category - Recipe category
   * @param {string} filters.cuisine - Recipe cuisine
   * @param {string} filters.difficulty - Recipe difficulty
   * @param {number} filters.maxTime - Maximum cooking time
   * @param {string} filters.sortBy - Sort order (recent, popular, rating, time)
   * @param {number} filters.page - Page number for pagination
   * @param {number} filters.limit - Items per page
   * @returns {Promise<Object>} Recipes and pagination data
   */
  getRecipes: async (filters = {}) => {
    try {
      const response = await api.get('/recipes', filters);

      return {
        success: true,
        recipes: response.recipes || response.data || [],
        pagination: response.pagination,
        total: response.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        recipes: []
      };
    }
  },

  /**
   * Get single recipe by ID
   * @param {string|number} id - Recipe ID
   * @returns {Promise<Object>} Recipe data
   */
  getRecipeById: async (id) => {
    try {
      const response = await api.get(`/recipes/${id}`);

      return {
        success: true,
        recipe: response.recipe || response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Create new recipe
   * @param {Object} recipeData - Recipe data
   * @returns {Promise<Object>} Created recipe
   */
  createRecipe: async (recipeData) => {
    try {
      const response = await api.post('/recipes', recipeData);

      return {
        success: true,
        recipe: response.recipe || response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Update existing recipe
   * @param {string|number} id - Recipe ID
   * @param {Object} updates - Recipe updates
   * @returns {Promise<Object>} Updated recipe
   */
  updateRecipe: async (id, updates) => {
    try {
      const response = await api.put(`/recipes/${id}`, updates);

      return {
        success: true,
        recipe: response.recipe || response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Delete recipe
   * @param {string|number} id - Recipe ID
   * @returns {Promise<Object>} Success status
   */
  deleteRecipe: async (id) => {
    try {
      await api.delete(`/recipes/${id}`);

      return {
        success: true,
        message: 'Recipe deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Upload recipe image
   * @param {string|number} id - Recipe ID
   * @param {File} file - Image file
   * @returns {Promise<Object>} Image URL
   */
  uploadRecipeImage: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.upload(`/recipes/${id}/image`, formData);

      return {
        success: true,
        imageUrl: response.imageUrl || response.url
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Search recipes by query
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  searchRecipes: async (query, options = {}) => {
    try {
      const response = await api.get('/recipes/search', {
        q: query,
        ...options
      });

      return {
        success: true,
        recipes: response.recipes || response.results || [],
        total: response.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        recipes: []
      };
    }
  },

  /**
   * Advanced search with multiple criteria
   * @param {Object} criteria - Search criteria
   * @param {string} criteria.query - Text query
   * @param {Array<string>} criteria.ingredients - Required ingredients
   * @param {Array<string>} criteria.excludeIngredients - Ingredients to exclude
   * @param {Array<string>} criteria.tags - Required tags
   * @returns {Promise<Object>} Search results
   */
  advancedSearch: async (criteria) => {
    try {
      const response = await api.post('/recipes/advanced-search', criteria);

      return {
        success: true,
        recipes: response.recipes || response.results || [],
        total: response.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        recipes: []
      };
    }
  },

  /**
   * Like a recipe
   * @param {string|number} id - Recipe ID
   * @returns {Promise<Object>} Updated like count
   */
  likeRecipe: async (id) => {
    try {
      const response = await api.post(`/recipes/${id}/like`);

      return {
        success: true,
        likes: response.likes,
        isLiked: response.isLiked
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Unlike a recipe
   * @param {string|number} id - Recipe ID
   * @returns {Promise<Object>} Updated like count
   */
  unlikeRecipe: async (id) => {
    try {
      const response = await api.delete(`/recipes/${id}/like`);

      return {
        success: true,
        likes: response.likes,
        isLiked: response.isLiked
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Save recipe to user's collection
   * @param {string|number} id - Recipe ID
   * @returns {Promise<Object>} Success status
   */
  saveRecipe: async (id) => {
    try {
      const response = await api.post(`/recipes/${id}/save`);

      return {
        success: true,
        isSaved: true,
        message: 'Recipe saved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Remove recipe from user's collection
   * @param {string|number} id - Recipe ID
   * @returns {Promise<Object>} Success status
   */
  unsaveRecipe: async (id) => {
    try {
      await api.delete(`/recipes/${id}/save`);

      return {
        success: true,
        isSaved: false,
        message: 'Recipe removed from saved'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Get user's saved recipes
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Saved recipes
   */
  getSavedRecipes: async (options = {}) => {
    try {
      const response = await api.get('/recipes/saved', options);

      return {
        success: true,
        recipes: response.recipes || response.data || [],
        total: response.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        recipes: []
      };
    }
  },

  /**
   * Rate a recipe
   * @param {string|number} id - Recipe ID
   * @param {number} rating - Rating value (1-5)
   * @returns {Promise<Object>} Updated rating
   */
  rateRecipe: async (id, rating) => {
    try {
      const response = await api.post(`/recipes/${id}/rate`, { rating });

      return {
        success: true,
        rating: response.rating,
        averageRating: response.averageRating
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Add comment to recipe
   * @param {string|number} id - Recipe ID
   * @param {Object} commentData - Comment data
   * @param {string} commentData.text - Comment text
   * @param {number} commentData.rating - Optional rating
   * @returns {Promise<Object>} Created comment
   */
  addComment: async (id, commentData) => {
    try {
      const response = await api.post(`/recipes/${id}/comments`, commentData);

      return {
        success: true,
        comment: response.comment || response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Get recipe comments
   * @param {string|number} id - Recipe ID
   * @param {Object} options - Query options (page, limit, sortBy)
   * @returns {Promise<Object>} Comments
   */
  getComments: async (id, options = {}) => {
    try {
      const response = await api.get(`/recipes/${id}/comments`, options);

      return {
        success: true,
        comments: response.comments || response.data || [],
        total: response.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        comments: []
      };
    }
  },

  /**
   * Update comment
   * @param {string|number} recipeId - Recipe ID
   * @param {string|number} commentId - Comment ID
   * @param {Object} updates - Comment updates
   * @returns {Promise<Object>} Updated comment
   */
  updateComment: async (recipeId, commentId, updates) => {
    try {
      const response = await api.put(`/recipes/${recipeId}/comments/${commentId}`, updates);

      return {
        success: true,
        comment: response.comment || response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Delete comment
   * @param {string|number} recipeId - Recipe ID
   * @param {string|number} commentId - Comment ID
   * @returns {Promise<Object>} Success status
   */
  deleteComment: async (recipeId, commentId) => {
    try {
      await api.delete(`/recipes/${recipeId}/comments/${commentId}`);

      return {
        success: true,
        message: 'Comment deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Report recipe
   * @param {string|number} id - Recipe ID
   * @param {Object} reportData - Report data
   * @param {string} reportData.reason - Report reason
   * @param {string} reportData.description - Detailed description
   * @returns {Promise<Object>} Success status
   */
  reportRecipe: async (id, reportData) => {
    try {
      await api.post(`/recipes/${id}/report`, reportData);

      return {
        success: true,
        message: 'Recipe reported successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Get recipes by user
   * @param {string|number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} User's recipes
   */
  getUserRecipes: async (userId, options = {}) => {
    try {
      const response = await api.get(`/users/${userId}/recipes`, options);

      return {
        success: true,
        recipes: response.recipes || response.data || [],
        total: response.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        recipes: []
      };
    }
  },

  /**
   * Get recipe categories
   * @returns {Promise<Object>} List of categories
   */
  getCategories: async () => {
    try {
      const response = await api.get('/recipes/categories');

      return {
        success: true,
        categories: response.categories || response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        categories: []
      };
    }
  },

  /**
   * Get recipe cuisines
   * @returns {Promise<Object>} List of cuisines
   */
  getCuisines: async () => {
    try {
      const response = await api.get('/recipes/cuisines');

      return {
        success: true,
        cuisines: response.cuisines || response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        cuisines: []
      };
    }
  },

  /**
   * Get popular recipes
   * @param {number} limit - Number of recipes to return
   * @returns {Promise<Object>} Popular recipes
   */
  getPopularRecipes: async (limit = 10) => {
    try {
      const response = await api.get('/recipes/popular', { limit });

      return {
        success: true,
        recipes: response.recipes || response.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        recipes: []
      };
    }
  },

  /**
   * Get trending recipes
   * @param {number} limit - Number of recipes to return
   * @returns {Promise<Object>} Trending recipes
   */
  getTrendingRecipes: async (limit = 10) => {
    try {
      const response = await api.get('/recipes/trending', { limit });

      return {
        success: true,
        recipes: response.recipes || response.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        recipes: []
      };
    }
  },

  /**
   * Get recipe recommendations for user
   * @param {number} limit - Number of recommendations
   * @returns {Promise<Object>} Recommended recipes
   */
  getRecommendations: async (limit = 10) => {
    try {
      const response = await api.get('/recipes/recommendations', { limit });

      return {
        success: true,
        recipes: response.recipes || response.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        recipes: []
      };
    }
  },

  /**
   * Get similar recipes
   * @param {string|number} id - Recipe ID
   * @param {number} limit - Number of similar recipes
   * @returns {Promise<Object>} Similar recipes
   */
  getSimilarRecipes: async (id, limit = 5) => {
    try {
      const response = await api.get(`/recipes/${id}/similar`, { limit });

      return {
        success: true,
        recipes: response.recipes || response.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        recipes: []
      };
    }
  },

  /**
   * Get recipe statistics
   * @param {string|number} id - Recipe ID
   * @returns {Promise<Object>} Recipe statistics
   */
  getRecipeStats: async (id) => {
    try {
      const response = await api.get(`/recipes/${id}/stats`);

      return {
        success: true,
        stats: response.stats || response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Duplicate recipe (create copy)
   * @param {string|number} id - Recipe ID to duplicate
   * @returns {Promise<Object>} New recipe
   */
  duplicateRecipe: async (id) => {
    try {
      const response = await api.post(`/recipes/${id}/duplicate`);

      return {
        success: true,
        recipe: response.recipe || response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Export recipe as PDF
   * @param {string|number} id - Recipe ID
   * @returns {Promise<Object>} PDF download URL
   */
  exportRecipePDF: async (id) => {
    try {
      const response = await api.get(`/recipes/${id}/export/pdf`);

      return {
        success: true,
        url: response.url
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default recipeService;