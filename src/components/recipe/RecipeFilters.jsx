import React, { useState } from 'react';
import { Clock, Users, Star, Heart, Bookmark, Filter, X, ChefHat } from 'lucide-react';



export const RecipeFilters = ({ 
  onFilterChange,
  initialFilters = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    cuisine: initialFilters.cuisine || '',
    difficulty: initialFilters.difficulty || '',
    maxTime: initialFilters.maxTime || '',
    sortBy: initialFilters.sortBy || 'recent'
  });

  const categories = [
    'All',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Snack',
    'Appetizer',
    'Beverage'
  ];

  const cuisines = [
    'All',
    'Italian',
    'Chinese',
    'Mexican',
    'Japanese',
    'Thai',
    'Indian',
    'French',
    'American',
    'Greek'
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'time', label: 'Quickest First' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const resetFilters = {
      category: '',
      cuisine: '',
      difficulty: '',
      maxTime: '',
      sortBy: 'recent'
    };
    setFilters(resetFilters);
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'recent').length;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 font-semibold"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <div className="flex items-center space-x-3">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-orange-600"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isOpen && (
        <div className="mt-6 space-y-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange('category', cat === 'All' ? '' : cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    (filters.category === cat || (cat === 'All' && !filters.category))
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cuisine
            </label>
            <select
              value={filters.cuisine}
              onChange={(e) => handleFilterChange('cuisine', e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              {cuisines.map(cui => (
                <option key={cui} value={cui === 'All' ? '' : cui}>
                  {cui}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty
              </label>
              <div className="flex space-x-2">
                {difficulties.map(diff => (
                  <button
                    key={diff}
                    onClick={() => handleFilterChange('difficulty', diff === 'All' ? '' : diff)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      (filters.difficulty === diff || (diff === 'All' && !filters.difficulty))
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Time (minutes)
              </label>
              <input
                type="number"
                value={filters.maxTime}
                onChange={(e) => handleFilterChange('maxTime', e.target.value)}
                placeholder="e.g., 30"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// DEMO COMPONENT
// ============================================
// const RecipeComponentsDemo = () => {
//   const [recipes, setRecipes] = useState([
//     {
//       id: 1,
//       title: "Classic Margherita Pizza",
//       description: "Authentic Italian pizza with fresh mozzarella and basil",
//       image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80",
//       author: "Chef Mario",
//       cookTime: 30,
//       servings: 4,
//       rating: 4.8,
//       difficulty: "Medium",
//       category: "Italian",
//       likes: 1234,
//       isLiked: false,
//       isSaved: false
//     },
//     {
//       id: 2,
//       title: "Spicy Thai Basil Chicken",
//       description: "Quick and flavorful stir-fry with aromatic Thai basil",
//       image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&q=80",
//       author: "Chef Somchai",
//       cookTime: 20,
//       servings: 3,
//       rating: 4.9,
//       difficulty: "Easy",
//       category: "Thai",
//       likes: 2156,
//       isLiked: true,
//       isSaved: false
//     },
//     {
//       id: 3,
//       title: "Creamy Mushroom Risotto",
//       description: "Rich and creamy Italian rice dish with porcini mushrooms",
//       image: "https://images.unsplash.com/photo-1476124369491-c4f1b0b3c865?w=800&q=80",
//       author: "Chef Elena",
//       cookTime: 45,
//       servings: 4,
//       rating: 4.7,
//       difficulty: "Hard",
//       category: "Italian",
//       likes: 945,
//       isLiked: false,
//       isSaved: true
//     }
//   ]);

//   const [filters, setFilters] = useState({});

//   const handleRecipeClick = (recipe) => {
//     console.log('Recipe clicked:', recipe);
//     alert(`Clicked: ${recipe.title}`);
//   };

//   const handleLike = (recipeId, isLiked) => {
//     console.log('Like toggled:', recipeId, isLiked);
//   };

//   const handleSave = (recipeId, isSaved) => {
//     console.log('Save toggled:', recipeId, isSaved);
//   };

//   const handleFilterChange = (newFilters) => {
//     console.log('Filters changed:', newFilters);
//     setFilters(newFilters);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex items-center space-x-2">
//             <ChefHat className="w-8 h-8 text-orange-600" />
//             <h1 className="text-3xl font-bold text-gray-900">Recipe Components Demo</h1>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Filters */}
//         <RecipeFilters
//           initialFilters={filters}
//           onFilterChange={handleFilterChange}
//         />

//         {/* Recipe List */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">
//             Featured Recipes ({recipes.length})
//           </h2>
//           <RecipeList
//             recipes={recipes}
//             onRecipeClick={handleRecipeClick}
//             onLike={handleLike}
//             onSave={handleSave}
//             gridCols={3}
//           />
//         </div>

//         {/* Individual Recipe Card Examples */}
//         <div className="space-y-8">
//           <h2 className="text-2xl font-bold text-gray-900">Individual Recipe Cards</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="text-lg font-semibold mb-3">Standard Card</h3>
//               <RecipeCard
//                 recipe={recipes[0]}
//                 onClick={handleRecipeClick}
//                 onLike={handleLike}
//                 onSave={handleSave}
//               />
//             </div>
            
//             <div>
//               <h3 className="text-lg font-semibold mb-3">Compact Card (No Author)</h3>
//               <RecipeCard
//                 recipe={recipes[1]}
//                 onClick={handleRecipeClick}
//                 onLike={handleLike}
//                 onSave={handleSave}
//                 showAuthor={false}
//                 compact={true}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecipeComponentsDemo;