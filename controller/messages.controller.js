const chatRoomModel = require('../model/chatRooms.model');
const messageModal = require('../model/message.model');
const mongoose = require('mongoose');

const { getMessagesOfChatRoom, getUserSendMessage } = require('../helpers');

module.exports = {
    createRoomChat: async (data) => {
        let members = data.map(userId => mongoose.Types.ObjectId(userId));
        let newChatRoom = new chatRoomModel({ members })
        try {
            let checkChatRoom = await chatRoomModel.aggregate([{ $match: { members } }])
            if (checkChatRoom.length < 1) {
                await newChatRoom.save()
                return newChatRoom
            }

        } catch (error) {
            throw error
        }
    },

    getAllChatRooms: async (_id) => {
        let membersID = mongoose.Types.ObjectId(_id);
        try {
            let allChatRoom = await chatRoomModel.find({ 'members': membersID })
            return allChatRoom.map(chatRoom => (
                {
                    ...chatRoom._doc,
                    messages: () => getMessagesOfChatRoom(chatRoom._doc.messages)
                }
            ))
        } catch (error) {
            throw error
        }

    },

    sendMessages: async (data) => {
        let { chatRoom, from, messageBody, to } = data;
        let newMessage = new messageModal(data)

        try {
            let message = await newMessage.save()
            await chatRoomModel.findByIdAndUpdate({ _id: chatRoom }, { $push: { "messages": newMessage._doc._id } }, { upsert: true, new: true })
            return {
                ...message._doc,
                from: () => getUserSendMessage(message._doc.from),
                to: () => getUserSendMessage(message._doc.to),
            }
        } catch (error) {
            throw error
        }
    },

    messages: async (_id) => {
        try {
            let allMessages = await chatRoomModel.find({ $or: [{ from: _id }, { to: _id }] })
            return allMessages
        } catch (error) {
            throw error
        }
    },

    itRead: async (_idMessages, _id) => {
        try {
            let update = await chatRoomModel.findById({ _id: _idMessages })
            return update
        } catch (error) {
            throw error
        }
    }
}