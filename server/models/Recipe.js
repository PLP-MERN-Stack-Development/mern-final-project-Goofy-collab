// server/models/Recipe.js
import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  item: {
    type: String,
    required: [true, 'Ingredient item is required'],
    trim: true
  },
  amount: {
    type: String,
    required: [true, 'Ingredient amount is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Main', 'Seasoning', 'Garnish', 'Sauce', 'Other'],
    default: 'Main'
  }
}, { _id: false });

const instructionSchema = new mongoose.Schema({
  step: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Instruction description is required'],
    trim: true
  },
  time: {
    type: String,
    default: ''
  }
}, { _id: false });

const nutritionSchema = new mongoose.Schema({
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 }
}, { _id: false });

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Recipe description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    image: {
      type: String,
      required: [true, 'Recipe image is required']
    },
    images: [{
      type: String
    }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer', 'Beverage']
    },
    cuisine: {
      type: String,
      required: [true, 'Cuisine is required'],
      enum: ['Italian', 'Chinese', 'Mexican', 'Japanese', 'Thai', 'Indian', 'French', 'American', 'Greek', 'Other']
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    prepTime: {
      type: Number,
      required: [true, 'Prep time is required'],
      min: [0, 'Prep time cannot be negative']
    },
    cookTime: {
      type: Number,
      required: [true, 'Cook time is required'],
      min: [1, 'Cook time must be at least 1 minute']
    },
    totalTime: {
      type: Number
    },
    servings: {
      type: Number,
      required: [true, 'Servings is required'],
      min: [1, 'Servings must be at least 1'],
      max: [100, 'Servings cannot exceed 100']
    },
    ingredients: {
      type: [ingredientSchema],
      required: [true, 'At least one ingredient is required'],
      validate: {
        validator: function(v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one ingredient is required'
      }
    },
    instructions: {
      type: [instructionSchema],
      required: [true, 'At least one instruction is required'],
      validate: {
        validator: function(v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one instruction is required'
      }
    },
    nutritionInfo: {
      type: nutritionSchema,
      default: () => ({})
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    likesCount: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingsCount: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published'
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for comments
recipeSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'recipe'
});

// Virtual for comment count
recipeSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'recipe',
  count: true
});

// Calculate total time before saving
recipeSchema.pre('save', function(next) {
  this.totalTime = this.prepTime + this.cookTime;
  next();
});

// Update likesCount when likes array changes
recipeSchema.pre('save', function(next) {
  if (this.isModified('likes')) {
    this.likesCount = this.likes.length;
  }
  next();
});

// Indexes for faster queries
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
recipeSchema.index({ author: 1 });
recipeSchema.index({ category: 1 });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ difficulty: 1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ likesCount: -1 });
recipeSchema.index({ rating: -1 });
recipeSchema.index({ views: -1 });

// Method to check if user has liked the recipe
recipeSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(id => id.toString() === userId.toString());
};

// Method to increment views
recipeSchema.methods.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;