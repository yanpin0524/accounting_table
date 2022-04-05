const express = require('express')
const router = express.Router()
const moment = require('moment')

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  const userId = req.user._id
  Record.find({ userId })
    .populate('categoryId')
    .lean()
    .sort({ date: 'desc' }) // asc
    .then(accountingTable => {
      let totalAmount = 0
      accountingTable.forEach(item => {
        totalAmount += item.amount
        item.date = moment(item.date).format('YYYY-MM-DD')
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