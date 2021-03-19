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

    messages: async (from) => {
        try {
            let allMessages = await messagesModel.find({ from })
            return allMessages
        } catch (error) {
            throw error
        }
    },

    itRead: async (form, to, userId) => {
        try {
            let update = await messagesModel.updateMany({ form, to: userId, read: false }, { $set: { read: true } }, { upsert: true })
            return update
        } catch (error) {
            throw error
        }
    }
}