const messagesModel = require('../model/messages.model');

module.exports = {
    sendMessages: async (data) => {
        let newMessage = messagesModel(data)
        try {
            let message = await newMessage.save()
            return message
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
    }
}