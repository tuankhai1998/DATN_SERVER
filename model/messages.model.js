const { Schema, model } = require('mongoose');

const messagesModel = new Schema({
    content: String,
    from: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    read: {
        type: Boolean,
        default: false
    }
},
    { timestamps: { createdAt: 'created_at' } }
)

module.exports = model('Messages', messagesModel)