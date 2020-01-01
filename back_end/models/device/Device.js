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
    },
    ack : {
        type : Boolean,
        default: false
    },
    settings : {
        type: String
    },
    ping : {
        type: Boolean,
        default: false
    }
});

const Device = module.exports = mongoose.model('Device', DeviceSchema);