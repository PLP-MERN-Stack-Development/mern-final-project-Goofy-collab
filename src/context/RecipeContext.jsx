import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';




const RecipeContext = createContext(null);

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    cuisine: '',
    difficulty: '',
    maxTime: '',
    sortBy: 'recent'
  });

  // Load saved recipes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedRecipes');
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  }, []);

  // Mock data for demo
  const mockRecipes = [
    {
      id: 1,
      title: "Classic Margherita Pizza",
      description: "Authentic Italian pizza with fresh mozzarella and basil",
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80",
      author: "Chef Mario",
      authorId: 1,
      cookTime: 30,
      prepTime: 20,
      servings: 4,
      rating: 4.8,
      difficulty: "Medium",
      category: "Dinner",
      cuisine: "Italian",
      likes: 1234,
      createdAt: new Date('2024-01-15').toISOString(),
      ingredients: [
        { item: "Pizza dough", amount: "500g", category: "Base" },
        { item: "Tomato sauce", amount: "200ml", category: "Base" },
        { item: "Fresh mozzarella", amount: "250g", category: "Toppings" }
      ],
      instructions: [
        { step: 1, title: "Prepare the dough", description: "Roll out pizza dough...", time: "10 min" }
      ],
      tags: ["Italian", "Pizza", "Vegetarian"]
    },
    {
      id: 2,
      title: "Spicy Thai Basil Chicken",
      description: "Quick and flavorful stir-fry with aromatic Thai basil",
      image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&q=80",
      author: "Chef Somchai",
      authorId: 2,
      cookTime: 20,
      prepTime: 15,
      servings: 3,
      rating: 4.9,
      difficulty: "Easy",
      category: "Dinner",
      cuisine: "Thai",
      likes: 2156,
      createdAt: new Date('2024-02-10').toISOString(),
      tags: ["Thai", "Spicy", "Quick"]
    },
    {
      id: 3,
      title: "Chocolate Lava Cake",
      description: "Decadent dessert with molten chocolate center",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
      author: "Chef Sophie",
      authorId: 3,
      cookTime: 25,
      prepTime: 15,
      servings: 6,
      rating: 4.8,
      difficulty: "Medium",
      category: "Dessert",
      cuisine: "French",
      likes: 945,
      createdAt: new Date('2024-03-05').toISOString(),
      tags: ["Dessert", "Chocolate", "French"]
    }
  ];

  const fetchRecipes = async (filterOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      // In production: const response = await fetch('/api/recipes', {...})
      await new Promise(resolve => setTimeout(resolve, 800));

      // Apply filters to mock data
      let filteredRecipes = [...mockRecipes];

      if (filterOptions.category) {
        filteredRecipes = filteredRecipes.filter(r => r.category === filterOptions.category);
      }
      if (filterOptions.cuisine) {
        filteredRecipes = filteredRecipes.filter(r => r.cuisine === filterOptions.cuisine);
      }
      if (filterOptions.difficulty) {
        filteredRecipes = filteredRecipes.filter(r => r.difficulty === filterOptions.difficulty);
      }
      if (filterOptions.maxTime) {
        filteredRecipes = filteredRecipes.filter(r => r.cookTime <= parseInt(filterOptions.maxTime));
      }

      // Apply sorting
      switch (filterOptions.sortBy) {
        case 'popular':
          filteredRecipes.sort((a, b) => b.likes - a.likes);
          break;
        case 'rating':
          filteredRecipes.sort((a, b) => b.rating - a.rating);
          break;
        case 'time':
          filteredRecipes.sort((a, b) => a.cookTime - b.cookTime);
          break;
        case 'recent':
        default:
          filteredRecipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setRecipes(filteredRecipes);
      return { success: true, recipes: filteredRecipes };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getRecipeById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      // In production: const response = await fetch(`/api/recipes/${id}`, {...})
      await new Promise(resolve => setTimeout(resolve, 500));

      const recipe = mockRecipes.find(r => r.id === parseInt(id));
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }

      return { success: true, recipe };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const createRecipe = async (recipeData) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      // In production: const response = await fetch('/api/recipes', {...})
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newRecipe = {
        ...recipeData,
        id: Date.now(),
        likes: 0,
        rating: 0,
        createdAt: new Date().toISOString()
      };

      setRecipes(prev => [newRecipe, ...prev]);
      return { success: true, recipe: newRecipe };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateRecipe = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      // In production: const response = await fetch(`/api/recipes/${id}`, {...})
      await new Promise(resolve => setTimeout(resolve, 1000));

      setRecipes(prev => prev.map(recipe => 
        recipe.id === id ? { ...recipe, ...updates } : recipe
      ));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      // In production: const response = await fetch(`/api/recipes/${id}`, { method: 'DELETE' })
      await new Promise(resolve => setTimeout(resolve, 500));

      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveRecipe = (recipeId) => {
    setSavedRecipes(prev => {
      const isSaved = prev.includes(recipeId);
      const updated = isSaved 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId];
      
      localStorage.setItem('savedRecipes', JSON.stringify(updated));
      return updated;
    });
  };

  const likeRecipe = async (recipeId) => {
    try {
      // Simulate API call
      // In production: await fetch(`/api/recipes/${recipeId}/like`, {...})
      await new Promise(resolve => setTimeout(resolve, 300));

      setRecipes(prev => prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, likes: recipe.likes + 1 }
          : recipe
      ));

      return { success: true };
    } catch (err) {
      console.error('Like failed:', err);
      return { success: false, error: err.message };
    }
  };

  const searchRecipes = async (query) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      // In production: const response = await fetch(`/api/recipes/search?q=${query}`, {...})
      await new Promise(resolve => setTimeout(resolve, 600));

      const results = mockRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.description.toLowerCase().includes(query.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      setRecipes(results);
      return { success: true, recipes: results };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
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
    isSaved: (recipeId) => savedRecipes.includes(recipeId)
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};

