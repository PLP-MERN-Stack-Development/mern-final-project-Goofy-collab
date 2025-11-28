// server/routes/recipeRoutes.js
import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Recipe from '../models/Recipe.js';
import { protect, checkRecipeOwnership } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/recipes
 * @desc    Get all recipes with filters and pagination
 * @access  Public
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      // Build filter query
      const filter = { status: 'published' };

      if (req.query.category) filter.category = req.query.category;
      if (req.query.cuisine) filter.cuisine = req.query.cuisine;
      if (req.query.difficulty) filter.difficulty = req.query.difficulty;
      if (req.query.maxTime) filter.cookTime = { $lte: parseInt(req.query.maxTime) };

      // Build sort query
      let sort = {};
      switch (req.query.sortBy) {
        case 'popular':
          sort = { likesCount: -1 };
          break;
        case 'rating':
          sort = { rating: -1 };
          break;
        case 'time':
          sort = { cookTime: 1 };
          break;
        case 'recent':
        default:
          sort = { createdAt: -1 };
      }

      // Execute query
      const recipes = await Recipe.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('author', 'name avatar')
        .select('-__v');

      const total = await Recipe.countDocuments(filter);

      res.status(200).json({
        success: true,
        recipes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/recipes/search
 * @desc    Search recipes by text
 * @access  Public
 */
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const recipes = await Recipe.find({
      $text: { $search: q },
      status: 'published'
    })
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .populate('author', 'name avatar')
      .select('-__v');

    res.status(200).json({
      success: true,
      recipes,
      total: recipes.length
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/recipes/popular
 * @desc    Get popular recipes
 * @access  Public
 */
router.get('/popular', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const recipes = await Recipe.find({ status: 'published' })
      .sort({ likesCount: -1 })
      .limit(limit)
      .populate('author', 'name avatar')
      .select('-__v');

    res.status(200).json({
      success: true,
      recipes
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/recipes/trending
 * @desc    Get trending recipes (popular in last 30 days)
 * @access  Public
 */
router.get('/trending', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const recipes = await Recipe.find({
      status: 'published',
      createdAt: { $gte: thirtyDaysAgo }
    })
      .sort({ views: -1, likesCount: -1 })
      .limit(limit)
      .populate('author', 'name avatar')
      .select('-__v');

    res.status(200).json({
      success: true,
      recipes
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/recipes/categories
 * @desc    Get all categories with recipe counts
 * @access  Public
 */
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Recipe.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      categories: categories.map(c => ({ name: c._id, count: c.count }))
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/recipes/cuisines
 * @desc    Get all cuisines with recipe counts
 * @access  Public
 */
router.get('/cuisines', async (req, res, next) => {
  try {
    const cuisines = await Recipe.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$cuisine',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      cuisines: cuisines.map(c => ({ name: c._id, count: c.count }))
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/recipes/:id
 * @desc    Get single recipe by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name avatar bio')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name avatar' },
        options: { sort: { createdAt: -1 } }
      });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Increment views
    await recipe.incrementViews();

    res.status(200).json({
      success: true,
      recipe
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/recipes
 * @desc    Create new recipe
 * @access  Private
 */
router.post(
  '/',
  protect,
  [
    body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
    body('category').notEmpty().withMessage('Category is required'),
    body('cuisine').notEmpty().withMessage('Cuisine is required'),
    body('cookTime').isInt({ min: 1 }).withMessage('Cook time must be at least 1 minute'),
    body('servings').isInt({ min: 1, max: 100 }).withMessage('Servings must be between 1 and 100'),
    body('ingredients').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
    body('instructions').isArray({ min: 1 }).withMessage('At least one instruction is required')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg
        });
      }

      const recipeData = {
        ...req.body,
        author: req.user._id
      };

      const recipe = await Recipe.create(recipeData);

      const populatedRecipe = await Recipe.findById(recipe._id)
        .populate('author', 'name avatar');

      res.status(201).json({
        success: true,
        message: 'Recipe created successfully',
        recipe: populatedRecipe
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   PUT /api/recipes/:id
 * @desc    Update recipe
 * @access  Private (Owner only)
 */
router.put('/:id', protect, checkRecipeOwnership, async (req, res, next) => {
  try {
    const allowedUpdates = [
      'title', 'description', 'image', 'category', 'cuisine', 
      'difficulty', 'prepTime', 'cookTime', 'servings', 
      'ingredients', 'instructions', 'nutritionInfo', 'tags', 'status'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully',
      recipe
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/recipes/:id
 * @desc    Delete recipe
 * @access  Private (Owner only)
 */
router.delete('/:id', protect, checkRecipeOwnership, async (req, res, next) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);

    // Delete associated comments
    const Comment = (await import('../models/Comment.js')).default;
    await Comment.deleteMany({ recipe: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/recipes/:id/like
 * @desc    Like/unlike recipe
 * @access  Private
 */
router.post('/:id/like', protect, async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const isLiked = recipe.isLikedBy(req.user._id);

    if (isLiked) {
      // Unlike
      recipe.likes = recipe.likes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      recipe.likes.push(req.user._id);
    }

    await recipe.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Recipe unliked' : 'Recipe liked',
      likes: recipe.likesCount,
      isLiked: !isLiked
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/recipes/:id/save
 * @desc    Save recipe to user's collection
 * @access  Private
 */
router.post('/:id/save', protect, async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.user._id);

    const isSaved = Array.isArray(user.savedRecipes) ? user.savedRecipes.includes(req.params.id) : false;

    if (isSaved) {
      return res.status(400).json({
        success: false,
        message: 'Recipe already saved'
      });
    }

    user.savedRecipes.push(req.params.id);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Recipe saved successfully'
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/recipes/:id/save
 * @desc    Remove recipe from user's collection
 * @access  Private
 */
router.delete('/:id/save', protect, async (req, res, next) => {
  try {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.user._id);

    user.savedRecipes = (Array.isArray(user.savedRecipes) ? user.savedRecipes : []).filter(
      id => id.toString() !== req.params.id
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Recipe removed from saved'
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/recipes/saved
 * @desc    Get user's saved recipes
 * @access  Private
 */
router.get('/saved', protect, async (req, res, next) => {
  try {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedRecipes',
        populate: { path: 'author', select: 'name avatar' }
      });

    res.status(200).json({
      success: true,
      recipes: user.savedRecipes
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/recipes/:id/similar
 * @desc    Get similar recipes
 * @access  Public
 */
router.get('/:id/similar', async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const limit = parseInt(req.query.limit) || 5;

    // Find recipes with same category or cuisine
    const similarRecipes = await Recipe.find({
      _id: { $ne: req.params.id },
      $or: [
        { category: recipe.category },
        { cuisine: recipe.cuisine },
        { tags: { $in: recipe.tags } }
      ],
      status: 'published'
    })
      .sort({ rating: -1, likesCount: -1 })
      .limit(limit)
      .populate('author', 'name avatar')
      .select('-__v');

    res.status(200).json({
      success: true,
      recipes: similarRecipes
    });

  } catch (error) {
    next(error);
  }
});

export default router;