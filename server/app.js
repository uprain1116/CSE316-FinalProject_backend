const express = require('express');
const User = require('./models/user');
const Log = require('./models/logs');

const userRoute = require('./routes/user');
// const logRoute = require('./routes/logs');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // MongoDB session store


// var mongoDBURL = process.env.MONGO_URL || 'mongodb+srv://sangwoo1116:sw981116@cluster0.lfsnt.mongodb.net/test';
var mongoDBURL = 'mongodb://localhost:27017/CSE316FinalProject'; //local

mongoose.connect(mongoDBURL, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.once('open', function(){
    console.log("Connected to MongoDB successfully!");
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const sessionSecret = 'make a secret string';

// Create Mongo DB Session Store
const store = MongoStore.create({
    mongoUrl: mongoDBURL,
    secret: sessionSecret,
    touchAfter: 24 * 60 * 60
})

// Setup to use the express-session package
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


app.use('/api', userRoute);



port = process.env.PORT || 8080;
app.listen(port, () => { console.log('server started!')});