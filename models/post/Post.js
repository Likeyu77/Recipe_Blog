const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    ingredients: {
      type: [String],
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Chinese', 'Indian', 'Thai', 'Japanese', 'Italian', 'other']
    },
    image: {
      type: String,
      // required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    timestamps: true
  }
)

const Post = mongoose.model('Post', postSchema)
module.exports = Post