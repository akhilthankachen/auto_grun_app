const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
    farmId: {
        type: String,
        required: true
    },
    zoneName: {
        type: String,
        default: ''
    }
});

const Zone = module.exports = mongoose.model('Zone', zoneSchema);

