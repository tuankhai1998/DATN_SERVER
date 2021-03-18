const userModel = require('../model/user.model');
const roomModel = require('../model/room.model');
const priceModel = require('../model/price.model');

const { getUserCreated, getRoom } = require("../helpers")


module.exports = {
    create: async (userId, data) => {
        let price = new priceModel({ ...data.price })
        let newRoom = new roomModel({ ...data.room, createdBy: userId, price: price._doc._id })
        try {
            await newRoom.save()
            await price.save()
            await userModel.findByIdAndUpdate({ _id: userId }, { $push: { "created": newRoom._doc._id } }, { upsert: true, new: true })
            return {
                ...newRoom._doc,
                createdBy: getUserCreated(newRoom._doc.createdBy),
                price: { ...price._doc }
            }
        } catch (error) {
            throw error
        }
    },

    update: async (_id, data) => {
        try {
            let roomUpdated = await roomModel.findByIdAndUpdate({ _id }, { $set: data.room })
            let priceUpdated = await priceModel.findByIdAndUpdate({ _id: roomUpdated._doc._id }, { $set: data.price })
            return {
                ...roomModel._doc,
                createdBy: getUserCreated(roomUpdated._doc.createdBy),
                price: priceUpdated._doc
            }
        } catch (error) {
            throw error
        }
    },

    currentRoom: async (_id) => {
        try {
            let room = await roomModel.findById({ _id }).populate('price');
            return room
        } catch (error) {
            throw error
        }
    },

    rooms: async (page, per_page) => {
        let skip = page > 0 ? (page - 1) * per_page : page * per_page;
        try {
            let rooms = await roomModel.find().populate('price').limit(per_page).skip(skip)
            return rooms.map(room => ({
                ...room._doc,
                createdBy: getUserCreated(room._doc.createdBy)
            }))
        } catch (error) {
            throw error
        }
    },

    delete: async (_id, userId) => {
        try {
            let userUpdated = await userModel.findOneAndDelete({ _id }, { $pull: { created: _id } })
            let roomDeleted = await roomModel.findOneAndDelete({ _id, createdBy: userId });
            await priceModel.findByIdAndDelete({ _id: roomDeleted._doc.price })
            return {
                ...userUpdated._doc,
                created: getRoom(userUpdated._doc.created),
                liked: getRoom(userUpdated._doc.like)
            }
        } catch (error) {
            throw error
        }
    },
}