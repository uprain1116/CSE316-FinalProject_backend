const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Logs = require('../models/log');
const {wrapAsync} = require('../utils/helper');
const mongoose= require('mongoose');
const user = require('../models/user');

//Get all user information
router.get('/users', wrapAsync(async function (req, res){
    const user = await User.find({});
    res.json(user);
}));

router.get('/users/:id', async function (req,res) {
    let id = req.params.id;

    if( mongoose.isValidObjectId(id) ) {

        const userFind = await User.findById(id);
        if( userFind ) {
            res.json(userFind);
            return;
        }
    }

    console.log("No user with id: " + id);
    res.status(404);
    res.send("No user with id: " + id);
});


router.delete('/users/:id', async function (req,res) {
    const id = req.params.id;
    User.findByIdAndDelete(id,
        null,
        function (error, result) {
            if (error) {
                console.log("ERROR: " + error);
                res.status(404).send(error.message);
            } else {
                console.log("Deleted successfully: " + result);
                // Status 204 represents success with no content
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
                res.sendStatus(204);
            }
        });
});

router.put('/users/:id', async function (req,res) {
    let id = req.params.id;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    // This below method automatically saves it to the database
    User.findByIdAndUpdate(id,
        {"userInfo":req.body.userInfo, "questions":req.body.questions},
        function (err, result) {
            if (err) {
                console.log("ERROR: " + err);
                res.send(err);
            } else {
                // Status 204 represents success with no content
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
                res.sendStatus(204);
                console.log(result)
            }
        });
});


router.post('/register', wrapAsync(async function (req, res){
    const {userInfo, questions} = req.body;

    const newUser = new User({userInfo, questions})

    await newUser.save();
    req.session.userId = newUser._id;
    // Note: this is returning the entire user object to demo, which will include the hashed and salted password.
    // In practice, you wouldn't typically do this – a success status would suffice, or perhaps just the user id.
    res.json(user);
}));

router.post('/login', wrapAsync(async function (req, res) {
    const {password, email} = req.body;
    const user = await User.findAndValidate(email, password);
    if (user) {
        req.session.userId = user._id;
        res.json(user._id);
        // res.sendStatus(204);
    } else {
        res.sendStatus(401);
    }
}));

router.post('/logout', wrapAsync(async function (req, res) {
    req.session.userId = null;
    res.sendStatus(204);
    console.log('logged out')
}));

router.post('/getcurrentsession', wrapAsync(async function (req, res){
    res.json(req.session.userId);
}))





module.exports = router;