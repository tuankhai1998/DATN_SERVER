const userModel = require('../model/user.model');
const roomModel = require('../model/room.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

let refreshTokenSave = []

module.exports = {
    create: async (user) => {
        try {
            let checkUser = await userModel.findOne({ email: user.email })
            if (checkUser) throw new Error("Email already exists")
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
            if (!checkUser) throw new Error("Email not exists")
            const match = await bcrypt.compare(password, checkUser._doc.password);
            if (!match) throw new Error("Incorrect password")
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

    update: async (_id, data) => {

        let { password } = data
        if (password) {
            let newPassword = await bcrypt.hash(password, 12);
            console.log(newPassword)
            data = { ...data, password: newPassword }
        }
        console.log(data)
        try {
            let userUpdated = await userModel.findByIdAndUpdate({ _id }, { $set: { ...data } })
            return {
                ...userUpdated._doc,
                password: null
            }
        } catch (error) {
            throw error
        }
    }
}