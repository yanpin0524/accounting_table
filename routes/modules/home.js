const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

router.get('/', (req, res) => {
  // const userId = req.user._id
  Record.find({ })
    .lean()
    .sort({ date: 'desc' }) // asc
    .then(accountingTable => {
      console.log(accountingTable)
      res.render('home', { accountingTable })})
    .catch(error => console.error(error))
})

module.exports = router