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
            let newMessage = JSON.parse(JSON.stringify(data))
            let messages = await messagesController.sendMessages(newMessage)
            context.pubsub.publish('NEW_MESSAGE', { newMessage: messages })
            return messages

        },

        itRead: (_, { from, to }, context) => {
            let { _id, isAuth } = context;
            if (!isAuth) throw new AuthenticationError("unauthorized")
            let updateRead = messagesController.itRead(from, to, _id)
            context.pubsub.publish('READ_MESSAGE', { newMessage: updateRead })
            return updateRead
        }

    },

    Subscription: {
        newMessage: {
            subscribe: (_, __, { pubsub, isAuth }) => {
                if (!isAuth) throw new AuthenticationError("unauthorized")
                return pubsub.asyncIterator(['NEW_MESSAGE'])
            }
        },

        readMessage: {
            subscribe: (_, __, { pubsub, isAuth }) => {
                if (!isAuth) throw new AuthenticationError("unauthorized")
                return pubsub.asyncIterator(['READ_MESSAGE'])
            }
        }
    }
}

