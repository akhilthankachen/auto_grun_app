const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const zoneSchema = new mongoose.Schema({
    farmId: {
        type: Schema.Types.ObjectId,
        ref: "Farm"
    },
    zoneName: {
        type: String,
        default: ''
    }
});

const Zone = module.exports = mongoose.model('Zone', zoneSchema);

