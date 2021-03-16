const userModel = require('../model/user.model');
const roomModel = require('../model/room.model');
const priceModel = require('../model/price.model');

const { getUserCreated } = require("../helpers")


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
            let roomUpdated = await roomModel.findByIdAndUpdate({ _id }, { $set: data })
            return {
                ...roomModel._doc,
                createdBy: getUserCreated(roomUpdated._doc.createdBy)
            }
        } catch (error) {
            throw error
        }
    },

    currentRoom: () => {

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
    }
}