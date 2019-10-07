const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/users/User');
const Farm = require('../models/users/Farm');
const config = require('../config/database');

router.post('/addFarm',passport.authenticate('jwt', {session: false}), (req,res,next) => {
  switch(req.user.userType){
    case "mid":
    case "super":
      {
        let farm = new Farm({
          name : req.body.name,
          mobileNumber : req.body.mobileNumber,
          location : {
              address : req.body.address,
              street : req.body.street,
              landmark : req.body.landmark,
              pinNo : req.body.pinNo,
              district : req.body.district,
              state : req.body.state,
              country : req.body.country
          },
          userId : req.user._id
        })

        Farm.findOne({mobileNumber:req.body.mobileNumber},(err,farm) => {
          if (err) {
            console.log(err);
            res.json({success:false,msg: "Internal Error"});
          }

          if(farm){
            res.json({success:false,msg:"Duplicate mobile number"});
          } else {
            farm.save((err) => {
              if(err) {
                console.log(err);
                res.json({success:false,msg: "Internal error"});
              } else {
                res.json({success:true,msg: "Farm saved"});
              }
            })

          }
        })

      }
      break;

    default : 
      {
        res.json({success:false,msg: "Not authorized"})
      }


  }

});