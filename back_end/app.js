#!/usr/bin/env nodejs
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const database_config = require('./config/database');
const mode_config = require('./config/env');
const User = require('./models/users/User');

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(database_config.database, {useNewUrlParser: true, useUnifiedTopology: true})
    .then( res => console.log("connected to db") )
    .catch( err => console.log(err));

// express app initiation
const port = 3000;
var app = express();


// middleware declaration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors()); // cors in use
app.use(bodyParser.json()); // body parser
// passport-jwt authentication startegy
app.use(passport.initialize());
app.use(passport.session());
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
opts.secretOrKey = database_config.secret;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("JWT payload -",jwt_payload);
    
    User.findById(jwt_payload._id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            console.log("JWT -",user);
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

// static file serving 
app.use(express.static('public'))

// routes
const users = require('./routes/users');
const smsBackend = require('./routes/smsBackend');
const listUser = require('./routes/listUser');
const cowfarm = require('./routes/cowFarm')



// init super user
User.find({}, (err,user) => {
    console.log("Init state Users - ",user);
    
    if(err) throw err;
    if(user.length === 0){
        let newUser = new User({
            name : "test",
            mobileNumber: 1234567890,
            email : "test@test.com",
            userType : "super",
            username : "test",
            password : "test",
        })
        User.addUser(newUser,(err,user) => {
            if(err) throw err;
            console.log("Created user : ",user);
        })
    }
})
app.use('/users', users);
app.use('/sms', smsBackend);
app.use('/listUser', listUser);
app.use('/cowfarm', cowfarm)

// app loop
app.get('/', (req,res) => { // home '/' response
    res.json({status:'working'});
});
app.listen(port, () => {
    if(mode_config.mode == "dev"){
        console.log('server started at port ' + port);
    }
});


// mqtt switch on
const mqtt = require('./mqtt/mqttHandle')