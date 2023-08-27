#!/usr/bin/env nodejs
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const database_config = require('./config/database');
const mode_config = require('./config/env');
const User = require('./models/users/User');
var mqtt = require('mqtt')
const fs = require('fs');
const https = require('https');


const privateKey = fs.readFileSync('/etc/letsencrypt/live/easyacres.in/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/easyacres.in/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/easyacres.in/chain.pem', 'utf8');


const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// setting time zone
process.env.TZ = 'Asia/Kolkata'

// mqtt
// const ip = 'mqtt://localhost:1883';
// const client = mqtt.connect(ip);


// database connection
mongoose.Promise = global.Promise;
mongoose.connect(database_config.database, {useNewUrlParser: true, useUnifiedTopology: true})
    .then( res => console.log("connected to db") )
    .catch( err => console.log(err));

// express app initiation
const port = 3000;
var app = express();

// app.use(express.static(__dirname, { dotfiles: 'allow' } ));

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
    
    User.findById(jwt_payload._id, function(err, user) {
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

// static file serving 
app.use(express.static('public'))

// routes
const users = require('./routes/users');
const smsBackend = require('./routes/smsBackend');
const listUser = require('./routes/listUser');
const device = require('./routes/device')


// init super user
User.find({}, (err,user) => {
    console.log("Init state Users - ",user);
    
    if(err) throw err;
    if(user.length === 0){
        let newUser = new User({
            name : "root",
            mobileNumber: 1234567890,
            email : "root@root.com",
            userType : "super",
            username : "root",
            password : "grunroot",
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
// app.use('/cowfarm', cowfarm)
app.use('/device', device)


// app loop
app.get('/', (req,res) => { // home '/' response
    res.json({status:'working'});
});


const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => {
	console.log('HTTPS Server running on port 443');
});
// app.listen(port, () => {
//     if(mode_config.mode == "dev"){
//         console.log('server started at port ' + port);
//     }
// });

// const tempRouter = require('./routes/device').tempRouter
// console.log(tempRouter)

// client.on('connect', () => {
//     client.subscribe('temp');
//     console.log("Mqtt connected");
// })

// client.on('message', (topic, message) => {
//     switch(topic){
//         case 'temp': {
//             tempRouter(client, message)
//             break;
//         }
//     }
// })


// mqtt switch on
const client = require('./mqtt/mqttHandle')