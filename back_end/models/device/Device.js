const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new mongoose.Schema({
    mac : {
        type : String,
        required : true
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});

const Device = module.exports = mongoose.model('Device', DeviceSchema);