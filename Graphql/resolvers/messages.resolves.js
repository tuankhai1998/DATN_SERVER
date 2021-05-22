const { AuthenticationError } = require("apollo-server-errors");

const messagesController = require("../../controller/messages.controller");

module.exports = {
    Query: {
        messages: (_, { _id }, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let messages = messagesController.messages(_id)
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

        itRead: (_, { _idMessages }, context) => {
            let { _id, isAuth } = context;
            if (!isAuth) throw new AuthenticationError("unauthorized")
            let updateRead = messagesController.itRead(_idMessages, _id)
            context.pubsub.publish('READ_MESSAGE', { readMessage: updateRead })
            return updateRead
        },

        createMessages: (_, { }, context) => {

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

