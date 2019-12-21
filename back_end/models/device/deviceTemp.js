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
    },
    timeStamp : {
        type : Date,
        required : true
    }
});


const DeviceTemp = module.exports = mongoose.model('DeviceTemp', DeviceTempSchema);

module.exports.create = (data,cb) => {
    let dtemp = new DeviceTemp();
    let now = Date.now();

    dtemp.mac = data.mac;
    dtemp.temp = data.temp;
    dtemp.timeStamp = now;
    dtemp.save(cb);
}

// heelo