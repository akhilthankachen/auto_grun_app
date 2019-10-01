const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/users/User');
const config = require('../config/database');

//Register

router.post('/register', (req,res,next) => {

  let newUser = new User({
    name: req.body.name,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email,
    userType: req.body.userType,
    username: req.body.username,
    password: req.body.password,
    clusterId: req.body.clusterId
  });

  User.getUserByUsername(req.body.username, (err, user) => {
    if (user) {
      res.json({success: false, msg:'User already exist'});
    }else{
      User.addUser(newUser, (err, user) => {
        if(err){
          res.json({success: false, msg:'Failed to register user. Try again !'});
        }else{
          res.json({success: true, msg:'User registered'});
        }
      });
    }
  });

});

//Authenticate

router.post('/authenticate', (req,res,next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err){
      console.log(err);
    }
    if(!user){
      return res.json({success: false, msg:"User not found"});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err){
        res.json({success: false, msg:'ERROR, Could not login'});
      }
      if(isMatch){
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token
        });
      }else {
        return res.json({success: false, msg:'Wrong password'});
      }
    });
  });
});

//Profile

router.get('/profile',passport.authenticate('jwt', {session: false}), (req,res,next) => {
  res.json({user: req.user});
});

module.exports = router;