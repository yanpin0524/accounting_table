const bcrypt = require('bcryptjs')
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
        recordSeed.forEach(seedRecord => {
          Category.findOne({ name: seedRecord.category })
            .then(item => {
              const categoryId = item._id

              Record.create({
                name: seedRecord.name,
                date: seedRecord.date,
                amount: seedRecord.amount,
                userId: user._id,
                categoryId
              })
            })
        })
      })
  })
})
  .then(() => {
    console.log('種子資料 載入結束')
  })
  .catch(err => console.log(err))
