const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const superUser = require('../models/users/superUser');

//Register

router.post('/register', (req,res,next) => {

  console.log(req.body);

  let newUser = new superUser({
    name: req.body.name,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email,
    userType: req.body.userType,
    username: req.body.username,
    password: req.body.password,
    clusterId: req.body.clusterId
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    }else{
      res.json({success: true, msg:'User registered'});
    }
  });

});

//Authenticate

router.post('/authenticate', (req,res,next) => {
  const username = req.body.username;
  console.log('i was here '+username);
  const password = req.body.password;

  superUser.getUserByUsername(username, (err, user) => {
    if (err){
      throw err;
    }
    if(!user){
      return res.json({success: false, msg:"User not found"});
    }

    SuperUser.comparePassword(password, user.password, (err, isMatch) => {
      if(err){
        throw err;
      }
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            userType: user.userType
          }
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