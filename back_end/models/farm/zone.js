const mongoose = require('mongoose');

const Zone = new mongoose.Schema({
    farmId: {
        type: String,
        required: true
    },
    zoneName: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Zone', Zone);

