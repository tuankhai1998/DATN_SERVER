const { Schema, model } = require('mongoose');

const messagesModel = new Schema({
    content: [{
        type: Schema.Types.ObjectId,
        ref: 'MessageContent'
    }],
    from: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
})

module.exports = model('Messages', messagesModel)