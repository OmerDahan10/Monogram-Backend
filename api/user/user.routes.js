const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getUsers, updateUser,getUserByUsername} = require('./user.controller')
const router = express.Router()


router.get('/:username',getUserByUsername)
router.get('/',getUsers)
router.put('/',requireAuth,updateUser)

module.exports = router;