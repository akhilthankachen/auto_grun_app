const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceTempSchema = new mongoose.Schema({
    mac : {
        type : String,
        required : true
    },
    temp : {
        type : Number,
        required : true
    }
});

const DeviceTemp = module.exports = mongoose.model('DeviceTemp', DeviceTempSchema);