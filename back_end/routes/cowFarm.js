const CowFarm = require('../models/cowfarm/CowFarm')
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jwt');
const Device = require('../models/device/Device'); 
const DeviceTemp = require('../models/device/deviceTemp');

router.get('/lastTemp', (req,res,next) => {
    CowFarm.findOne({}, {}, { sort: { 'dateTime' : -1 } }, function(err, post) {
        res.json(post)
    });
})

router.post('/avgTempWeek', passport.authenticate('jwt',{session:false}), (res,req,next) => {
    if(!req.user) {
        res.json({success: false, msg : "User not authernticated"});
    } else {
        Device.findOne({user : req.user._id},(err,dev) => {
            if(err) {
                console.log(err);
                res.json({success: false,msg : "Internal err"});
            } else {
                const givenDate = req.body.givenDate;
                console.log("req.body",req.body);
                if(!givenDate){
                    givenDate = new Date();
                }
    
                less = new Date(givenDate);
                more = new Date(givenDate);

                less.setDate(less.getDate()-less.getDay());
                less.setMilliseconds(0);
                less.setMinutes(0);
                less.setHours(0);
    
                more.setDate(less.getDate() + 6);
                more.setMilliseconds(999);
                more.setMinutes(59);
                more.setHours(23);
                console.log("less and more",less,more);

                DeviceTemp.find({mac: dev.mac, dateTime : {$gte: less, $lte: more}},(err,docs) => {
                    if(err){
                        console.log(err);
                        res.json({success: false, msg: "Internal error"});
                    } else {
                        let avg = 0;
                        for(var i = 0; i < docs.length; i++) {
                            avg += docs[i];
                        }
                        avg = avg / docs.length;
                        res.json({success: true, avg : avg}); 
                    }
                    
                })
            }
        })
    }
})



router.post('/avgTempDay', passport.authenticate('jwt',{session:false}), (res,req,next) => {
    if(!req.user) {
        res.json({success: false, msg : "User not authernticated"});
    } else {
        Device.findOne({user : req.user._id},(err,dev) => {
            if(err) {
                console.log(err);
                res.json({success: false,msg : "Internal err"});
            } else {
                const givenDate = req.body.givenDate;
                console.log("req.body",req.body);
                if(!givenDate){
                    givenDate = new Date();
                }
    
                less = new Date(givenDate);
                more = new Date(givenDate);

                // less.setDate(less.getDate()-less.getDay());
                less.setMilliseconds(0);
                less.setMinutes(0);
                less.setHours(0);
    
                // more.setDate(less.getDate() + 6);
                more.setMilliseconds(999);
                more.setMinutes(59);
                more.setHours(23);
                console.log("less and more",less,more);

                DeviceTemp.find({mac: dev.mac, dateTime : {$gte: less, $lte: more}},(err,docs) => {
                    if(err){
                        console.log(err);
                        res.json({success: false, msg: "Internal error"});
                    } else {
                        let avg = 0;
                        for(var i = 0; i < docs.length; i++) {
                            avg += docs[i];
                        }
                        avg = avg / docs.length;
                        res.json({success: true, avg : avg}); 
                    }
                    
                })
            }
        })
    }
})


router.post('/avgTempHour', passport.authenticate('jwt',{session:false}), (res,req,next) => {
    if(!req.user) {
        res.json({success: false, msg : "User not authernticated"});
    } else {
        Device.findOne({user : req.user._id},(err,dev) => {
            if(err) {
                console.log(err);
                res.json({success: false,msg : "Internal err"});
            } else {
                const givenDate = req.body.givenDate;
                console.log("req.body",req.body);
                if(!givenDate){
                    givenDate = new Date();
                }
    
                less = new Date(givenDate);
                more = new Date(givenDate);

                // less.setDate(less.getDate()-less.getDay());
                less.setMilliseconds(0);
                less.setMinutes(0);
                // less.setHours(0);
    
                // more.setDate(less.getDate() + 6);
                more.setMilliseconds(999);
                more.setMinutes(59);
                // more.setHours(23);
                console.log("less and more",less,more);

                DeviceTemp.find({mac: dev.mac, dateTime : {$gte: less, $lte: more}},(err,docs) => {
                    if(err){
                        console.log(err);
                        res.json({success: false, msg: "Internal error"});
                    } else {
                        let avg = 0;
                        for(var i = 0; i < docs.length; i++) {
                            avg += docs[i];
                        }
                        avg = avg / docs.length;
                        res.json({success: true, avg : avg}); 
                    }
                    
                })
            }
        })
    }
})


module.exports = router;