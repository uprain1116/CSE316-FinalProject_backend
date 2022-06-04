const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Log = require('../models/log');
const {wrapAsync} = require('../utils/helper');
const mongoose= require('mongoose');
const user = require('../models/user');


router.get('/logs', wrapAsync(async function (req, res){
    console.log(req.session.userId)
    const log = await Log.find({userid: req.session.userId});
    res.json(log);
}));



router.post('/logs', wrapAsync(async function (req, res){
    const newLog = new Log({
        userid:req.body.userId,
        responses:req.body.responses
    })

    // {
    // //     userid: userID,
    // //     responses: [
    // //         {
    // //             date: responses.date,
    // //             answer: responses.answer
    // //
    // //         }
    // //     ]
    // // })
    //
    await newLog.save();

    // Note: this is returning the entire user object to demo, which will include the hashed and salted password.
    // In practice, you wouldn't typically do this – a success status would suffice, or perhaps just the user id.
     res.json(newLog);
}));


module.exports = router;