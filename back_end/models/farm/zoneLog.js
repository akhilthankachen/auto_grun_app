const mongoose = require('mongoose');

const zoneLogSchema = new mongoose.Schema({
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

const ZoneLog = module.exports = mongoose.model('ZoneLog', zoneLogSchema);

