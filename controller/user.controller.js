const userModel = require('../model/user.model');
const roomModel = require('../model/room.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const { getRoom } = require('../helpers');
const { UserInputError } = require('apollo-server-errors');
const handleSendMail = require("../helpers/sendMail")


module.exports = {
    create: async (user) => {
        try {
            let checkUser = await userModel.findOne({ email: user.email })
            if (checkUser) throw new UserInputError("Email already exists")
            await handleSendMail(user.email, user.password)
            let hashedPassword = await bcrypt.hash(user.password, 12)
            let newUser = new userModel({ ...user, password: hashedPassword })
            let token = await jwt.sign({ _id: newUser._doc._id, email: newUser._doc._email }, process.env.TOKEN_PASSWORD, { expiresIn: process.env.TOKEN_EXPIRATION })
            let refreshToken = await jwt.sign({ _id: newUser._doc._id }, process.env.REFRESH_TOKEN_PASSWORD, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION })
            newUser.refreshToken = refreshToken;
            await newUser.save()
            return {
                ...newUser._doc,
                password: null,
                token,
                expiresIn: process.env.TOKEN_EXPIRATION
            }
        } catch (error) {
            throw error
        }
    },

    login: async ({ email, password }) => {
        try {
            let checkUser = await userModel.findOne({ email })
            if (!checkUser) throw new UserInputError("Email not exists")
            const match = await bcrypt.compare(password, checkUser._doc.password);
            if (!match) throw new UserInputError("Incorrect password")
            let refreshToken = await jwt.sign({ _id: checkUser._doc._id }, process.env.REFRESH_TOKEN_PASSWORD, { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRATION}h` })
            let token = await jwt.sign({ _id: checkUser._doc._id, email: checkUser._doc._email }, process.env.TOKEN_PASSWORD, { expiresIn: `${process.env.TOKEN_EXPIRATION}h` })
            await checkUser.update({}, { $set: { refreshToken } })
            return {
                ...checkUser._doc,
                password: null,
                token,
                expiresIn: process.env.TOKEN_EXPIRATION
            }

        } catch (error) {
            throw error
        }
    },

    resetPassword: async ({ email, password }) => {
        try {
            let checkUser = await userModel.findOne({ email })
            if (!checkUser) throw new UserInputError("Email not exists")
            await handleSendMail(email, password)
            let hashedPassword = await bcrypt.hash(password, 12)
            let userUpdated = await userModel.findByIdAndUpdate({ _id: checkUser._doc._id }, { $set: { password: hashedPassword } }, { new: true })
            return {
                ...userUpdated._doc,
                password: null
            }
        } catch (error) {
            throw error
        }
    },

    update: async (_id, data) => {

        let { password, avatar, newPassword } = data

        if (password && newPassword) {
            let newPasswordEncode = await bcrypt.hash(newPassword, 12);
            data = { ...data, password: newPasswordEncode }
        }
        try {
            let userUpdated;
            if (avatar) {
                userUpdated = await userModel.findByIdAndUpdate({ _id }, { $set: { ...data, avatar } }, { new: true })
            } else if (newPassword) {
                let checkUser = await userModel.findById({ _id });
                const match = await bcrypt.compare(password, checkUser._doc.password);
                if (!match) throw new UserInputError("Incorrect password")
                userUpdated = await userModel.findByIdAndUpdate({ _id }, { $set: { ...data } }, { new: true })
            } else {
                userUpdated = await userModel.findByIdAndUpdate({ _id }, { $set: { ...data } }, { new: true })
            }
            return {
                ...userUpdated._doc,
                password: null
            }
        } catch (error) {
            throw error
        }
    },

    user: async (_id) => {
        try {
            let user = await userModel.findById({ _id })
            return {
                ...user._doc,
                password: null,
                created: () => getRoom(user._doc.created),
                liked: () => getRoom(user._doc.liked)
            }
        } catch (error) {
            throw error
        }
    },

    liked: async (userId, roomId) => {
        try {
            let checkRoomLiked = await userModel.findOne({ _id: userId, liked: roomId })
            if (!!checkRoomLiked) {
                await userModel.updateOne({ _id: userId }, { $pull: { "liked": roomId } })
            }
            else {
                await userModel.findByIdAndUpdate({ _id: userId }, { $push: { "liked": roomId } }, { upsert: true, new: true })
            }
            let user = await userModel.findOne({ _id: userId })
            return {
                ...user._doc,
                created: () => getRoom(user._doc.created),
                liked: () => getRoom(user._doc.liked)
            }
        } catch (error) {
            throw error
        }
    },

    refreshToken: async (accessToken) => {
        try {
            let user = await userModel.findOne({ refreshToken: accessToken })
            if (user) {
                await jwt.verify(accessToken, process.env.REFRESH_TOKEN_PASSWORD)
                let token = await jwt.sign({ _id: checkUser._doc._id, email: checkUser._doc._email }, process.env.TOKEN_PASSWORD, { expiresIn: `${process.env.TOKEN_EXPIRATION}h` })
                return {
                    ...user._doc,
                    password: null,
                    token,
                    expiresIn: process.env.TOKEN_EXPIRATION
                }
            }
        } catch (error) {
            throw error
        }
    }
}