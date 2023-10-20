require("dotenv").config()
const express = require('express')
const session = require('express-session')
const dbConnect = require('./config/dbConnect')
const userRouter = require('./routes/users/user')
const postRouter = require('./routes/posts/post')
const commentRouter = require('./routes/comments/comment')
const globalErrHandler = require('./middlewares/globalHandler')
const MongoStore = require('connect-mongo')
const app = express()

dbConnect()
// middleware

app.use(express.json())

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongoUrl: process.env.MONGO_URL,
    ttl: 24 * 60 * 60
  })
}))

// 解决夸源资源共享错误
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

// Users route
app.use('/api/v1/users', userRouter)

// Posts route
// ----------------
app.use('/api/v1/posts', postRouter)

// comment route
// ---------------
app.use('/api/v1/comments', commentRouter)



// Error handler middlewares

app.use(globalErrHandler)

// listen server

const PORT = process.env.PORT || 9000
app.listen(PORT, console.log(`Server is running on PORT ${PORT}`))