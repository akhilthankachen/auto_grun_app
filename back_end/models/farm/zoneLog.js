const mongoose = require('mongoose');

const ZoneLog = new mongoose.Schema({
    zoneId: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    dateTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true
    },
    duration: {
        type: Number
    }
});

module.exports = mongoose.model('ZoneLog', ZoneLog);

