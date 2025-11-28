import React, { useState } from 'react';
import { Clock, Users, Star, Heart, Bookmark, Filter, X, ChefHat } from 'lucide-react';


export const RecipeCard = ({ 
  recipe,
  onLike,
  onSave,
  onClick,
  showAuthor = true,
  compact = false
}) => {
  const [isLiked, setIsLiked] = useState(recipe.isLiked || false);
  const [isSaved, setIsSaved] = useState(recipe.isSaved || false);
  const [likesCount, setLikesCount] = useState(recipe.likes || 0);

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    if (onLike) onLike(recipe.id, !isLiked);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (onSave) onSave(recipe.id, !isSaved);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700'
  };

  return (
    <div 
      onClick={() => onClick && onClick(recipe)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        
        {/* Difficulty Badge */}
        {recipe.difficulty && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold ${difficultyColors[recipe.difficulty]}`}>
            {recipe.difficulty}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-sm transition ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleSave}
            className={`p-2 rounded-full backdrop-blur-sm transition ${
              isSaved 
                ? 'bg-orange-500 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-orange-600 font-semibold">
            {recipe.category}
          </span>
          {recipe.rating && (
            <div className="flex items-center space-x-1">
              <div className="flex">{renderStars(recipe.rating)}</div>
              <span className="text-sm font-semibold text-gray-700 ml-1">
                {recipe.rating}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {recipe.title}
        </h3>

        {/* Description */}
        {!compact && recipe.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
          <div className="flex items-center space-x-4">
            {recipe.cookTime && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{recipe.cookTime} min</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{recipe.servings}</span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Heart className="w-4 h-4 mr-1 text-red-500" />
            <span className="font-medium">{likesCount}</span>
          </div>
        </div>

        {/* Author */}
        {showAuthor && recipe.author && (
          <div className="mt-3 text-sm text-gray-500">
            by <span className="font-semibold text-gray-700">{recipe.author}</span>
          </div>
        )}
      </div>
    </div>
  );
};
