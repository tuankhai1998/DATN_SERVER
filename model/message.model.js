const { Schema, model } = require('mongoose');

const messageContentModel = new Schema({
    content: String,
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

module.exports = model('MessageContent', messageContentModel)