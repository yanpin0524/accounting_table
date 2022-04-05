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
      res.render('home', { accountingTable })})
    .catch(error => console.error(error))
})

module.exports = router