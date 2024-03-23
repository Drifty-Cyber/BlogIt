const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A post must have a title'],
    },
    authorName: {
      type: String,
      required: [true, 'A post must have an author name'],
    },
    body: {
      type: String,
      required: [true, 'A post must have a body'],
    },
    images: [String],
    ratingsAverage: {
      type: Number,
      // default: 4.5,
      default: 1,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    slug: String,
    // author: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    //   required: [true, 'A post must have an author'],
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Define pre-save hook to update 'updatedAt' timestamp
postSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

postSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// QUERY MIDDLEWARE TO POPULATE 'author' FIELD
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: '-__v -passwordChangedAt',
  });

  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
