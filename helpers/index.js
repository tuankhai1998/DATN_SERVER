module.exports = {
    getUserCreated: async (userID) => {
        try {
            let user = await userModel.find({ _id: userID })
            return { ...user._doc, created: this.getRoom(user._doc.created) }
        } catch (error) {
            throw error
        }
    },

    getRoom: async (roomIds) => {
        try {
            let rooms = await roomModel.find({ _id: { $in: roomIds } })
            return rooms.map(room => ({
                ...room._doc,
                createdBy: this.getUserCreated(room._doc.createdBy)
            }))
        } catch (error) {
            throw error
        }
    }

}