const localAddressModel = require('../model/localAddress.model');
const data = require('../DB/data')
module.exports = {
    getLocalAddress: async () => {
        try {
            let listLocalAddress = await localAddressModel.find();
            return listLocalAddress;
        } catch (error) {
            throw error
        }
    }
}