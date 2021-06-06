const { Schema, model } = require('mongoose');

const chatRoom = new Schema({
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        }
    ],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'MessageContent'
    }],
})

module.exports = model('ChatRooms', chatRoom)