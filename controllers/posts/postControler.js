const Post = require('../../models/post/Post')
const User = require('../../models/user/User')
const appErr = require('../../utils/appErr')


//create
const createPostCtrl = async (req, res, next) => {
  const { title, description, ingredients, category } = req.body
  try {
    if (!title || !description || !ingredients || !category || !req.file) {
      return next(appErr('all fields are required'))
    }
    const inArray = ingredients.split(",")
    const userId = req.session.userAuth
    const userFound = await User.findById(userId)
    const postCreated = await Post.create({
      title,
      description,
      ingredients: inArray,
      category,
      image: req.file.path,
      user: req.session.userAuth
    })
    userFound.posts.push(postCreated._id)
    await userFound.save()
    res.json({
      status: "success",
      data: postCreated,
    })

  } catch (error) {
    next(appErr(error.message))
  }
}

//all
const fetchPostsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('comments')
    res.json({
      status: "success",
      data: posts,
    })
  } catch (error) {
    next(appErr(error.message))
  }
}

//details
const fetchPostCtrl = async (req, res, next) => {
  try {
    const id = req.params.id
    const post = await Post.findById(id).populate('comments')
    res.json({
      status: "success",
      data: post,
    })
  } catch (error) {
    next(appErr(error.message))
  }
}

//delete
const deletePostCtrl = async (req, res, next) => {
  try {
    const id = req.params.id
    const post = await Post.findById(id)
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr('you are not allowed to delete the post'), 403)
    }
    const deletedPost = await Post.findByIdAndDelete(id)

    res.json({
      status: "success",
      user: "Post deleted successfully",
    })
  } catch (error) {
    next(appErr(error.message))
  }
}

//update
const updatepostCtrl = async (req, res, next) => {
  const { title, description, ingredients, category } = req.body

  try {
    const post = await Post.findById(req.params.id)
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr('you are not allowed to update the post'), 403)
    }
    const postUpdated = await Post.findByIdAndUpdate(req.params.id, {
      title,
      description,
      ingredients: ingredients.split(','),
      category,
      image: req.file.path
    }, {
      new: true
    })
    res.json({
      status: "success",
      data: postUpdated,
    })
  } catch (error) {
    next(appErr(error.message))
  }
}
module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatepostCtrl,
}
