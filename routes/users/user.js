const express = require('express')
const multer = require('multer')
const storage = require('../../config/cloudinary')
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
} = require('../../controllers/users/userControler')
const userRoutes = express.Router()
const protected = require('../../middlewares/protected')

const upload = multer({ storage })

userRoutes.post('/register', registerCtrl)

userRoutes.post('/login', loginCtrl)


userRoutes.get('/profile', protected, profileCtrl)


userRoutes.put("/profile-photo-upload", protected, upload.single('profile'), uploadProfilePhotoCtrl)

//PUT/api/v1/users/cover-photo-upload/:id
userRoutes.put("/cover-photo-upload", protected, upload.single('profile'), uploadCoverImgCtrl)

//PUT/api/v1/users/update-password/:id
userRoutes.put("/update-password/:id", updatePasswordCtrl)

//PUT/api/v1/users/update/:id
userRoutes.put("/update/:id", updateUserCtrl)

//GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl)

userRoutes.get('/:id', userDetailsCtrl)

module.exports = userRoutes