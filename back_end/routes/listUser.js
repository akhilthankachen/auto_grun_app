const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/users/User');
const config = require('../config/database');

router.post('/listUser', passport.authenticate('jwt', {session: false}),(req,res,next) => {
  console.log("List User --- User - ",req.user);

  if(req.user.userType === "end"){
    res.json({success: false, msg:'Not authorised'});
  } 

  else if(req.user.userType === "mid"){
      User.find({ownerId : req.user.id},(err,users) => {
          if(err) {
              console.log(err);
              res.json({success: false, msg:"Internal error"})
          } else {
            res.json({success: true, msg:users});
          }
      })
  }
  
  else if(req.user.userType ==="super"){
      User.find({},(err,users) => {
          if(err) {
              console.log(err);
              res.json({success: false, msg:"Internal error"})
          } else {
            res.json({success: true, msg:users});
          }
      })
  }

  else {
      res.json({success: false, msg:"Invalid route"});
  }



});

module.exports = router;