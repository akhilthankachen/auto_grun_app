const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const farmSchema = new mongoose.Schema({
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
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Farm = module.exports = mongoose.model('Farm', farmSchema);

