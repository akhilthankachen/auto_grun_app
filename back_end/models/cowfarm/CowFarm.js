const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CowFarmSchema = new mongoose.Schema({
    deviceName: {
        type: String,
        default: '',
        required: true
    },
    messageType: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        default: Date.now
    }
});

const CowFarm = module.exports = mongoose.model('CowFarm', CowFarmSchema);

