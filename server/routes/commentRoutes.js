// server/routes/commentRoutes.js
import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Comment from '../models/Comment.js';
import Recipe from '../models/Recipe.js';
import { protect, checkCommentOwnership } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/comments/recipe/:recipeId
 * @desc    Get all comments for a recipe
 * @access  Public
 */
router.get(
  '/recipe/:recipeId',
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
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Check if recipe exists
      const recipe = await Recipe.findById(req.params.recipeId);
      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        });
      }

      // Build sort
      let sort = { createdAt: -1 }; // Most recent first

      if (req.query.sortBy === 'popular') {
        sort = { likesCount: -1 };
      } else if (req.query.sortBy === 'oldest') {
        sort = { createdAt: 1 };
      }

      // Get top-level comments only (no parent)
      const comments = await Comment.find({
        recipe: req.params.recipeId,
        parentComment: null
      })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('user', 'name avatar')
        .populate({
          path: 'replies',
          populate: { path: 'user', select: 'name avatar' },
          options: { sort: { createdAt: 1 } }
        });

      const total = await Comment.countDocuments({
        recipe: req.params.recipeId,
        parentComment: null
      });

      res.status(200).json({
        success: true,
        comments,
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
 * @route   POST /api/comments/recipe/:recipeId
 * @desc    Add comment to recipe
 * @access  Private
 */
router.post(
  '/recipe/:recipeId',
  protect,
  [
    body('text')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Comment must be between 1 and 1000 characters'),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('parentComment')
      .optional()
      .isMongoId()
      .withMessage('Invalid parent comment ID')
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

      // Check if recipe exists
      const recipe = await Recipe.findById(req.params.recipeId);
      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        });
      }

      // If replying to a comment, check if parent comment exists
      if (req.body.parentComment) {
        const parentComment = await Comment.findById(req.body.parentComment);
        if (!parentComment) {
          return res.status(404).json({
            success: false,
            message: 'Parent comment not found'
          });
        }
      }

      const commentData = {
        recipe: req.params.recipeId,
        user: req.user._id,
        text: req.body.text,
        rating: req.body.rating,
        parentComment: req.body.parentComment || null
      };

      const comment = await Comment.create(commentData);

      const populatedComment = await Comment.findById(comment._id)
        .populate('user', 'name avatar');

      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        comment: populatedComment
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/comments/:commentId
 * @desc    Get single comment by ID
 * @access  Public
 */
router.get('/:commentId', async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
      .populate('user', 'name avatar')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'name avatar' }
      });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.status(200).json({
      success: true,
      comment
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/comments/:commentId
 * @desc    Update comment
 * @access  Private (Owner only)
 */
router.put(
  '/:commentId',
  protect,
  checkCommentOwnership,
  [
    body('text')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Comment must be between 1 and 1000 characters')
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

      const comment = await Comment.findById(req.params.commentId);

      comment.text = req.body.text;
      comment.isEdited = true;
      comment.editedAt = Date.now();

      await comment.save();

      const updatedComment = await Comment.findById(comment._id)
        .populate('user', 'name avatar');

      res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        comment: updatedComment
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   DELETE /api/comments/:commentId
 * @desc    Delete comment
 * @access  Private (Owner only)
 */
router.delete('/:commentId', protect, checkCommentOwnership, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: req.params.commentId });

    // Delete the comment
    await comment.remove();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/comments/:commentId/like
 * @desc    Like/unlike comment
 * @access  Private
 */
router.post('/:commentId/like', protect, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const isLiked = comment.isLikedBy(req.user._id);

    if (isLiked) {
      // Unlike
      comment.likes = comment.likes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      comment.likes.push(req.user._id);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Comment unliked' : 'Comment liked',
      likes: comment.likesCount,
      isLiked: !isLiked
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/comments/user/:userId
 * @desc    Get all comments by a user
 * @access  Public
 */
router.get(
  '/user/:userId',
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
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const comments = await Comment.find({ user: req.params.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name avatar')
        .populate('recipe', 'title image');

      const total = await Comment.countDocuments({ user: req.params.userId });

      res.status(200).json({
        success: true,
        comments,
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
 * @route   GET /api/comments/:commentId/replies
 * @desc    Get all replies to a comment
 * @access  Public
 */
router.get('/:commentId/replies', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Check if parent comment exists
    const parentComment = await Comment.findById(req.params.commentId);
    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const replies = await Comment.find({ parentComment: req.params.commentId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name avatar');

    const total = await Comment.countDocuments({ parentComment: req.params.commentId });

    res.status(200).json({
      success: true,
      replies,
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