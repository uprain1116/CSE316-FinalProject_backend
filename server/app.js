const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const User = require('./models/user.js');

const userRoute = require('./routes/user');
const logRoute = require('./routes/logs');


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

app.use('/api', userRoute);
app.use('/api',logRoute)

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

port = process.env.PORT || 8080;
app.listen(port, () => { console.log('server started!')});

