// server/routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/users/:id
 * @desc    Get user profile by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken')
      .populate('followerCount followingCount recipeCount');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/:id/recipes
 * @desc    Get user's recipes
 * @access  Public
 */
router.get('/:id/recipes', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {
      author: req.params.id,
      status: 'published'
    };

    // If requesting user is the author, show all recipes including drafts
    if (req.user && req.user._id.toString() === req.params.id) {
      delete filter.status;
    }

    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
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
});

/**
 * @route   GET /api/users/:id/stats
 * @desc    Get user statistics
 * @access  Public
 */
router.get('/:id/stats', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get recipe stats
    const recipeStats = await Recipe.aggregate([
      { $match: { author: user._id, status: 'published' } },
      {
        $group: {
          _id: null,
          totalRecipes: { $sum: 1 },
          totalLikes: { $sum: '$likesCount' },
          totalViews: { $sum: '$views' },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const stats = recipeStats[0] || {
      totalRecipes: 0,
      totalLikes: 0,
      totalViews: 0,
      averageRating: 0
    };

    // Get category distribution
    const categoryStats = await Recipe.aggregate([
      { $match: { author: user._id, status: 'published' } },
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
      stats: {
        ...stats,
        followerCount: user.followers.length,
        followingCount: user.following.length,
        categories: categoryStats.map(c => ({ name: c._id, count: c.count }))
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/users/:id/follow
 * @desc    Follow/unfollow user
 * @access  Private
 */
router.post('/:id/follow', protect, async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentUser = await User.findById(req.user._id);

    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      isFollowing: !isFollowing
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/:id/followers
 * @desc    Get user's followers
 * @access  Public
 */
router.get('/:id/followers', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.id)
      .populate({
        path: 'followers',
        select: 'name avatar bio',
        options: { skip, limit }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const total = user.followers.length;

    res.status(200).json({
      success: true,
      followers: user.followers,
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
});

/**
 * @route   GET /api/users/:id/following
 * @desc    Get users that this user is following
 * @access  Public
 */
router.get('/:id/following', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.id)
      .populate({
        path: 'following',
        select: 'name avatar bio',
        options: { skip, limit }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const total = user.following.length;

    res.status(200).json({
      success: true,
      following: user.following,
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
});

/**
 * @route   GET /api/users/search
 * @desc    Search users
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

    const users = await User.find({
      $text: { $search: q },
      isActive: true
    })
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .select('name avatar bio location');

    res.status(200).json({
      success: true,
      users,
      total: users.length
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/suggested
 * @desc    Get suggested users to follow
 * @access  Private
 */
router.get('/suggested', protect, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const currentUser = await User.findById(req.user._id);

    // Find users that current user is not following
    const suggestedUsers = await User.find({
      _id: { 
        $nin: [...currentUser.following, req.user._id]
      },
      isActive: true
    })
      .sort({ followerCount: -1 })
      .limit(limit)
      .select('name avatar bio location');

    res.status(200).json({
      success: true,
      users: suggestedUsers
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/:id/feed
 * @desc    Get activity feed for user (recipes from followed users)
 * @access  Private
 */
router.get('/:id/feed', protect, async (req, res, next) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this feed'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.id);

    // Get recipes from followed users
    const feedRecipes = await Recipe.find({
      author: { $in: user.following },
      status: 'published'
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar')
      .select('-__v');

    const total = await Recipe.countDocuments({
      author: { $in: user.following },
      status: 'published'
    });

    res.status(200).json({
      success: true,
      recipes: feedRecipes,
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
});

export default router;