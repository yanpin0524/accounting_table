const Category = require('../category')
const db = require('../../config/mongoose')
const seedData = require('./categories.json').categories

db.once('open', () => {
  return Promise.all(Array.from(seedData,(_,index) => {
    const { name, icon } = seedData[index]
    Category.create({ name, icon })
  }))
})
  .then(() => {
    console.log('Category 種子資料載入完畢')
    // process.exit()
  })
