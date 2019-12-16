const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceMessageSchema = new mongoose.Schema({
    mac : {
        type : String,
        required : true
    },
    messageType : {
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true
    }
});

const DeviceMessage = module.exports = mongoose.model('DeviceMessage', DeviceMessageSchema);