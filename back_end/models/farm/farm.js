const mongoose = require('mongoose');

const Farm = new mongoose.Schema({
    name: {
        type: String,
        default: '',
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    location: {
        address: {
            type: String,
            required: true
        },
        street: {
            type: String
        },
        landmark: {
            type: String
        },
        pinNo: {
            type: Number,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true,
            default: 'india'
        }
    },
    userId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Farm', Farm);

