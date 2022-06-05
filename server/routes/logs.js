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
    console.log(log);
    res.json(log);
}));


router.post('/createLog', wrapAsync(async function (req, res){
    const {userid, responses} = req.body;
    const newLog = new Log({userid, responses})

    await newLog.save();
    res.json(newLog);
}));

//Update current user Question
router.put('/log/:id', wrapAsync(async function (req, res){
    let id = req.params.id;
    Log.findByIdAndUpdate(id, 
        {
            userid: req.body.userid,
            responses: req.body.responses

        },
        function(err, result){
            if(err) res.send(err);
            else res.sendStatus(204);
        })
}));


module.exports = router;