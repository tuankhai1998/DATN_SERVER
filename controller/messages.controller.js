const messagesModel = require('../model/messages.model');

module.exports = {
    sendMessages: async (data) => {
        let newMessage = new messagesModel({ ...data })
        try {
            await newMessage.save()
            return newMessage
        } catch (error) {
            throw error
        }
    },

    messages: async (_id) => {
        try {
            let allMessages = await messagesModel.find({ $or: [{ from: _id }, { to: _id }] })
            return allMessages
        } catch (error) {
            throw error
        }
    },

    itRead: async (_idMessages, _id) => {
        try {
            let update = await messagesModel.findById({ _id: _idMessages })
            
            return update
        } catch (error) {
            throw error
        }
    }
}