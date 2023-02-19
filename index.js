const express = require('express')
const session = require('express-session')
const MongoSessionStore = require('connect-mongodb-session')(session)
const passport = require('passport')
const cors = require('cors')
const multer = require('multer')
const bcrypt = require('bcrypt')

const mongodb_middleware = require('./mongodb_middleware.js')
const assignRoutes = require('./routes.js')

const upload = multer()

const app = express()
app.use(cors())
app.use(express.json({limit: Infinity}))
app.use(express.urlencoded({extended: true, limit: Infinity}))

const store = new MongoSessionStore({
  uri: 'mongodb://localhost:27017/ecom_2023',
  collection: 'mySessions'
})
store.on('error', function(err) {
  console.log('----------SESSION STORE ERROR. index.js')
  console.log(err.message)
})
app.use(require('express-session')({
  secret: 'test1',
  cookie: {maxAge: 1000 * 60 * 60 * 5},
  store: store,
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next) {
  console.log(req.url)
  next()
})


app.route('/')
.get(mongodb_middleware, function(req, res) {
  try {console.log(secret)}
  catch (error) {console.log(error.message)}
  try {console.log(secret.TRY)}
  catch (error) {console.log(error.message)}
  try {console.log(secrets)}
  catch (error) {console.log(error.message)}
  try {console.log(secrets.TRY)}
  catch (error) {console.log(error.message)}
  try {console.log(process.env)}
  catch (error) {console.log(error.message)}
  try {console.log(process.env.TRY)}
  catch (error) {console.log(error.message)}
  
  res.json({hehe: 'faiz test', session: req.session})
  req.client.close()
})

app.route('/register')
.post(mongodb_middleware, async function(req, res) {

  async function canSaveData(body, users) {
    if(body.username.length < 4) return 'username need to be 4 characters or longer'
    if(body.password.length < 3) return 'password need to be 3 characters or longer'
    const count = await users.countDocuments()
    if(!Number.isInteger(count)) return 'fail to count users documents'
    else if (count >= 50) return 'the limit of users have been reached'
    const duplicateUsername = await users.findOne({username: body.username})
    if(duplicateUsername != null) {
      if(duplicateUsername.username == body.username) return 'duplicate username'
      else return 'unknown database problem'
    }
    return 'can'
  }

  try {
    const users = req.db.collection('users')
    const permision = await canSaveData(req.body, users)
    if(permision == 'can') {
      const hash = await bcrypt.hash(req.body.password, 10)
      const result = await users.insertOne({
        info: 'test doc',
        username: req.body.username,
        password: hash
      })
      res.json({result: 'success'})
    } else res.json({fail: permision})
  } catch (error) {res.json({error: error.message})}
  finally {req.client.close()}
})

app.route('/login')
.post(mongodb_middleware, async function(req, res) {

  async function canLogin(req) {
    const {username, password} = req.body
    if(username.length < 1 || password < 1) return {fail: 'username or password cannot empty'}
    const user = await req.db.collection('users').findOne({username: username})
    if(user == null || user.username != username) return {fail: 'wrong usernamex or password'}
    const bcryptResult = await bcrypt.compare(password, user.password)
    if(!bcryptResult) return {fail: 'wrong username or passwordx'}
    return {result: 'success'}
  }

  try {
    res.json(await canLogin(req))
  } catch (error) {res.json({error: error.message})}
  finally {req.client.close()}
})

app.route('/test')
.get(mongodb_middleware, async function(req, res) {
  const count = await req.db.collection('users').countDocuments()
  console.log(count)
  req.client.close()
  return res.send('done')
})


app.listen(3000, function() {console.log('server running 3000')})