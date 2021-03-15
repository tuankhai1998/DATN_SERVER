const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type Query {
        rooms : [Room]
        user : User
    }

    type Mutation {
        createUser(email: String!, password : String!) : User
        login(email : String!, password : String!) : User
        updateUser(email: String, avatar: String , password: String) : User

        createRoom(room: roomInput!) : Room!
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
        sex: Int!
        createdBy : User!
        address : Address
        images : [String]!
        price : Price!
        roomNum: Int!
        peoples: Int!
    }

    type Address {
        longitude : Float
        latitude : Float
        name : String
    }

    type Price {
        water: Int
        electricity: Int
        room: Int
        internet: Int
    }

    
    input addressInput {
        longitude : Float
        latitude : Float
        name : String
    }

    input priceInput {
        water: Int
        electricity: Int
        room: Int
        internet: Int
    }


    input roomInput {
        sex: Int!
        createdBy : ID!
        address : addressInput
        images : [String]!
        price : priceInput!
        roomNum: Int!
        peoples: Int!
    }

`;

module.exports = typeDefs;

