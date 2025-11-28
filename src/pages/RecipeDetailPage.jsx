import React, { useState } from 'react';
import { 
  ChefHat, ArrowLeft, Clock, Users, Star, Bookmark, Share2, 
  Heart, MessageCircle, Printer, CheckCircle, Circle 
} from 'lucide-react';

// Mock recipe data
const recipeData = {
  id: 1,
  title: "Classic Margherita Pizza",
  description: "Authentic Italian pizza with fresh mozzarella, tomatoes, and basil. This traditional Neapolitan-style pizza is simple yet absolutely delicious.",
  image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=1200&q=80",
  author: {
    name: "Chef Mario",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&q=80",
    recipesCount: 45
  },
  cookTime: 30,
  prepTime: 20,
  totalTime: 50,
  servings: 4,
  rating: 4.8,
  ratingsCount: 234,
  difficulty: "Medium",
  category: "Italian",
  cuisine: "Italian",
  createdAt: "2024-01-15",
  
  ingredients: [
    { id: 1, item: "Pizza dough", amount: "500g", category: "Base" },
    { id: 2, item: "Tomato sauce", amount: "200ml", category: "Base" },
    { id: 3, item: "Fresh mozzarella", amount: "250g", category: "Toppings" },
    { id: 4, item: "Fresh basil leaves", amount: "20 leaves", category: "Toppings" },
    { id: 5, item: "Extra virgin olive oil", amount: "3 tbsp", category: "Base" },
    { id: 6, item: "Salt", amount: "to taste", category: "Seasoning" },
    { id: 7, item: "Black pepper", amount: "to taste", category: "Seasoning" },
  ],
  
  instructions: [
    {
      step: 1,
      title: "Prepare the dough",
      description: "Preheat your oven to 475°F (245°C). If using a pizza stone, place it in the oven while preheating. Roll out your pizza dough on a floured surface to about 12 inches in diameter.",
      time: "10 min"
    },
    {
      step: 2,
      title: "Add the sauce",
      description: "Spread the tomato sauce evenly over the dough, leaving about 1 inch border around the edges for the crust. Don't overload with sauce - less is more for authentic Neapolitan pizza.",
      time: "2 min"
    },
    {
      step: 3,
      title: "Add cheese and toppings",
      description: "Tear the fresh mozzarella into small pieces and distribute evenly over the sauce. Drizzle with olive oil and season with salt and pepper.",
      time: "3 min"
    },
    {
      step: 4,
      title: "Bake the pizza",
      description: "Transfer the pizza to the preheated oven (on the pizza stone if using). Bake for 12-15 minutes or until the crust is golden and the cheese is bubbling and slightly browned.",
      time: "15 min"
    },
    {
      step: 5,
      title: "Finish and serve",
      description: "Remove from oven and immediately top with fresh basil leaves. Drizzle with a little more olive oil if desired. Let cool for 2-3 minutes, slice, and serve hot.",
      time: "5 min"
    }
  ],
  
  nutritionInfo: {
    calories: 285,
    protein: 12,
    carbs: 35,
    fat: 11,
    fiber: 2
  },
  
  tags: ["Italian", "Pizza", "Vegetarian", "Classic", "Comfort Food"],
  
  comments: [
    {
      id: 1,
      user: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      rating: 5,
      comment: "This recipe is absolutely perfect! Made it for my family and everyone loved it. The crust came out crispy and the flavor was authentic.",
      date: "2024-11-20",
      likes: 12
    },
    {
      id: 2,
      user: "John Smith",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
      rating: 4,
      comment: "Great recipe! I added some garlic to the sauce for extra flavor. Will definitely make again.",
      date: "2024-11-18",
      likes: 8
    },
    {
      id: 3,
      user: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      rating: 5,
      comment: "Best homemade pizza I've ever made. The instructions were clear and easy to follow.",
      date: "2024-11-15",
      likes: 15
    }
  ]
};

