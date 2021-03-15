const userModel = require('../model/user.model');
const roomModel = require('../model/room.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const { getUserCreated } = require("../helpers")


module.exports = {
    create: async (userId, room) => {
        try {
            let newRoom = new roomModel({ ...room, createdBy: userId })
            await newRoom.save()
            await userModel.findByIdAndUpdate({ _id: userId }, { $push: newRoom._doc._id })
            return {
                ...newRoom._doc,
                createdBy: getUserCreated(userId)
            }
        } catch (error) {
            throw error
        }
    },

    update: async (_id, data) => {
        let { password } = data
        if (password) {
            let newPassword = await bcrypt.hash(password, 12);
            data = { ...data, password: newPassword }
        }
        try {
            let userUpdated = await userModel.findByIdAndUpdate({ _id }, { $set: { ...data } })
            return {
                ...userUpdated._doc,
                password: null
            }
        } catch (error) {
            throw error
        }
    },

    rooms: async (page, per_page) => {
        let skip = page > 0 ? (page - 1) * per_page : page * per_page;
        try {
            let rooms = await roomModel.find().limit(per_page).skip(skip)
            return {
                ...rooms._doc,
                createdBy: getUserCreated(rooms._doc.createdBy)
            }
        } catch (error) {
            throw error
        }
    }
}