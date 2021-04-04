const { Schema, model } = require('mongoose');

const roomModel = new Schema({
    hired: {
        type: Boolean,
        default: false
    },
    type: {
        type: Number,
        required: true
    },
    sex: {
        type: Number,
        required: true
    },
    address: {
        longitude: Number,
        latitude: Number,
        name: {
            city: String,
            districts: String,
            wardsAndStreet: String,
            any: String
        }
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    roomNum: Number,
    peoples: Number,
    price: {
        water: {
            free: Boolean,
            price: Number
        },
        electricity: {
            free: Boolean,
            price: Number
        },
        room: {
            free: Boolean,
            price: Number
        },
        internet: {
            free: Boolean,
            price: Number
        },
    },
},
    { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)
roomModel.index({ 'address.name.$**': 'text' })

module.exports = model('Rooms', roomModel)