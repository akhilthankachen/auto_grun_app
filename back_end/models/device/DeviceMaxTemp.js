const mongoose = require('mongoose');

const DeviceMaxTempSchema = new mongoose.Schema({
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


const DeviceMaxTemp = module.exports = mongoose.model('DeviceMaxTemp', DeviceMaxTempSchema);

module.exports.create = (data,cb) => {
    let dtemp = new DeviceMaxTemp();
    let now = Date.now();

    dtemp.mac = data.mac;
    dtemp.temp = data.temp;
    dtemp.timeStamp = now;
    dtemp.save(cb);
}