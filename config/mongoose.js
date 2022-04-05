const mongoose = require('mongoose')
const MONGODB_URI = 'mongodb://localhost/expense-tracker'

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
const db = mongoose.connection

db.on('error', () => {
  console.log('【 資料庫發生錯誤!! 】')
})

db.once('open', () => {
  console.log('【 資料庫已連接 】')
})

module.exports = db
