const userModel = require('../model/user.model');
const roomModel = require('../model/room.model');

const { getUserCreated, getRoom } = require("../helpers")


module.exports = {
    create: async (userId, data) => {

        console.log(data.address)
        let newRoom = new roomModel({ ...data, createdBy: userId })
        try {
            let createdRoom = await newRoom.save()
            await userModel.findByIdAndUpdate({ _id: userId }, { $push: { "created": newRoom._doc._id } }, { upsert: true, new: true })
            return {
                ...createdRoom._doc,
                createdBy: () => getUserCreated(newRoom._doc.createdBy),
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    update: async (data) => {
        try {
            let roomUpdated = await roomModel.findByIdAndUpdate({ _id: data._id }, { $set: data }, { new: true })
            return {
                ...roomUpdated._doc,
                createdBy: () => getUserCreated(roomUpdated._doc.createdBy),
            }
        } catch (error) {
            throw error
        }
    },

    currentRoom: async (_id) => {
        try {
            let room = await roomModel.findById({ _id });

            console.log(room)
            return {
                ...room._doc,
                createdBy: () => getUserCreated(room._doc.createdBy),
            }
        } catch (error) {
            throw error
        }
    },

    rooms: async (args) => {
        let { page, per_page, sex, type, addressName, roomNum, peoples, maxPrice, minPrice, sort, longitude, latitude, multiDistricts } = args;

        let checkSearch = () => {
            let dataSearch = {};
            if (sex) dataSearch = { ...dataSearch, sex };
            if (type) dataSearch = { ...dataSearch, type };
            if (peoples) dataSearch = { ...dataSearch, peoples: { $gte: peoples } };
            if (maxPrice) dataSearch = { ...dataSearch, 'price.room.price': { $lte: maxPrice * 1000000 } };
            if (minPrice) dataSearch = { ...dataSearch, 'price.room.price': { $get: minPrice * 1000000 } };
            if (roomNum) dataSearch = { ...dataSearch, roomNum: { $gte: roomNum } };
            return dataSearch
        }

        let dataSearch = await checkSearch()
        if (!page) page = 0;
        let skip = page > 0 ? (page - 1) * per_page : page * per_page;
        let checkAddress = () => {
            let addressSearch = {};
            if (addressName) {
                let { city, districts, wardsAndStreet, any } = addressName;
                if (city) addressSearch = { 'address.name.city': city };
                if (districts) addressSearch = { ...addressSearch, 'address.name.districts': districts };
                if (wardsAndStreet) addressSearch = { ...addressSearch, 'address.name.wardsAndStreet': wardsAndStreet };
            }
            return addressSearch;
        }

        let addressNameSearch = await checkAddress();

        try {
            let rooms;
            if (addressName) {
                rooms = await roomModel.find({ ...dataSearch, ...addressNameSearch }).sort(sort).limit(per_page).skip(skip)
            } else if (longitude && latitude) {
                rooms = await roomModel.aggregate(
                    [
                        {
                            "$geoNear": {
                                "near": {
                                    "type": "Point",
                                    "coordinates": [longitude, latitude]
                                },
                                "distanceField": "distance",
                                "spherical": true,
                                "maxDistance": 1000,
                            },

                        },
                        { "$sort": { "distance": 1 } },
                    ]
                ).limit(per_page).skip(skip)

                return rooms.map(room => ({
                    ...room,
                    createdAt: () => `${new Date(room._doc.createdAt)}`,
                    createdBy: () => getUserCreated(room._doc.createdBy)
                }))
            } else if (multiDistricts) {
                rooms = await roomModel.find({ 'address.name.districts': { $in: [...multiDistricts] }, ...dataSearch }).sort(sort).limit(per_page).skip(skip)
            }
            else { rooms = await roomModel.find({ ...dataSearch }).sort(sort).limit(per_page).skip(skip) }
            return rooms.map(room => ({
                ...room._doc,
                createdAt: () => `${new Date(room._doc.createdAt)}`,
                createdBy: () => getUserCreated(room._doc.createdBy)
            }))
        } catch (error) {
            throw error
        }
    },

    delete: async (_id, userId) => {
        try {
            let userUpdated = await userModel.findOneAndDelete({ _id: userId }, { $pull: { created: _id } })
            await roomModel.findOneAndDelete({ _id, createdBy: userId });
            return {
                ...userUpdated._doc,
                created: () => getRoom(userUpdated._doc.created),
                liked: () => getRoom(userUpdated._doc.like)
            }
        } catch (error) {
            throw error
        }
    },
}