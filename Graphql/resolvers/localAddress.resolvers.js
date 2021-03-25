const localAddressController = require("../../controller/localAddress.controller")

module.exports = {
    Query: {
        localAddress: () => {
            let localAddress = localAddressController.getLocalAddress()
            return localAddress;
        }
    },

    Mutation: {

    }
}
