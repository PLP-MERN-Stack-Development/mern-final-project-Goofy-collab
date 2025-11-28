// src/hooks/useRecipes.js
import { useContext, useCallback, useMemo } from 'react';
import { RecipeContext } from '../context/RecipeContext';

/**
 * Custom hook for recipe management
 * Provides easy access to recipe state and methods
 * 
 * @returns {Object} Recipe state and methods
 */
export const useRecipes = () => {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }

  const {
    recipes,
    savedRecipes,
    loading,
    error,
    filters,
    setFilters,
    fetchRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    toggleSaveRecipe,
    likeRecipe,
    searchRecipes,
    isSaved
  } = context;

  // ============================================
  // COMPUTED VALUES
  // ============================================

  // Get total recipe count
  const totalRecipes = useMemo(() => recipes.length, [recipes]);

  // Get saved recipe count
  const savedRecipesCount = useMemo(() => savedRecipes.length, [savedRecipes]);

  // Get recipes by category
  const getRecipesByCategory = useCallback((category) => {
    return recipes.filter(recipe => recipe.category === category);
  }, [recipes]);

  // Get recipes by cuisine
  const getRecipesByCuisine = useCallback((cuisine) => {
    return recipes.filter(recipe => recipe.cuisine === cuisine);
  }, [recipes]);

  // Get recipes by difficulty
  const getRecipesByDifficulty = useCallback((difficulty) => {
    return recipes.filter(recipe => recipe.difficulty === difficulty);
  }, [recipes]);

  // Get popular recipes (by likes)
  const getPopularRecipes = useCallback((limit = 10) => {
    return [...recipes]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit);
  }, [recipes]);

  // Get recent recipes
  const getRecentRecipes = useCallback((limit = 10) => {
    return [...recipes]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }, [recipes]);

  // Get top-rated recipes
  const getTopRatedRecipes = useCallback((limit = 10) => {
    return [...recipes]
      .filter(recipe => recipe.rating)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }, [recipes]);

  // Get quick recipes (under 30 minutes)
  const getQuickRecipes = useCallback((maxTime = 30) => {
    return recipes.filter(recipe => recipe.cookTime <= maxTime);
  }, [recipes]);

  // Get saved recipe objects (not just IDs)
  const getSavedRecipeObjects = useCallback(() => {
    return recipes.filter(recipe => savedRecipes.includes(recipe.id));
  }, [recipes, savedRecipes]);

  // ============================================
  // FILTER HELPERS
  // ============================================

  // Apply single filter
  const applyFilter = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    return fetchRecipes(newFilters);
  }, [filters, setFilters, fetchRecipes]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const resetFilters = {
      category: '',
      cuisine: '',
      difficulty: '',
      maxTime: '',
      sortBy: 'recent'
    };
    setFilters(resetFilters);
    return fetchRecipes(resetFilters);
  }, [setFilters, fetchRecipes]);

  // Clear single filter
  const clearFilter = useCallback((key) => {
    const newFilters = { ...filters, [key]: '' };
    setFilters(newFilters);
    return fetchRecipes(newFilters);
  }, [filters, setFilters, fetchRecipes]);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value && value !== 'recent');
  }, [filters]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(value => value && value !== 'recent').length;
  }, [filters]);

  // ============================================
  // RECIPE ACTIONS
  // ============================================

  // Toggle like on recipe
  const toggleLike = useCallback(async (recipeId) => {
    return await likeRecipe(recipeId);
  }, [likeRecipe]);

  // Share recipe (generate share URL)
  const shareRecipe = useCallback((recipeId) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/recipes/${recipeId}`;
    
    if (navigator.share) {
      // Use native share if available
      return navigator.share({
        title: 'Check out this recipe!',
        url: shareUrl
      }).then(() => ({ success: true }))
        .catch(err => ({ success: false, error: err.message }));
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareUrl);
      return Promise.resolve({ success: true, url: shareUrl });
    }
  }, []);

  // Rate recipe
  const rateRecipe = useCallback(async (recipeId, rating) => {
    try {
      // Simulate API call
      // In production: await fetch(`/api/recipes/${recipeId}/rate`, {...})
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (rating < 1 || rating > 5) {
        return { success: false, error: 'Rating must be between 1 and 5' };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Add comment to recipe
  const addComment = useCallback(async (recipeId, comment) => {
    try {
      // Simulate API call
      // In production: await fetch(`/api/recipes/${recipeId}/comments`, {...})
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!comment.trim()) {
        return { success: false, error: 'Comment cannot be empty' };
      }

      return { success: true, comment: { id: Date.now(), text: comment, createdAt: new Date() } };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Report recipe
  const reportRecipe = useCallback(async (recipeId, reason) => {
    try {
      // Simulate API call
      // In production: await fetch(`/api/recipes/${recipeId}/report`, {...})
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, message: 'Recipe reported successfully' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // ============================================
  // RECIPE VALIDATION
  // ============================================

  // Validate recipe data before submission
  const validateRecipe = useCallback((recipeData) => {
    const errors = {};

    if (!recipeData.title?.trim()) {
      errors.title = 'Title is required';
    }

    if (!recipeData.description?.trim()) {
      errors.description = 'Description is required';
    }

    if (!recipeData.category) {
      errors.category = 'Category is required';
    }

    if (!recipeData.cuisine) {
      errors.cuisine = 'Cuisine is required';
    }

    if (!recipeData.cookTime || recipeData.cookTime <= 0) {
      errors.cookTime = 'Cook time must be greater than 0';
    }

    if (!recipeData.servings || recipeData.servings <= 0) {
      errors.servings = 'Servings must be greater than 0';
    }

    if (!recipeData.ingredients || recipeData.ingredients.length === 0) {
      errors.ingredients = 'At least one ingredient is required';
    }

    if (!recipeData.instructions || recipeData.instructions.length === 0) {
      errors.instructions = 'At least one instruction step is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  // ============================================
  // RECIPE SEARCH & FILTER
  // ============================================

  // Search with debounce helper
  const searchWithDebounce = useCallback((query, delay = 500) => {
    let timeoutId;
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const result = await searchRecipes(query);
        resolve(result);
      }, delay);
    });
  }, [searchRecipes]);

  // Advanced search with multiple criteria
  const advancedSearch = useCallback(async (criteria) => {
    try {
      // Simulate API call with advanced search
      // In production: await fetch('/api/recipes/advanced-search', {...})
      await new Promise(resolve => setTimeout(resolve, 600));

      let results = [...recipes];

      if (criteria.query) {
        results = results.filter(recipe =>
          recipe.title.toLowerCase().includes(criteria.query.toLowerCase()) ||
          recipe.description.toLowerCase().includes(criteria.query.toLowerCase())
        );
      }

      if (criteria.ingredients) {
        results = results.filter(recipe =>
          criteria.ingredients.every(ing =>
            recipe.ingredients?.some(recipeIng =>
              recipeIng.item.toLowerCase().includes(ing.toLowerCase())
            )
          )
        );
      }

      if (criteria.excludeIngredients) {
        results = results.filter(recipe =>
          !criteria.excludeIngredients.some(ing =>
            recipe.ingredients?.some(recipeIng =>
              recipeIng.item.toLowerCase().includes(ing.toLowerCase())
            )
          )
        );
      }

      if (criteria.tags) {
        results = results.filter(recipe =>
          criteria.tags.every(tag =>
            recipe.tags?.some(recipeTag =>
              recipeTag.toLowerCase() === tag.toLowerCase()
            )
          )
        );
      }

      return { success: true, recipes: results };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [recipes]);

  // Get recipe suggestions based on ingredients
  const getRecipeSuggestions = useCallback((ingredients) => {
    return recipes.filter(recipe =>
      recipe.ingredients?.some(recipeIng =>
        ingredients.some(ing =>
          recipeIng.item.toLowerCase().includes(ing.toLowerCase())
        )
      )
    );
  }, [recipes]);

  // ============================================
  // STATS & ANALYTICS
  // ============================================

  // Get recipe statistics
  const getRecipeStats = useMemo(() => ({
    total: totalRecipes,
    saved: savedRecipesCount,
    categories: [...new Set(recipes.map(r => r.category))].length,
    cuisines: [...new Set(recipes.map(r => r.cuisine))].length,
    averageRating: recipes.reduce((acc, r) => acc + (r.rating || 0), 0) / recipes.length || 0,
    totalLikes: recipes.reduce((acc, r) => acc + (r.likes || 0), 0)
  }), [recipes, totalRecipes, savedRecipesCount]);

  // Get user recipe stats (if applicable)
  const getUserRecipeStats = useCallback((userId) => {
    const userRecipes = recipes.filter(r => r.authorId === userId);
    return {
      total: userRecipes.length,
      totalLikes: userRecipes.reduce((acc, r) => acc + (r.likes || 0), 0),
      averageRating: userRecipes.reduce((acc, r) => acc + (r.rating || 0), 0) / userRecipes.length || 0,
      categories: [...new Set(userRecipes.map(r => r.category))]
    };
  }, [recipes]);

  return {
    // State
    recipes,
    savedRecipes,
    loading,
    error,
    filters,
    
    // Computed values
    totalRecipes,
    savedRecipesCount,
    hasActiveFilters,
    activeFilterCount,
    
    // Core methods
    fetchRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    
    // Recipe queries
    getRecipesByCategory,
    getRecipesByCuisine,
    getRecipesByDifficulty,
    getPopularRecipes,
    getRecentRecipes,
    getTopRatedRecipes,
    getQuickRecipes,
    getSavedRecipeObjects,
    
    // Filter methods
    applyFilter,
    clearFilters,
    clearFilter,
    setFilters,
    
    // Recipe actions
    toggleSaveRecipe,
    toggleLike,
    isSaved,
    shareRecipe,
    rateRecipe,
    addComment,
    reportRecipe,
    
    // Validation
    validateRecipe,
    
    // Advanced search
    searchWithDebounce,
    advancedSearch,
    getRecipeSuggestions,
    
    // Stats
    getRecipeStats,
    getUserRecipeStats
  };
};

// Export as default as well for convenience
export default useRecipes;