const RecipeDetailPage = () => {
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [activeTab, setActiveTab] = useState('instructions'); // instructions, comments, nutrition
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(342);

  const toggleStep = (stepNum) => {
    setCheckedSteps(prev => 
      prev.includes(stepNum) 
        ? prev.filter(s => s !== stepNum)
        : [...prev, stepNum]
    );
  };

  const toggleIngredient = (id) => {
    setCheckedIngredients(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Group ingredients by category
  const groupedIngredients = recipeData.ingredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.category]) {
      acc[ingredient.category] = [];
    }
    acc[ingredient.category].push(ingredient);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-orange-600">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-2">
                <ChefHat className="w-8 h-8 text-orange-600" />
                <h1 className="text-2xl font-bold text-gray-900">RecipeShare</h1>
              </div>
            </div>
            
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

      {/* Hero Image Section */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={recipeData.image}
          alt={recipeData.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Recipe Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-3">
              <span className="bg-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                {recipeData.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                recipeData.difficulty === 'Easy' ? 'bg-green-600' :
                recipeData.difficulty === 'Medium' ? 'bg-yellow-600' :
                'bg-red-600'
              }`}>
                {recipeData.difficulty}
              </span>
            </div>
            <h2 className="text-5xl font-bold mb-2">{recipeData.title}</h2>
            <p className="text-xl text-gray-200">{recipeData.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Meta & Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Total Time</div>
                      <div className="font-semibold">{recipeData.totalTime} min</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Servings</div>
                      <div className="font-semibold">{recipeData.servings} people</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex">{renderStars(recipeData.rating)}</div>
                    <span className="ml-2 font-semibold">{recipeData.rating}</span>
                    <span className="ml-1 text-gray-500 text-sm">({recipeData.ratingsCount})</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                      isLiked 
                        ? 'bg-red-50 text-red-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likesCount}</span>
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2 rounded-lg transition ${
                      isBookmarked 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                    <Printer className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-4 pt-6 border-t">
                <img
                  src={recipeData.author.avatar}
                  alt={recipeData.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900">{recipeData.author.name}</div>
                  <div className="text-sm text-gray-500">{recipeData.author.recipesCount} recipes shared</div>
                </div>
                <button className="ml-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                  Follow
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('instructions')}
                    className={`flex-1 px-6 py-4 font-semibold transition ${
                      activeTab === 'instructions'
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Instructions
                  </button>
                  <button
                    onClick={() => setActiveTab('nutrition')}
                    className={`flex-1 px-6 py-4 font-semibold transition ${
                      activeTab === 'nutrition'
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Nutrition
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`flex-1 px-6 py-4 font-semibold transition ${
                      activeTab === 'comments'
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Comments ({recipeData.comments.length})
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Instructions Tab */}
                {activeTab === 'instructions' && (
                  <div className="space-y-6">
                    {recipeData.instructions.map((instruction) => (
                      <div key={instruction.step} className="flex space-x-4">
                        <button
                          onClick={() => toggleStep(instruction.step)}
                          className="flex-shrink-0 mt-1"
                        >
                          {checkedSteps.includes(instruction.step) ? (
                            <CheckCircle className="w-8 h-8 text-green-600 fill-current" />
                          ) : (
                            <Circle className="w-8 h-8 text-gray-300" />
                          )}
                        </button>
                        <div className={`flex-1 ${checkedSteps.includes(instruction.step) ? 'opacity-50' : ''}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-lg text-gray-900">
                              Step {instruction.step}: {instruction.title}
                            </h4>
                            <span className="text-sm text-gray-500">{instruction.time}</span>
                          </div>
                          <p className="text-gray-700">{instruction.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Nutrition Tab */}
                {activeTab === 'nutrition' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Nutrition Information</h3>
                    <p className="text-gray-600 mb-6">Per serving (based on {recipeData.servings} servings)</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-orange-600">{recipeData.nutritionInfo.calories}</div>
                        <div className="text-sm text-gray-600 mt-1">Calories</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-blue-600">{recipeData.nutritionInfo.protein}g</div>
                        <div className="text-sm text-gray-600 mt-1">Protein</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-yellow-600">{recipeData.nutritionInfo.carbs}g</div>
                        <div className="text-sm text-gray-600 mt-1">Carbs</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-red-600">{recipeData.nutritionInfo.fat}g</div>
                        <div className="text-sm text-gray-600 mt-1">Fat</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-600">{recipeData.nutritionInfo.fiber}g</div>
                        <div className="text-sm text-gray-600 mt-1">Fiber</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments Tab */}
                {activeTab === 'comments' && (
                  <div className="space-y-6">
                    {/* Add Comment Form */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <textarea
                        placeholder="Share your thoughts about this recipe..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        rows="3"
                      />
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600 mr-2">Rate:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} className="text-gray-300 hover:text-yellow-400">
                              <Star className="w-5 h-5" />
                            </button>
                          ))}
                        </div>
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                          Post Comment
                        </button>
                      </div>
                    </div>

                    {/* Comments List */}
                    {recipeData.comments.map((comment) => (
                      <div key={comment.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex space-x-4">
                          <img
                            src={comment.avatar}
                            alt={comment.user}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-semibold text-gray-900">{comment.user}</div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <span>{comment.date}</span>
                                  <span>•</span>
                                  <div className="flex">{renderStars(comment.rating)}</div>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">{comment.comment}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <button className="flex items-center space-x-1 text-gray-500 hover:text-orange-600">
                                <Heart className="w-4 h-4" />
                                <span>{comment.likes}</span>
                              </button>
                              <button className="text-gray-500 hover:text-orange-600">Reply</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Ingredients Card */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-2xl font-bold mb-4">Ingredients</h3>
              
              {Object.entries(groupedIngredients).map(([category, items]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h4 className="font-semibold text-orange-600 mb-3">{category}</h4>
                  <div className="space-y-3">
                    {items.map((ingredient) => (
                      <div key={ingredient.id} className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleIngredient(ingredient.id)}
                          className="flex-shrink-0"
                        >
                          {checkedIngredients.includes(ingredient.id) ? (
                            <CheckCircle className="w-5 h-5 text-green-600 fill-current" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300" />
                          )}
                        </button>
                        <span className={`flex-1 ${
                          checkedIngredients.includes(ingredient.id) 
                            ? 'line-through text-gray-400' 
                            : 'text-gray-700'
                        }`}>
                          {ingredient.item}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                          {ingredient.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button className="w-full mt-6 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold">
                Add to Shopping List
              </button>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipeData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;