const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const database_config = require('./config/database');
const mode_config = require('./config/env');
const superUser = require('./models/users/superUser');

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
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = database_config.secret;
opts.issuer = 'superuser.grunagro.com';
opts.audience = 'grunagro.com';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    superUser.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

// routes
const users = require('./routes/users');
app.use('/users', users);

// app loop
app.get('/', (req,res) => { // home '/' response
    res.json({status:'working'});
});
app.listen(port, () => {
    if(mode_config.mode == "dev"){
        console.log('server started at port ' + port);
    }
});