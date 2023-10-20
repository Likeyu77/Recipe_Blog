const User = require('../../models/user/User')
const Post = require('../../models/post/Post')
const Comment = require('../../models/comment/Comment')
const appErr = require('../../utils/appErr')

//create
const createCommentCtrl = async (req, res, next) => {
  const { message } = req.body
  try {
    if (!message) {
      return next(appErr('message is required'), 403)
    }
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.session.userAuth)

    const commentCreated = await Comment.create({
      user: req.session.userAuth,
      message
    })

    post.comments.push(commentCreated._id)
    user.comments.push(commentCreated._id)

    await post.save({ validateBeforeSave: false })
    await user.save({ validateBeforeSave: false })
    res.json({
      status: "success",
      data: commentCreated,
    })
  } catch (error) {
    next(appErr(error.message))
  }
}

//single
const commentDetailsCtrl = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)
    res.json({
      status: "success",
      data: comment,
    })
  } catch (error) {
    next(appErr(error.message))
  }
}

//delete
const deleteCommentCtrl = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if (comment.user.toString() !== req.session.userAuth) {
      return next(appErr('you are not allowed to delete the comment'))
    }
    await Comment.findByIdAndDelete(req.params.id)
    res.json({
      status: "success",
      user: "comment deleted",
    })
  } catch (error) {
    next(appErr(error.message))
  }
}

//Update
const upddateCommentCtrl = async (req, res, next) => {
  const { message } = req.body
  if (!message) {
    return next(appErr('message field is required'))
  }
  try {
    const comment = await Comment.findById(req.params.id)
    if (comment.user.toString() !== req.session.userAuth) {
      return next(appErr('you are not allowed to delete the comment'))
    }
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, { message }, { new: true })
    res.json({
      status: "success",
      data: updatedComment,
    })
  } catch (error) {
    next(appErr(error.message))
  }
}

module.exports = {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  upddateCommentCtrl,
}
