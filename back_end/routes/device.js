const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/users/User');
const Device = require('../models/device/Device');
const DeviceTemp = require('../models/device/deviceTemp');
const config = require('../config/database');
const publish = require('../mqtt/mqttHandle').publishCustom
const waitAck = require('../mqtt/mqttHandle').waitAck


router.post('/createDevice',passport.authenticate('jwt', {session: false}), (req,res,next) => {
    if(!req.user) {
        res.json({success:false, msg: "User not found"});
    }
    else if(!req.body.mac){
        res.json({success:false, msg:"No mac given"});
        next()
    } else {
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


router.post('/settings', passport.authenticate('jwt',{session:false}), (req,res,next) => {
    Device.findOne({user: req.user._id},(err,doc) => {
        if(err) console.log(err);
        if(!req.body.settings){
            res.json({success:false,msg: "no settings given"});
        } else {
            doc.ack = false;
            doc.settings = JSON.stringify(req.body.settings);
            console.log(req.body.settings)
            doc.save((err) => {
                console.log(err);
                publish('settings/'+doc.mac,JSON.stringify(req.body.settings));
                res.json({success: true, msg: "published"});
            });

        }
    })
    
})

router.get('/settingsAck', passport.authenticate('jwt',{session:false}), (req,res,next) => {
    Device.findOne({user:req.user._id},(err,doc) => {
        if(err) console.log(err);
        if(doc.ack){
            res.json({success:true,msg:true});
        } else{
            res.json({success:true,msg:false}); 
        }
        
    })
})



router.get('/lastTemp', passport.authenticate('jwt',{session:false}), (req,res,next) => {
    console.log('lastTemp hit')
    if(!req.user) {
        res.json({success: false, msg : "User not authernticated"});
    } else {
        Device.findOne({user : req.user._id},(err,dev) => {
            console.log(dev.mac)
            if(err) {
                console.log(err);
                res.json({success: false,msg : "Internal err"});
            } else {
                DeviceTemp.findOne({},{},{ sort: {'timeStamp' : -1}}, (err,post) => {
                    res.json(post)
                })
            }
        })
    }
})

router.post('/avgTempWeek', passport.authenticate('jwt',{session:false}), (req,res,next) => {
    if(!req.user) {
        res.json({success: false, msg : "User not authernticated"});
    } else {
        Device.findOne({user : req.user._id},(err,dev) => {
            console.log(dev.mac)
            if(err) {
                console.log(err);
                res.json({success: false,msg : "Internal err"});
            } else {
                var givenDate = req.body.givenDate;
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

                DeviceTemp.find({mac: dev.mac, timeStamp : {$gte: less, $lte: more}},(err,docs) => {
                    if(err){
                        console.log(err);
                        res.json({success: false, msg: "Internal error"});
                    } else {
                        res.json({success: true, docs : docs}); 
                    }
                    
                })
            }
        })
    }
})



router.post('/avgTempDay', passport.authenticate('jwt',{session:false}), (req,res,next) => {
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


router.post('/avgTempHour', passport.authenticate('jwt',{session:false}), (req,res,next) => {
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


module.exports.tempRouter = (client, message) => {
    message = message.toString().split(" ");
    const mac = message[0] ? message[0] : "0";
    const temp = (message[1]) ? parseInt(message[1]) : false;
    const route = 'tempResponse/' + mac;

    Device.findOne({mac:mac},(err,doc) => {
        if(err){
            console.log(err);
            client.publish(route, 'Failure',(err) => {
                if(err) console.log(err);
            });
        } else if (!doc) {
            console.log("Mac not found");
            client.publish(route, 'Failure',(err) => {
                if(err) console.log(err);
            });
        } else {
            if(typeof(temp) == 'number'){
                let data = {
                    mac : mac,
                    temp : temp
                }
            
                DeviceTemp.create(data,(err) => {
                    if (err) { throw err };
                });
                console.log(message);
                client.publish(route ,'success',(err) => {
                    if (err) console.log(err);
                });
            } else {
                client.publish(route, 'Failure',(err) => {
                if(err) console.log(err);
            })
        }
        }
    })    
}

module.exports.settingsAckRouter = (client, message) => {
    console.log('ack from device')
    message = message.toString().split(" ");
    const mac = message[0] ? message[0] : "0";
    const route = 'settingsResponse/' + mac;

    Device.findOne({mac:mac},(err,doc) => {
        if(err){
            console.log(err);
            publish(route, 'Failure');
        } else {
            publish(route, 'Success')
            doc.ack = true
            doc.save((err) => {
                if(err) console.log(err);
                console.log('ack saved')
            })
        }
    })    
}