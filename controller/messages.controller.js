const chatRoomModel = require('../model/chatRooms.model');
const messageModal = require('../model/message.model');
const mongoose = require('mongoose');

const { getMessagesOfChatRoom, getUserSendMessage, getMembers } = require('../helpers');

module.exports = {
    createRoomChat: async (data) => {
        try {
            let members = data.map(userId => mongoose.Types.ObjectId(userId));
            let newChatRoom = new chatRoomModel({ members })
            let checkChatRoom = await chatRoomModel.findOne({ $and: [{ members: members[0] }, { members: members[1] }] })
            if (!checkChatRoom) {
                await newChatRoom.save()
                return newChatRoom
            }
            return checkChatRoom

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
                    messages: () => getMessagesOfChatRoom(chatRoom._doc.messages),
                    members: () => getMembers(chatRoom._doc.members)
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
            let allMessages = await messageModal.find({ chatRoom: _id })
            return allMessages.map(message => {
                return {
                    ...message._doc,
                    from: () => getUserSendMessage(message._doc.from),
                    to: () => getUserSendMessage(message._doc.to),
                }
            })
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