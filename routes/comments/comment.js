const express = require('express')
const protected = require('../../middlewares/protected')
const commentRouter = express.Router()
const { createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  upddateCommentCtrl, } = require('../../controllers/comments/commentControler')

// id for this is post's id
commentRouter.post("/:id", protected, createCommentCtrl)

//GET/api/v1/comments/:id
commentRouter.get("/:id", commentDetailsCtrl)


//DELETE/api/v1/comments/:id (id is comment's id)

commentRouter.delete("/:id", protected, deleteCommentCtrl)

//PUT/api/v1/comments/:id
commentRouter.put("/:id", protected, upddateCommentCtrl)

module.exports = commentRouter