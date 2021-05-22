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
        loc: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: [Number]
        },
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
    acreage: Number,
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
            free: {
                type: Boolean,
                default: true
            },
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
roomModel.index({ 'address.loc': "2dsphere" })

module.exports = model('Rooms', roomModel)