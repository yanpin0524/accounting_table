const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', (req, res) => {
  Category.find({})
    .lean()
    .then(catagories => {
      return res.render('new', { catagories })
    })
})

router.post('', (req, res) => {
  const userId = req.user._id
  const { name, date, categoryId, amount } = req.body
  const errors = []

  if (!name || !date || !categoryId || !amount) {
    errors.push({ message: '所有欄位都是必填！' })
  }
  if (errors.length) {
    return res.render('new', {
      errors,
      name,
      date,
      categoryId,
      amount
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

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  return Todo.findOne({ _id, userId })
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, isDone } = req.body

  return Todo.findOne({ _id, userId })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'

      return todo.save()
    })
    .then(() => res.redirect(`/todos/${_id}`))
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