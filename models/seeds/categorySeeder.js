if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Category = require('../category')
const db = require('../../config/mongoose')
const seedData = require('./categories.json').categories

db.once('open', () => {
  Category.find({})
    .then(categories => {
      if (categories.length) {
        console.log('已載入過"類別"了。')
        process.exit()
      }

      return Promise.all(Array.from(seedData, item => {
        return Category.create({ name: item.name, icon: item.icon })
      }))
    })
    .then(() => {
      console.log('"類別"的種子資料載入完畢')
      process.exit()
    })
    .catch(err => console.log(err))
})