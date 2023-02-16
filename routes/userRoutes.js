const express = require('express');

const authCnntroller = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authCnntroller.signUp)
router.post('/login', authCnntroller.login)

module.exports = router;