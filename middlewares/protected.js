const appErr = require('../utils/appErr')

const protected = (req, res, next) => {
  // check if user is login
  if (req.session.userAuth) {
    console.log(req.session.userAuth)
    return next()
  }
  return next(appErr('Unauthorized, please login'))
}

module.exports = protected