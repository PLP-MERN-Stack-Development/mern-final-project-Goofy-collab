import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import { 
  ChefHat, ArrowLeft, Clock, Users, Star, Bookmark, Share2, 
  Heart, MessageCircle, Printer, CheckCircle, Circle 
} from 'lucide-react';

// Recipe will be loaded from the RecipeContext using the route param :id

const RecipeDetailPage = () => {
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [activeTab, setActiveTab] = useState('instructions'); // instructions, comments, nutrition
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(342);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecipeById, recipes } = useRecipes();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!id || id === 'undefined') {
          // If no valid id was provided, redirect to recipes list
          navigate('/recipes');
          return;
        }
        const result = await getRecipeById(id);
        if (!mounted) return;
        if (result.success && result.recipe) {
          setRecipe(result.recipe);
          setLikesCount(result.recipe.likesCount ?? (Array.isArray(result.recipe.likes) ? result.recipe.likes.length : 0));
          setIsLiked(result.recipe.isLiked ?? false);
        } else {
          // If the API didn't return a recipe, try a local in-memory fallback (useful immediately after creating)
          const fallback = recipes?.find(r => (r._id ?? r.id)?.toString() === id?.toString());
          if (fallback) {
            setRecipe(fallback);
            setLikesCount(fallback.likesCount ?? (Array.isArray(fallback.likes) ? fallback.likes.length : 0));
            setIsLiked(fallback.isLiked ?? false);
          } else {
            // Last resort: check localStorage for a recently-created recipe (persisted by Create page)
            try {
              const stored = JSON.parse(localStorage.getItem('recentlyCreatedRecipes') || '[]');
              const ls = stored.find(r => r.id === id || (r.recipe?._id ?? r.recipe?.id)?.toString() === id?.toString());
              if (ls) {
                setRecipe(ls.recipe);
                setLikesCount(ls.recipe.likesCount ?? (Array.isArray(ls.recipe.likes) ? ls.recipe.likes.length : 0));
                setIsLiked(ls.recipe.isLiked ?? false);
                return;
              }
            } catch (e) {
              // ignore
            }

            setError(result.error || 'Recipe not found');
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, [id, getRecipeById]);

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
  const groupedIngredients = (recipe?.ingredients || []).reduce((acc, ingredient) => {
    if (!acc[ingredient.category]) {
      acc[ingredient.category] = [];
    }
    acc[ingredient.category].push(ingredient);
    return acc;
  }, {});

  // Loading / error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">{error}</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">Recipe not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-md sticky top-0 z-50">
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
      </header> */}

      {/* Hero Image Section */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={recipe?.image}
          alt={recipe?.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Recipe Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-3">
              <span className="bg-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                {recipe?.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                recipe?.difficulty === 'Easy' ? 'bg-green-600' :
                recipe?.difficulty === 'Medium' ? 'bg-yellow-600' :
                'bg-red-600'
              }`}>
                {recipe?.difficulty}
              </span>
            </div>
            <h2 className="text-5xl font-bold mb-2">{recipe?.title}</h2>
            <p className="text-xl text-gray-200">{recipe?.description}</p>
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
                      <div className="font-semibold">{recipe?.totalTime ?? '-'} min</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Servings</div>
                      <div className="font-semibold">{recipe?.servings ?? '-'} people</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex">{renderStars(recipe?.rating ?? 0)}</div>
                    <span className="ml-2 font-semibold">{recipe?.rating ?? '-'}</span>
                    <span className="ml-1 text-gray-500 text-sm">({recipe?.ratingsCount ?? 0})</span>
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
                  src={recipe?.author?.avatar}
                  alt={recipe?.author?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900">{recipe?.author?.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{recipe?.author?.recipesCount ?? recipe?.author?.recipeCount ?? 0} recipes shared</div>
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
                    Comments ({(recipe?.comments || []).length})
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Instructions Tab */}
                {activeTab === 'instructions' && (
                  <div className="space-y-6">
                    {(recipe?.instructions || []).map((instruction) => (
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
                    <p className="text-gray-600 mb-6">Per serving (based on {recipe?.servings ?? '-'} servings)</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-orange-600">{recipe?.nutritionInfo?.calories ?? '-'}</div>
                        <div className="text-sm text-gray-600 mt-1">Calories</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-blue-600">{recipe?.nutritionInfo?.protein ?? '-'}g</div>
                        <div className="text-sm text-gray-600 mt-1">Protein</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-yellow-600">{recipe?.nutritionInfo?.carbs ?? '-'}g</div>
                        <div className="text-sm text-gray-600 mt-1">Carbs</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-red-600">{recipe?.nutritionInfo?.fat ?? '-'}g</div>
                        <div className="text-sm text-gray-600 mt-1">Fat</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-600">{recipe?.nutritionInfo?.fiber ?? '-'}g</div>
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
                    {(recipe?.comments || []).map((comment) => (
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
                                  <div className="font-semibold text-gray-900">{comment.user?.name || comment.user || 'Anonymous'}</div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : comment.date || ''}</span>
                                  <span>•</span>
                                  <div className="flex">{renderStars(comment.rating)}</div>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">{comment.text ?? comment.comment}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <button className="flex items-center space-x-1 text-gray-500 hover:text-orange-600">
                                <Heart className="w-4 h-4" />
                                <span>{comment.likes ?? 0}</span>
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
                {(recipe?.tags || []).map((tag, index) => (
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