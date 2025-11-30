import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import { 
  ChefHat, ArrowLeft, Upload, X, Plus, Minus, Clock, Users, 
  ImagePlus, Save, Eye, AlertCircle 
} from 'lucide-react';

const CreateRecipePage = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [recipeData, setRecipeData] = useState({
    title: '',
    description: '',
    category: '',
    cuisine: '',
    difficulty: 'Medium',
    prepTime: '',
    cookTime: '',
    servings: '',
    image: null
  });

  const [ingredients, setIngredients] = useState([
    { id: 1, item: '', amount: '', category: 'Main' }
  ]);

  const [instructions, setInstructions] = useState([
    { id: 1, title: '', description: '', time: '' }
  ]);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const [nutritionInfo, setNutritionInfo] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { createRecipe, updateRecipe, getRecipeById } = useRecipes();

  useEffect(() => {
    let mounted = true;
    const loadRecipe = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const result = await getRecipeById(id);
        if (!mounted) return;
        if (result.success && result.recipe) {
          const r = result.recipe;
          setIsEditing(true);
          setRecipeData(prev => ({
            ...prev,
            title: r.title || '',
            description: r.description || '',
            category: r.category || '',
            cuisine: r.cuisine || '',
            difficulty: r.difficulty || 'Medium',
            prepTime: r.prepTime?.toString() || '',
            cookTime: r.cookTime?.toString() || '',
            servings: r.servings?.toString() || '',
            image: r.image || null
          }));

          setIngredients((r.ingredients || []).map((ing, i) => ({ id: Date.now() + i, item: ing.item || '', amount: ing.amount || '', category: ing.category || 'Main' })));

          setInstructions((r.instructions || []).map((inst, i) => ({ id: Date.now() + i, title: inst.title || '', description: inst.description || '', time: inst.time || '' })));

          setTags(r.tags || []);

          setNutritionInfo({
            calories: r.nutritionInfo?.calories?.toString() || '',
            protein: r.nutritionInfo?.protein?.toString() || '',
            carbs: r.nutritionInfo?.carbs?.toString() || '',
            fat: r.nutritionInfo?.fat?.toString() || '',
            fiber: r.nutritionInfo?.fiber?.toString() || ''
          });

          if (r.image) setImagePreview(r.image);
        } else {
          setErrors({ form: result.error || 'Failed to load recipe' });
        }
      } catch (err) {
        setErrors({ form: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();

    return () => { mounted = false; };
  }, [id, getRecipeById]);

  // Categories and cuisines
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer', 'Beverage'];
  const cuisines = ['Italian', 'Chinese', 'Mexican', 'Japanese', 'Thai', 'Indian', 'French', 'American', 'Greek', 'Other'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const ingredientCategories = ['Main', 'Seasoning', 'Garnish', 'Sauce', 'Other'];

  // Handle basic form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setRecipeData(prev => ({ ...prev, image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Ingredient handlers
  const addIngredient = () => {
    setIngredients([...ingredients, { 
      id: Date.now(), 
      item: '', 
      amount: '', 
      category: 'Main' 
    }]);
  };

  const removeIngredient = (id) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ing => ing.id !== id));
    }
  };

  const updateIngredient = (id, field, value) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  // Instruction handlers
  const addInstruction = () => {
    setInstructions([...instructions, { 
      id: Date.now(), 
      title: '', 
      description: '', 
      time: '' 
    }]);
  };

  const removeInstruction = (id) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter(inst => inst.id !== id));
    }
  };

  const updateInstruction = (id, field, value) => {
    setInstructions(instructions.map(inst => 
      inst.id === id ? { ...inst, [field]: value } : inst
    ));
  };

  // Tag handlers
  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 10) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Nutrition handlers
  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setNutritionInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!recipeData.title.trim()) newErrors.title = 'Title is required';
    if (!recipeData.description.trim()) newErrors.description = 'Description is required';
    if (!recipeData.category) newErrors.category = 'Category is required';
    if (!recipeData.cuisine) newErrors.cuisine = 'Cuisine is required';
    if (!recipeData.prepTime) newErrors.prepTime = 'Prep time is required';
    if (!recipeData.cookTime) newErrors.cookTime = 'Cook time is required';
    if (!recipeData.servings) newErrors.servings = 'Servings is required';
    if (!imagePreview) newErrors.image = 'Recipe image is required';

    const hasEmptyIngredients = ingredients.some(ing => !ing.item.trim() || !ing.amount.trim());
    if (hasEmptyIngredients) newErrors.ingredients = 'All ingredients must have item and amount';

    const hasEmptyInstructions = instructions.some(inst => !inst.description.trim());
    if (hasEmptyInstructions) newErrors.instructions = 'All instruction steps must have a description';

    return newErrors;
  };

  // Submit handler
  const handleSubmit = () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const submit = async () => {
      setIsLoading(true);

      // Build payload
      const payload = {
        title: recipeData.title,
        description: recipeData.description,
        category: recipeData.category,
        cuisine: recipeData.cuisine,
        difficulty: recipeData.difficulty,
        prepTime: parseInt(recipeData.prepTime) || 0,
        cookTime: parseInt(recipeData.cookTime) || 0,
        totalTime: (parseInt(recipeData.prepTime) || 0) + (parseInt(recipeData.cookTime) || 0),
        servings: parseInt(recipeData.servings) || 1,
        ingredients: ingredients.map((ing) => ({ item: ing.item, amount: ing.amount, category: ing.category })),
        instructions: instructions.map((inst, i) => ({ step: i + 1, title: inst.title || '', description: inst.description, time: inst.time || '' })),
        tags,
        nutritionInfo: {
          calories: nutritionInfo.calories ? Number(nutritionInfo.calories) : 0,
          protein: nutritionInfo.protein ? Number(nutritionInfo.protein) : 0,
          carbs: nutritionInfo.carbs ? Number(nutritionInfo.carbs) : 0,
          fat: nutritionInfo.fat ? Number(nutritionInfo.fat) : 0,
          fiber: nutritionInfo.fiber ? Number(nutritionInfo.fiber) : 0
        }
      };

      // If user uploaded an image file, include image preview (data URL) so backend has a string to store.
      // Ideally this would upload to Cloudinary and use the returned URL, but the backend accepts a string field for `image`.
      if (recipeData.image && recipeData.image instanceof File && imagePreview) {
        payload.image = imagePreview;
      } else if (recipeData.image && typeof recipeData.image === 'string') {
        payload.image = recipeData.image;
      }

      try {
        let result;
        if (isEditing && id) {
          // Update existing recipe
          result = await updateRecipe(id, payload);
        } else {
          result = await createRecipe(payload);
        }

        if (result.success) {
          const newRecipe = result.recipe || {};

          // Normalize id: server sometimes returns _id as an object (or has id)
          const normalizeId = (r) => {
            const candidate = r?._id ?? r?.id;
            if (!candidate) return null;
            // If it's already a string, use it
            if (typeof candidate === 'string') return candidate;
            // If Mongoose ObjectId or similar - try toString()
            if (candidate && typeof candidate.toString === 'function') return candidate.toString();
            // If it uses {$oid: '...'} shape
            if (typeof candidate === 'object' && candidate.$oid) return candidate.$oid;
            return String(candidate);
          };

          const recipeId = normalizeId(newRecipe);

          // Persist the created recipe locally as a fallback for reload/navigation races
          try {
            const stored = JSON.parse(localStorage.getItem('recentlyCreatedRecipes') || '[]');
            const entry = { id: recipeId, recipe: newRecipe };
            const dedup = stored.filter(r => r.id !== recipeId).slice(0, 49); // keep max 50
            localStorage.setItem('recentlyCreatedRecipes', JSON.stringify([entry, ...dedup]));
          } catch (e) {
            // ignore storage errors
            console.warn('Could not save recently created recipe', e);
          }

          // Navigate to recipe detail page (guard against invalid IDs)
          if (recipeId && recipeId !== 'undefined') navigate(`/recipes/${recipeId}`);
          else navigate('/recipes');
        } else {
          // Show error
          setErrors({ form: result.error || 'Failed to save recipe' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err) {
        setErrors({ form: err.message || 'Unexpected error' });
      } finally {
        setIsLoading(false);
      }
    };

    submit();
  };

  // Calculate total time
  const totalTime = (parseInt(recipeData.prepTime) || 0) + (parseInt(recipeData.cookTime) || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-orange-600">
                {/* <ArrowLeft className="w-6 h-6" /> */}
              </button>
              <div className="flex items-center space-x-2">
                {/* <ChefHat className="w-8 h-8 text-orange-600" /> */}
                {/* <h1 className="text-2xl font-bold text-gray-900">RecipeShare</h1> */}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Eye className="w-5 h-5" />
                <span>{isPreview ? 'Edit' : 'Preview'}</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{isLoading ? 'Publishing...' : 'Publish Recipe'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Please fix the following errors:</h3>
                <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Create New Recipe</h2>

          {/* Basic Information */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={recipeData.title}
                onChange={handleInputChange}
                placeholder="e.g., Classic Margherita Pizza"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={recipeData.description}
                onChange={handleInputChange}
                placeholder="Briefly describe your recipe..."
                rows="3"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Image <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                errors.image ? 'border-red-500' : 'border-gray-300'
              }`}>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setRecipeData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <ImagePlus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-1">Click to upload recipe image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Category and Cuisine */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={recipeData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine <span className="text-red-500">*</span>
                </label>
                <select
                  name="cuisine"
                  value={recipeData.cuisine}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                    errors.cuisine ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select cuisine</option>
                  {cuisines.map(cui => (
                    <option key={cui} value={cui}>{cui}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time and Servings */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prep Time (min) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="prepTime"
                  value={recipeData.prepTime}
                  onChange={handleInputChange}
                  placeholder="20"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                    errors.prepTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cook Time (min) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="cookTime"
                  value={recipeData.cookTime}
                  onChange={handleInputChange}
                  placeholder="30"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                    errors.cookTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Time
                </label>
                <div className="flex items-center h-12 px-4 bg-gray-50 border border-gray-300 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="font-semibold text-gray-700">{totalTime} min</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servings <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="servings"
                  value={recipeData.servings}
                  onChange={handleInputChange}
                  placeholder="4"
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                    errors.servings ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <div className="flex space-x-4">
                {difficulties.map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setRecipeData(prev => ({ ...prev, difficulty: diff }))}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg font-semibold transition ${
                      recipeData.difficulty === diff
                        ? 'border-orange-600 bg-orange-50 text-orange-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Ingredients</h3>
              <button
                onClick={addIngredient}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-12 flex items-center justify-center bg-orange-100 text-orange-600 font-semibold rounded">
                    {index + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      value={ingredient.item}
                      onChange={(e) => updateIngredient(ingredient.id, 'item', e.target.value)}
                      className="md:col-span-5 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Amount (e.g., 2 cups)"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(ingredient.id, 'amount', e.target.value)}
                      className="md:col-span-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                    <select
                      value={ingredient.category}
                      onChange={(e) => updateIngredient(ingredient.id, 'category', e.target.value)}
                      className="md:col-span-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      {ingredientCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => removeIngredient(ingredient.id)}
                    disabled={ingredients.length === 1}
                    className="flex-shrink-0 p-3 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Instructions</h3>
              <button
                onClick={addInstruction}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-4">
              {instructions.map((instruction, index) => (
                <div key={instruction.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Step {index + 1}
                    </span>
                    <button
                      onClick={() => removeInstruction(instruction.id)}
                      disabled={instructions.length === 1}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Step title (optional)"
                      value={instruction.title}
                      onChange={(e) => updateInstruction(instruction.id, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                    <textarea
                      placeholder="Describe this step in detail..."
                      value={instruction.description}
                      onChange={(e) => updateInstruction(instruction.id, 'description', e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Time (optional, e.g., 5 min)"
                      value={instruction.time}
                      onChange={(e) => updateInstruction(instruction.id, 'time', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Information (Optional) */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Nutrition Information <span className="text-sm font-normal text-gray-500">(Optional)</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                <input
                  type="number"
                  name="calories"
                  value={nutritionInfo.calories}
                  onChange={handleNutritionChange}
                  placeholder="285"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                <input
                  type="number"
                  name="protein"
                  value={nutritionInfo.protein}
                  onChange={handleNutritionChange}
                  placeholder="12"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                <input
                  type="number"
                  name="carbs"
                  value={nutritionInfo.carbs}
                  onChange={handleNutritionChange}
                  placeholder="35"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fat (g)</label>
                <input
                  type="number"
                  name="fat"
                  value={nutritionInfo.fat}
                  onChange={handleNutritionChange}
                  placeholder="11"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fiber (g)</label>
                <input
                  type="number"
                  name="fiber"
                  value={nutritionInfo.fiber}
                  onChange={handleNutritionChange}
                  placeholder="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Tags <span className="text-sm font-normal text-gray-500">(Optional, max 10)</span>
            </h3>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Type a tag and press Enter"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-3"
            />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full"
                >
                  <span>#{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:bg-orange-200 rounded-full p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              type="button"
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Save as Draft
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Publishing...' : 'Publish Recipe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipePage;