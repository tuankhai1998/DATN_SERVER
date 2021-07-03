const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const { withFilter } = require('apollo-server')

const messagesController = require("../../controller/messages.controller");

module.exports = {
    Query: {
        getAllMessageOfChatRoom: async (_, { _id }, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let messages = await messagesController.messages(_id)
            return messages
        },

        getAllChatRooms: (_, __, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let listChatRooms = messagesController.getAllChatRooms(context._id);
            return listChatRooms;
        }
    },

    Mutation: {
        createRoomChat: async (_, { userID }, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            if (userID == context._id) throw new UserInputError("Ko thể gửi tin nhắn cho bản thân!")
            let data = [userID, context._id]
            const newChatRoom = await messagesController.createRoomChat(data)
            return newChatRoom

        },

        sendMessage: async (_, { data }, context) => {
            if (!context.isAuth) throw new AuthenticationError("unauthorized")
            let messages = await messagesController.sendMessages({ ...data, from: context._id })
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

    },

    Subscription: {
        newMessage: {
            subscribe: withFilter((_, __, { pubsub, isAuth }) => {
                if (!isAuth) throw new AuthenticationError("unauthorized")
                return pubsub.asyncIterator(['NEW_MESSAGE'])
            }, async ({ newMessage }, _, { _id }) => {

                let from = await newMessage.from()
                let to = await newMessage.to()
                if (from._id == _id || to._id == _id) {
                    return true
                }
                return false
            })
        },

        readMessage: {
            subscribe: (_, __, { pubsub, isAuth }) => {
                if (!isAuth) throw new AuthenticationError("unauthorized")
                return pubsub.asyncIterator(['READ_MESSAGE'])
            }
        }
    }
}

