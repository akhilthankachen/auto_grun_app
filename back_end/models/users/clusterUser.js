const mongoose = require('mongoose');

const clusterUser = new mongoose.Schema({
    name: {
        type: String,
        default: '',
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('clusterUser', clusterUser);

