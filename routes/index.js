const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const accounting = require('./modules/accounting')
const users = require('./modules/users')
const auth = require('./modules/auth')

const { authenticator } = require('../middleware/auth')

router.use('/accounting', authenticator, accounting)
router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticator, home)

module.exports = router
