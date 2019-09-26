const mongoose = require('mongoose');

const ZoneStatus = new mongoose.Schema({
    zoneId: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    duration: {
        type: Number
    },
    cropId: {
        type: String
    },

});

module.exports = mongoose.model('ZoneStatus', ZoneStatus);

