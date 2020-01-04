const mongoose = require('mongoose');

const DeviceAvgTempSchema = new mongoose.Schema({
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


const DeviceAvgTemp = module.exports = mongoose.model('DeviceAvgTemp', DeviceAvgTempSchema);

module.exports.create = (data,cb) => {
    let dtemp = new DeviceAvgTemp();
    let now = Date.now();

    dtemp.mac = data.mac;
    dtemp.temp = data.temp;
    dtemp.timeStamp = now;
    dtemp.save(cb);
}