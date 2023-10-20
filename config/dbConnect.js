const mongoose = require('mongoose')

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('DB connection successfully')
  } catch (error) {
    console.log('DB connection failed', error.message)
  }
}

module.exports = dbConnect