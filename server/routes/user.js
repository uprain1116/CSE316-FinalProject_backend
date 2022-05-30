const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {wrapAsync} = require('../utils/helper');

//Get all user information
router.get('/users', wrapAsync(async function (req, res){
    const user = await User.find({});
    res.json(user);
}));

module.exports = router;