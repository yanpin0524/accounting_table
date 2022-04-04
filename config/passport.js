const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = (app) => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略
  // Local
  passport.use(new LocalStrategy({ usernameField: 'name', passReqToCallback: true }, (req, name, password, done) => {
    User.findOne({ name })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('warning_msg', '這個使用者尚未註冊'))
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, req.flash('warning_msg', '使用者名稱或密碼不正確'))
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))
  // Facebook
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const name = profile._json.name
    User.findOne({ name })
      .then(user => {
        if (user) return done(null, user)

        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}