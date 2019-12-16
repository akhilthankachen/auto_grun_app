const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/users/User');
const Device = require('../models/device/Device');
const config = require('../config/database');


router.post('/createDevice',passport.authenticate('jwt', {session: false}), (req,res,next) => {
    if(!req.user) {
        res.json({success:false, msg: "User not found"});
    }
    if(!req.body.mac){
        res.json({success:false, msg:"No mac given"});
        next()
    }else{
        Device.findOne({mac: req.body.mac},(err,doc) => {
            if(err){
                console.log(err);
                res.json({success: false, msg: "Internal error"});
            }
            if(doc){
                res.json({success: false, msg: "Mac exists"});
            } else {
                let device = new Device({
                    mac : req.body.mac,
                    user : req.user._id
                });
    
                device.save((err) => {
                    if(err){
                        console.log(err);
                        res.json({success: false,msg: "Internal error"});
                    } else {
                        res.json({success: true,msg: "Success"});
                    }
                })
            }
        })
    }
})




module.exports = router;
