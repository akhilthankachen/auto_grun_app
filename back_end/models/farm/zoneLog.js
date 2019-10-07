const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const zoneLogSchema = new mongoose.Schema({
    zoneId: {
        type: Schema.Types.ObjectId,
        ref: "Zone"
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
        type: Schema.Types.ObjectId,
        ref: "ZoneStatus"
    },
    duration: {
        type: Number
    }
});

const ZoneLog = module.exports = mongoose.model('ZoneLog', zoneLogSchema);

