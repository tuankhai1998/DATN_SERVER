const { Schema, model } = require('mongoose');

const roomModel = new Schema({
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
        name: String
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
        type: Schema.Types.ObjectId,
        ref: 'Prices'
    },
},
    { timestamps: { createdAt: 'created_at' } }
)

module.exports = model('Rooms', roomModel)