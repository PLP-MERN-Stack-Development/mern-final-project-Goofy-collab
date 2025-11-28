// server/models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: [true, 'Recipe is required']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      minlength: [1, 'Comment must have at least 1 character'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    likesCount: {
      type: Number,
      default: 0
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    },
    isEdited: {
      type: Boolean,
      default: false
    },
    editedAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for replies
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment'
});

// Virtual for reply count
commentSchema.virtual('replyCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
  count: true
});

// Update likesCount when likes array changes
commentSchema.pre('save', function(next) {
  if (this.isModified('likes')) {
    this.likesCount = this.likes.length;
  }
  next();
});

// Update recipe rating when comment with rating is added
commentSchema.post('save', async function() {
  if (this.rating) {
    const Comment = this.constructor;
    const stats = await Comment.aggregate([
      { $match: { recipe: this.recipe, rating: { $exists: true } } },
      {
        $group: {
          _id: '$recipe',
          averageRating: { $avg: '$rating' },
          ratingsCount: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await mongoose.model('Recipe').findByIdAndUpdate(this.recipe, {
        rating: Math.round(stats[0].averageRating * 10) / 10,
        ratingsCount: stats[0].ratingsCount
      });
    }
  }
});

// Update recipe rating when comment with rating is deleted
commentSchema.post('remove', async function() {
  if (this.rating) {
    const Comment = this.constructor;
    const stats = await Comment.aggregate([
      { $match: { recipe: this.recipe, rating: { $exists: true } } },
      {
        $group: {
          _id: '$recipe',
          averageRating: { $avg: '$rating' },
          ratingsCount: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await mongoose.model('Recipe').findByIdAndUpdate(this.recipe, {
        rating: Math.round(stats[0].averageRating * 10) / 10,
        ratingsCount: stats[0].ratingsCount
      });
    } else {
      await mongoose.model('Recipe').findByIdAndUpdate(this.recipe, {
        rating: 0,
        ratingsCount: 0
      });
    }
  }
});

// Indexes for faster queries
commentSchema.index({ recipe: 1, createdAt: -1 });
commentSchema.index({ user: 1 });
commentSchema.index({ parentComment: 1 });

// Method to check if user has liked the comment
commentSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(id => id.toString() === userId.toString());
};

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;