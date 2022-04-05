const express = require('express')
const router = express.Router()
const moment = require('moment')

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', (req, res) => {
  Category.find({})
    .lean()
    .then(catagories => {
      return res.render('new', { catagories })
    })
})

router.post('/', (req, res) => {
  Category.find({})
    .lean()
    .then(catagories => {
      const userId = req.user._id
      const { name, date, categoryId, amount } = req.body
      const errors = []

      catagories.forEach(item => {
        if (String(item._id) === categoryId) {
          item.preset = true
        } else {
          item.preset = false
        }
      })

      if (!name || !date || !categoryId || !amount) {
        errors.push({ message: '所有欄位都是必填！' })
      }
      if (errors.length) {
        return res.render('new', {
          errors,
          name,
          date,
          amount,
          catagories
        })
      }

      return Record.create({
        name,
        date,
        categoryId,
        amount,
        userId
      })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

router.get('/edit/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  Category.find({})
    .lean()
    .then(catagories => {
      return Record.findOne({ _id, userId })
        .lean()
        .then(item => {
          catagories.forEach(category => {
            if (String(category._id) === String(item.categoryId)) {
              category.preset = true
            } else {
              category.preset = false
            }
          })
          item.date = moment(item.date).format('YYYY-MM-DD')
          res.render('edit', { item, catagories })
        })
        .catch(error => console.log(error))
    })
})

router.put('/:id', (req, res) => {
  Category.find({})
    .lean()
    .then(catagories => {
      const _id = req.params.id
      const userId = req.user._id
      const { name, date, categoryId, amount } = req.body
      const errors = []

      catagories.forEach(item => {
        if (String(item._id) === categoryId) {
          item.preset = true
        } else {
          item.preset = false
        }
      })

      if (!name || !date || !categoryId || !amount) {
        errors.push({ message: '所有欄位都是必填！' })
      }
      if (errors.length) {
        return res.render('new', {
          errors,
          name,
          date,
          amount,
          catagories
        })
      }

      return Record.findOneAndUpdate({ _id, userId }, {
        name,
        date,
        categoryId,
        amount,
        userId
      })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  return Record.findOne({ _id, userId })
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router