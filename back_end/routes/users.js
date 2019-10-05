const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/users/User');
const config = require('../config/database');

//Register

router.post('/register', passport.authenticate('jwt', {session: false}),(req,res,next) => {
  console.log("Register --- User - ",req.user);

  if(req.user.userType === "end"){
    res.json({success: false, msg:'Not authorised'});
  } 


  else if(req.user.userType == "mid"){
    let newUser = new User({
      name: req.body.name,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      userType: "end",
      username: req.body.username,
      password: req.body.password,
      ownerId: req.user._id
    });
    console.log("(IF MID) User - ",req.body);

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
  } 



  else if(req.user.userType === "super"){
    if(req.body.userType !== "super" && req.body.userType !== "mid" && req.body.userType !== "end"){
      res.json({success: false,msg:'Usertype notdefined'});
    } else {
      let newUser = new User({
        name: req.body.name,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        userType: req.body.userType,
        username: req.body.username,
        password: req.body.password,
        ownerId: req.user._id
      });
      console.log("(IF SUPER) User - ",req.body);
      

      User.getUserByUsername(req.body.username, (err, user) => {
        if (user) {
          res.json({success: false, msg:'User already exist'});
        }else{
          User.getUserByEmail(req.body.email, (err,user) => {
            if(err) throw err;
            if(user) {
              res.json({success: false, msg:'Email already exists'});
            } else {
              User.addUser(newUser, (err, user) => {
                if(err){
                  res.json({success: false, msg:'Failed to register user. Try again !'});
                }else{
                  res.json({success: true, msg:'User registered'});
                }
              });
            }
          })

        }
      });
    }
  }

  else {
    console.log("Fatal error. Usertype Unkown");
    res.json({success: false,msg:'Error'});
  }

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////

//Authenticate

router.post('/authenticate', (req,res,next) => {
  console.log("Authenticate",req.body);
  
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

/////////////////////////////////////////////////////////////////////////////////////////

//Profile

router.get('/profile',passport.authenticate('jwt', {session: false}), (req,res,next) => {
  res.json({user: req.user});
});

module.exports = router;