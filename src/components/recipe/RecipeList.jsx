import React, { useState } from 'react';
import { Clock, Users, Star, Heart, Bookmark, Filter, X, ChefHat } from 'lucide-react';


export const RecipeList = ({ 
  recipes,
  loading = false,
  onRecipeClick,
  onLike,
  onSave,
  gridCols = 3,
  emptyMessage = "No recipes found"
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridClasses[gridCols]} gap-6`}>
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={onRecipeClick}
          onLike={onLike}
          onSave={onSave}
        />
      ))}
    </div>
  );
};
