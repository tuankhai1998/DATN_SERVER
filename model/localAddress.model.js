const { Schema, model } = require('mongoose');

const localAddressModel = new Schema({
    code: String,
    name: String,
    districts: [
        {
            name: String,
            wards: [
                {
                    name: String,
                    prefix: String
                }
            ],
            streets: [
                {
                    name: String,
                    prefix: String
                }
            ]
        }
    ]
})

module.exports = model('localaddress', localAddressModel)