const { Schema, model } = require('mongoose');

const priceModel = new Schema({
    water: {
        free: Boolean,
        price: Number
    },
    electricity: {
        free: Boolean,
        price: Number
    },
    room: {
        free: Boolean,
        price: Number
    },
    internet: {
        free: Boolean,
        price: Number
    },
})

module.exports = model('Prices', priceModel)