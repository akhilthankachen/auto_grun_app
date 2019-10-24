const CowFarm = require('../models/cowfarm/CowFarm')
const express = require('express');
const router = express.Router();

router.get('/lastTemp', (req,res,next) => {
    CowFarm.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
        res.json(post)
    });
})

module.exports = router;