const mongoose = require('mongoose');

const DeviceMinTempSchema = new mongoose.Schema({
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


const DeviceMinTemp = module.exports = mongoose.model('DeviceMinTemp', DeviceMinTempSchema);

module.exports.create = (data,cb) => {
    let dtemp = new DeviceMinTemp();
    let now = Date.now();

    dtemp.mac = data.mac;
    dtemp.temp = data.temp;
    dtemp.timeStamp = now;
    dtemp.save(cb);
}