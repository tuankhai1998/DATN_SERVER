const jwt = require('jsonwebtoken');
const { PubSub } = require('apollo-server-express');

const pubsub = new PubSub();

module.exports = (context) => {
    const { req, connection } = context
    let token;
    if (connection) {

        console.log("haahah")
        token = connection.context.Authorization.split(" ")[1]
    } else {
        const authHeader = req.headers.authorization;
        if (!authHeader) return { isAuth: false }
        token = authHeader.split(" ")[1]
    }

    if (!token || token === "") return { isAuth: false }

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_PASSWORD)
    } catch (error) {
        return { isAuth: false }
    }

    return { ...decodedToken, isAuth: true, pubsub }
}

