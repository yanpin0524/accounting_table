const express = require('express')
const router = express.Router()
const moment = require('moment')

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  const userId = req.user._id

  Category.find({})
    .lean()
    .then(catagories => {
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

          return res.render('home', {
            accountingTable,
            catagories,
            totalAmount
          })
        })
    })
    .catch(error => console.error(error))
})

router.get('/search', (req, res) => {
  const userId = req.user._id
  const categoryId = req.query.categoryId

  if (!categoryId) {
    return res.redirect('/')
  }

  Category.find({})
    .lean()
    .then(catagories => {
      catagories.forEach(item => {
        if (String(item._id) === categoryId) {
          item.preset = true
        } else {
          item.preset = false
        }
      })
      Record.find({ userId, categoryId })
        .populate('categoryId')
        .lean()
        .sort({ date: 'desc' }) // asc
        .then(accountingTable => {
          let totalAmount = 0
          accountingTable.forEach(item => {
            totalAmount += item.amount
            item.date = moment(item.date).format('YYYY-MM-DD')
          })

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