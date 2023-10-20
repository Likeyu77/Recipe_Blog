const express = require('express')
const protected = require('../../middlewares/protected')
const multer = require('multer')
const storage = require('../../config/cloudinary')
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatepostCtrl,
} = require('../../controllers/posts/postControler')

const postRouter = express.Router()

const upload = multer(storage)
postRouter.post("/", protected, upload.single('post'), createPostCtrl)

//GET/api/v1/posts
postRouter.get("/", fetchPostsCtrl)

//GET/api/v1/posts/:id
postRouter.get("/:id", fetchPostCtrl)

//DELETE/api/v1/posts/:id
postRouter.delete("/:id", protected, deletePostCtrl)

//PUT/api/v1/posts/:id
postRouter.put("/:id", protected, upload.single('post'), updatepostCtrl)

module.exports = postRouter