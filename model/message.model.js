const { Schema, model } = require('mongoose');

const messageContentModel = new Schema({
    chatRoom: {
        type: Schema.Types.ObjectId,
        ref: 'ChatRooms'
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    messageBody: String,
    messageStatus: { type: Boolean, default: false },
},
    { timestamps: { createdAt: 'createdAt' } }
)

module.exports = model('MessageContent', messageContentModel)