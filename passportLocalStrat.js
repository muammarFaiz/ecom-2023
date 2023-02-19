const LocalStrat = require('passport-local').Strategy
const passport = require('passport')

async function authUser(username, password) {

}

passport.use(new LocalStrat(authUser))
passport.serializeUser(function(user, done) {
  console.log(user)
  return done(null, user.id)
})
passport.deserializeUser(function(userid, done) {
  return done(null, )
})
// do the user collection db and register