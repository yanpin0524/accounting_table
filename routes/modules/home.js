const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  const userId = req.user._id
  Record.find({ userId })
    .lean()
    .sort({ date: 'desc' }) // asc
    .then(accountingTable => {
      let totalAmount = 0
      accountingTable.forEach(item => {
        totalAmount += item.amount
      })

      Category.find({})
        .lean()
        .then(catagories => {
          return res.render('home', {
            accountingTable, 
            catagories, 
            totalAmount
          })
        })
    })
    .catch(error => console.error(error))
})

module.exports = router