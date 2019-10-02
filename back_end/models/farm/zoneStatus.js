const mongoose = require('mongoose');

const zoneStatusSchema = new mongoose.Schema({
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

const ZoneStatus = module.exports = mongoose.model('ZoneStatus', zoneStatusSchema);

