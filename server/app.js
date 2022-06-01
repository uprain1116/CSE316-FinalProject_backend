const express = require('express');


const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
//const Note = require('./models/note.js');
 const User = require('./models/user.js');


const session=require('express-session')
const MongoStore= require('connect-mongo')
//const {isLoggedIn, isAgent} = require('./auth');
const {wrapAsync} = require('./helper');
app.use(bodyParser.json());

const cors= require('cors')
app.use(cors())

require('dotenv').config()
const mongoose= require('mongoose')
const bcrypt = require("bcrypt");
const validator = require("./utils/validators");
var mongoDB = process.env.ATLAS_CONNECTION
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const sessionSecret = 'make a secret string';

const store = MongoStore.create({
    mongoUrl: mongoDB,
    secret: sessionSecret,
    touchAfter: 24 * 60 * 60
})

//mongoose.set('useFindAndModify', false);

const sessionConfig = {
    store,
    name: 'session',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
        // later you would want to add: 'secure: true' once your website is hosted on HTTPS.
    }
}

app.use(session(sessionConfig));


// This is middleware that will run before every request
app.use((req, res, next) => {
    // We can set variables on the request, which we can then access in a future method
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    // Calling next() makes it go to the next function that will handle the request
    next();
});

app.use((err, req, res, next) => {
    console.log("Error handling called " + err);
    // If want to print out the error stack, uncomment below
    // console.error(err.stack)
    // Updating the statusMessage with our custom error message (otherwise it will have a default for the status code).
    res.statusMessage = err.message;

    if (err.name === 'ValidationError') {
        res.status(400).end();
    } else {
        // We could further interpret the errors to send a specific status based more error types.
        res.status(500).end();
    }
})

app.post('/register', wrapAsync(async function (req, res) {
    console.log("I/m here")
    const newUser = new User({
        userInfo:req.body.userInfo,
        questions:req.body.questions

})
    await newUser.save();
    req.session.userId = newUser._id;

    res.json(newUser);

}));
var findAndValidate = async function (email, password) {
    console.log("I'm here")
    const user = await User.findOne({"userInfo.email":email});
    console.log(user)
    if(!user) {
        return false;
    }
    const isValid = await bcrypt.compare(password, user.userInfo.password);
    return isValid ? user : false;
}

app.post('/login', wrapAsync(async function (req, res) {
    let email=req.body.email
    let password= req.body.password


    console.log(email);
    //let userInfo={email:email, password:password}
    const user = await findAndValidate(email, password);
    console.log('user='+user)

    if (user) {
        req.session.userId = user._id;
        //res.sendStatus(204);
        //res.json({agent:req.session.userId, status:204, currentUser:user});
        //res.json({agent:req.session.userId, status:204, name:user.name, email:user.email, colorScheme:user.colorScheme, userId:user._id, profile_url: user.profile_url});
        console.log('logged in' +user._id)
    } else {
        console.log(' not logged in')
        res.sendStatus(401);
    }
}));

app.post('/logout', wrapAsync(async function (req, res) {
    req.session.userId = null;
    res.sendStatus(204);
    console.log('logged out')
}));

app.get('/api/users', async function (req,res) {
    const user = await User.find({});
    res.json(user);
});

app.get('/api/users/:id', async function (req,res) {
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


app.delete('/api/users/:id', async function (req,res) {
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

app.put('/api/users/:id', async function (req,res) {
    let id = req.params.id;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    // This below method automatically saves it to the database
    User.findByIdAndUpdate(id,
        {'xid': req.body.id, "name": req.body.name, "email": req.body.email, "colorScheme": req.body.colorScheme,"profile_url":req.body.profile_url},
        function (err, result) {
            if (err) {
                console.log("ERROR: " + err);
                res.send(err);
            } else {
                // Status 204 represents success with no content
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
                res.sendStatus(204);
            }
        });
});





port = process.env.PORT || 8080;
app.listen(port, () => { console.log('server started!')});

