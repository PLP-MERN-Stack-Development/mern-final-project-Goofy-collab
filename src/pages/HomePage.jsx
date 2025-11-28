import React, { useState, useEffect } from 'react';
import { Search, Clock, Users, Star, ChefHat, TrendingUp, Filter } from 'lucide-react';

// Mock data for demonstration
const mockRecipes = [
  {
    id: 1,
    title: "Classic Margherita Pizza",
    description: "Authentic Italian pizza with fresh mozzarella and basil",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80",
    author: "Chef Mario",
    cookTime: 30,
    servings: 4,
    rating: 4.8,
    difficulty: "Medium",
    category: "Italian"
  },
  {
    id: 2,
    title: "Spicy Thai Basil Chicken",
    description: "Quick and flavorful stir-fry with aromatic Thai basil",
    image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&q=80",
    author: "Chef Somchai",
    cookTime: 20,
    servings: 3,
    rating: 4.9,
    difficulty: "Easy",
    category: "Thai"
  },
  {
    id: 3,
    title: "Creamy Mushroom Risotto",
    description: "Rich and creamy Italian rice dish with porcini mushrooms",
    image: "https://images.unsplash.com/photo-1476124369491-c4f1b0b3c865?w=800&q=80",
    author: "Chef Elena",
    cookTime: 45,
    servings: 4,
    rating: 4.7,
    difficulty: "Hard",
    category: "Italian"
  },
  {
    id: 4,
    title: "Japanese Ramen Bowl",
    description: "Authentic tonkotsu ramen with soft-boiled eggs",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    author: "Chef Takeshi",
    cookTime: 60,
    servings: 2,
    rating: 4.9,
    difficulty: "Hard",
    category: "Japanese"
  },
  {
    id: 5,
    title: "Fresh Greek Salad",
    description: "Light and refreshing Mediterranean salad",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    author: "Chef Dimitri",
    cookTime: 15,
    servings: 4,
    rating: 4.6,
    difficulty: "Easy",
    category: "Greek"
  },
  {
    id: 6,
    title: "Chocolate Lava Cake",
    description: "Decadent dessert with molten chocolate center",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
    author: "Chef Sophie",
    cookTime: 25,
    servings: 6,
    rating: 4.8,
    difficulty: "Medium",
    category: "Dessert"
  }
];

const categories = ["All", "Italian", "Thai", "Japanese", "Greek", "Dessert", "Mexican", "Indian"];
const difficulties = ["All", "Easy", "Medium", "Hard"];

const LandingPage = () => {
  const [recipes, setRecipes] = useState(mockRecipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Filter recipes based on search and filters
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <ChefHat className="w-8 h-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">RecipeShare</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-orange-600 font-semibold">Home</a>
              <a href="#" className="text-gray-700 hover:text-orange-600">Recipes</a>
              <a href="#" className="text-gray-700 hover:text-orange-600">Categories</a>
              <a href="#" className="text-gray-700 hover:text-orange-600">About</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-orange-600 font-medium">
                Sign In
              </button>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
                Share Recipe
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-4">Discover & Share Amazing Recipes</h2>
            <p className="text-xl mb-8 text-orange-100">Join our community of food lovers and explore thousands of delicious recipes</p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for recipes, ingredients, or cuisines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-2xl"
                />
              </div>
              
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="max-w-3xl mx-auto mt-4 bg-white rounded-lg shadow-xl p-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      {difficulties.map(diff => (
                        <option key={diff} value={diff}>{diff}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">10,000+</div>
              <div className="text-gray-600">Recipes Shared</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">5,000+</div>
              <div className="text-gray-600">Active Cooks</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600">Cuisines</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
                Featured Recipes
              </h3>
              <p className="text-gray-600 mt-2">
                {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                    <span className={`text-sm font-semibold ${
                      recipe.difficulty === 'Easy' ? 'text-green-600' :
                      recipe.difficulty === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-orange-600 font-semibold">{recipe.category}</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-semibold text-gray-700">{recipe.rating}</span>
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    by <span className="font-semibold text-gray-700">{recipe.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No recipes found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedDifficulty('All');
                }}
                className="mt-4 text-orange-600 hover:text-orange-700 font-semibold"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="w-6 h-6 text-orange-600" />
                <h4 className="text-xl font-bold">RecipeShare</h4>
              </div>
              <p className="text-gray-400">Share your culinary creations with the world.</p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Explore</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500">Popular Recipes</a></li>
                <li><a href="#" className="hover:text-orange-500">New Recipes</a></li>
                <li><a href="#" className="hover:text-orange-500">Categories</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Community</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500">Join Us</a></li>
                <li><a href="#" className="hover:text-orange-500">Blog</a></li>
                <li><a href="#" className="hover:text-orange-500">Forum</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-500">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-500">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RecipeShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;