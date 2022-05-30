const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {wrapAsync} = require('../utils/helper');
const mongoose = require('mongoose');

//Get all user information
router.get('/users', wrapAsync(async function (req, res){
    const user = await User.find({});
    res.json(user);
}));

//Get user by id
router.get('/users/:id', wrapAsync( async function (req,res) {
    let id = req.params.id;
    if( mongoose.isValidObjectId(id) ) {
        const user = await User.findById(id);
        if( user ) {
            res.json(user);
            return;
        }
    }
}));

//Update user information
router.put('/users/:id', wrapAsync(async function (req, res){
    let id = req.params.id;
    User.findByIdAndUpdate(id, 
        {
            name: req.body.name, 
            email: req.body.email,
            address: req.body.address
        },
        function(err, result){
            if(err) res.send(err);
            else res.sendStatus(204);
        });
}));

module.exports = router;