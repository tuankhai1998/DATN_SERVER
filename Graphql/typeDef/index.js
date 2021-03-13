const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type Query {
        rooms : [Room]
    }

    type Mutation {
        createUser(email: String!, password : String!) : User
        login(email : String!, password : String!) : User
        updateUser(email: String, avatar: String , password: String) : User

    }

    type User {
        email : String
        token : String
        _id: ID!
        refreshToken: String
        expiresIn: Int
        created: [Room]
        liked : [Room]
    }

    input userInput {
        email   : String 
        avatar  : String
        password : String
    }

    type Room {
        _id: ID!
    }

`;

module.exports = typeDefs;

