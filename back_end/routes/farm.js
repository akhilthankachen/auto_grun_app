const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/users/User');
const Farm = require('../models/users/Farm');
const config = require('../config/database');

router.post('/addFarm',passport.authenticate('jwt', {session: false}), (req,res,next) => {
  res.json({user: req.user});
  let farm = new Farm({
    name : req.body.name,
    mobileNumber : req.body.mobileNumber,
    location : {
        address : req.body.address,
        street : req.body.street,
        landmark : req.body.landmark,
        
    }
  })
});