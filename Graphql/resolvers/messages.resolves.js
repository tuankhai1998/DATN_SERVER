const { AuthenticationError } = require("apollo-server-errors");

const messagesController = require("../../controller/messages.controller");



module.exports = {
    Query: {
        messages: (_, { from }, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let messages = messagesController.messages(from)
            return messages
        }
    },

    Mutation: {
        sendMessage: async (_, { data }, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let messages = messagesController.sendMessages(data)
            context.pubsub.publish('NEW_MESSAGE', { newMessage: messages })
            return messages
        }

    },

    Subscription: {
        newMessage: {
            subscribe: (_, __, { pubsub, isAuth }) => {
                if (!isAuth) throw new AuthenticationError("unauthorized")
                return pubsub.asyncIterator(['NEW_MESSAGE'])
            }
        }
    }
}

