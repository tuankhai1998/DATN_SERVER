const localAddressModel = require('../model/localAddress.model');
module.exports = {
    getLocalAddress: async () => {
        try {
            let listLocalAddress = await localAddressModel.find().limit(3);
            return listLocalAddress;
        } catch (error) {
            throw error
        }
    }
}