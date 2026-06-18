const express = require('express')
const path = require('path');
const router = express.Router()
const login  = require(path.join(__dirname, '../05-controllers/auth.cjs'))

// Base Path => /login for router
router.post('/', login)

module.exports = router