const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const User = require('../user')
const Record = require('../record')
const Category = require('../category')

const userSeed = require('./users.json').users
const recordSeed = require('./records.json').records

db.once('open', () => {
  userSeed.forEach(seedUser => {
    User.findOne({ email: seedUser.email })
      .then(user => {
        if (user) return user

        return bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(seedUser.password, salt))
          .then(hash => User.create({
            name: seedUser.name,
            email: seedUser.email,
            password: hash
          }))
      })
      .then((user) => {
        return Promise.all(Array.from(recordSeed, seedRecord => {
          return Category.findOne({ name: seedRecord.category })
            .lean()
            .then(category => {
              return Record.create({
                name: seedRecord.name,
                date: seedRecord.date,
                amount: seedRecord.amount,
                userId: user._id,
                categoryId: category._id
              })
            })
        }))
      })
      .then(() => {
        console.log('種子資料 載入結束')
        process.exit()
      })
      .catch(err => console.log(err))
  })
})
