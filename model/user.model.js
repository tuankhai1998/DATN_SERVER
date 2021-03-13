const { Schema, model } = require('mongoose');

const useModel = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: String,
    created: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Rooms'
        }
    ],
    liked: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Rooms'
        }
    ],
    refreshToken: String
})

module.exports = model('Users', useModel)