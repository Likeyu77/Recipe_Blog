const User = require('../../models/user/User')
const bcrypt = require('bcryptjs')
const appErr = require('../../utils/appErr')


//register
const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body
  if (!fullname || !email || !password) {
    return next(appErr("all fields are required"))
  }


  try {
    // check if user exist
    const userFound = await User.findOne({ email })
    if (userFound) {
      return next(appErr("User already exist"))
      // return res.json({ status: 'failed', data: 'User already exist' })
    }
    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // create user
    const user = await User.create({ fullname, email, password: hashedPassword })
    res.json({
      status: 200,
      user: user,
    })
  } catch (error) {
    res.json(error)
  }
}

//login
const loginCtrl = async (req, res, next) => {

  const { email, password } = req.body
  if (!email || !password) {
    return next(appErr('all fields are required'))
  }
  try {
    const userFound = await User.findOne({ email })
    if (!userFound) {
      return next(appErr('invalid login'))
      // return res.json({ status: 'failed', data: 'Invalid email' })
    }
    const isPasswordValid = await bcrypt.compare(password, userFound.password)
    if (!isPasswordValid) {
      return next(appErr('invalid login'))
    }

    // save user into session
    req.session.userAuth = userFound._id

    res.json({
      status: "success",
      user: userFound,
    })
  } catch (error) {
    res.json(error)
  }
}

//details
const userDetailsCtrl = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    res.json({
      status: "success",
      user: user,
    })
  } catch (error) {
    res.json(error)
  }
}
//profile
const profileCtrl = async (req, res) => {
  try {
    const userId = req.session.userAuth
    const user = await User.findById(userId).populate("posts").populate('comments')

    res.json({
      status: "success",
      user: user,
    })
  } catch (error) {
    res.json(error)
  }
}

//upload profile photo
const uploadProfilePhotoCtrl = async (req, res) => {
  // console.log(req.file)
  try {
    const userId = req.session.userAuth
    const userFound = await User.findById(userId)
    if (!userFound) {
      return next(appErr('User not found', 403))
    }
    await User.findByIdAndUpdate(userId, {
      profileImage: req.file.path
    }, {
      new: true
    })
    res.json({
      status: "success",
      user: "User profile image upload",
    })
  } catch (error) {
    next(appErr(error.message))
  }
}

//upload cover image

const uploadCoverImgCtrl = async (req, res) => {
  try {
    const userId = req.session.userAuth
    const userFound = await User.findById(userId)
    if (!userFound) {
      return next(appErr('User not found', 403))
    }
    await User.findByIdAndUpdate(userId, {
      coverImage: req.file.path
    }, {
      new: true
    })
    res.json({
      status: "success",
      user: "User cover image upload",
    })
  } catch (error) {
    res.json(error)
  }
}

//update password
const updatePasswordCtrl = async (req, res) => {
  const { password } = req.body
  try {
    if (password) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      await User.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true })

    }


    res.json({
      status: "success",
      user: "User password update",
    })
  } catch (error) {
    res.json(next(appErr('please provide password')))
  }
}

//update user info
const updateUserCtrl = async (req, res, next) => {
  const { fullname, email } = req.body
  console.log(req.body)
  try {
    // 如果输入空格的话，还是可以更新。应该去掉字符前后的空格（之后改进输入空格也视为空）
    if (!fullname || !email) {
      return next(appErr('all fields are required'))
    }
    // check if email is not taken
    const emailTaken = await User.findOne({ email })
    if (emailTaken) {
      return next(appErr("email is taken", 400))
    }

    // update the user
    const user = await User.findByIdAndUpdate(req.params.id, { fullname, email }, { new: true })
    res.json({
      status: "success",
      user: user,
    })
  } catch (error) {
    res.json(next(appErr(error.message)))
  }
}

//logout
const logoutCtrl = async (req, res) => {
  req.session.destroy()
  try {
    res.json({
      status: "success",
      user: "User logout",
    })
  } catch (error) {
    res.json(error)
  }
}

module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
}