const userModel = require('../model/user.model');
const roomModel = require('../model/room.model');


const { getUserCreated, getRoom } = require("../helpers")


module.exports = {
    create: async (userId, data) => {
        let newRoom = new roomModel({ ...data.room, createdBy: userId, price: data.price })
        try {
            let createdRoom = await newRoom.save()
            await userModel.findByIdAndUpdate({ _id: userId }, { $push: { "created": newRoom._doc._id } }, { upsert: true, new: true })
            return {
                ...createdRoom._doc,
                createdBy: getUserCreated(newRoom._doc.createdBy),
            }
        } catch (error) {
            throw error
        }
    },

    update: async (_id, data) => {
        try {
            let roomUpdated = await roomModel.findByIdAndUpdate({ _id }, { $set: data.room })
            return {
                ...roomModel._doc,
                createdBy: getUserCreated(roomUpdated._doc.createdBy),
            }
        } catch (error) {
            throw error
        }
    },

    currentRoom: async (_id) => {
        try {
            let room = await roomModel.findById({ _id });
            return room
        } catch (error) {
            throw error
        }
    },

    rooms: async (args) => {
        let { page, per_page, sex, type, address, roomNum, peoples, maxPrice } = args;
        let checkSearch = () => {
            let dataSearch = {};
            if (sex) dataSearch = { ...dataSearch, sex };
            if (type) dataSearch = { ...dataSearch, type };
            if (address) dataSearch = { ...dataSearch, address };
            if (peoples) dataSearch = { ...dataSearch, peoples: { $gte: peoples } };
            if (maxPrice) dataSearch = { ...dataSearch, 'price.room.price': { $lte: maxPrice } };
            if (roomNum) dataSearch = { ...dataSearch, roomNum: { $gte: roomNum } };
            return dataSearch
        }
        let dataSearch = await checkSearch()

        if (!page) page = 0;
        let skip = page > 0 ? (page - 1) * per_page : page * per_page;
        try {
            let rooms = await roomModel.find({ ...dataSearch }).limit(per_page).skip(skip)
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
            await roomModel.findOneAndDelete({ _id, createdBy: userId });
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