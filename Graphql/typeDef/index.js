const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Query {
        user: User
        login(email: String!, password: String!) : User
        resetPassword(email: String!) : User

        rooms(query: roomSearch, sortBy: [sortBy] ,page: Int, per_page: Int ): [Room]
        room (_id: ID!): Room
        deleteRoom(_id: ID!) : User!

        getAllMessageOfChatRoom (_id: ID!): [MessageContent]
        getAllChatRooms: [chatRoom]

    }

    type Mutation {
        createUser(email: String!) : User
        updateUser(profile: userInput) : User
        likedRoom(_idRoom: ID!) : User

        createRoom(room: roomInput ) : Room!
        updateRoom(_id: ID!, room: roomInput, imagesName: [String]) : Room!
      
        createRoomChat (userID: ID!) : chatRoom
        sendMessage(data: messagesInput) : MessageContent
        itRead(_idMessages: ID!) : [MessageContent]
    }


    type Image {
       url: String!
    }

    type Subscription {
        newMessage: MessageContent!
        readMessage: [MessageContent]
    }

    type User {
        email: String
        token: String
        _id: ID!
        refreshToken: String
        expiresIn: Int
        created: [Room]
        liked: [Room]
        avatar: String
        phone: String
        name: String
    }

    input roomSearch {
        sex: Int
        type: Int
        roomNum: Int
        peoples: Int
        maxPrice: Int
        minPrice: Int
        addressName: addressNameInput
        longitude: Float
        latitude: Float
        multiDistricts: [String],
        utilities: [Int]
    }

    input sortBy {
        key: String,
        value: Boolean
    }

    input userInput {
        name: String 
        avatar: Upload
        password: String
        newPassword: String
        phone: String
    }

    type Room {
        _id: ID!
        sex: Int!
        createdBy: User!
        address: Address
        images: [String]!
        price: Price!
        roomNum: Int!
        peoples: Int!
        hired: Boolean
        name: String
        type: Int!
        createdAt: String
        acreage: Float
        utilities: [Int]
        phone: String
        roomName: String
        description: String
    }

    type Address {
        loc: loc
        name: addressName
    }

    input locInput{
        coordinates: [Float]
    }

    type loc{
        coordinates: [Float]
    }
   
    type addressName {
        city: String,
        districts: String,
        wardsAndStreet: String,
        any: String
    }

    input addressNameInput {
        city: String,
        districts: String,
        wardsAndStreet: String,
        any: String
    }

    type Price {
        water: currentPriceOutput
        electricity: currentPriceOutput
        room: currentPriceOutput
        internet: currentPriceOutput
    }

    input currentPrice {
        free: Boolean
        price: Int
    }

    type currentPriceOutput {
        free: Boolean
        price: Int
    }

    
    input addressInput {
        loc: locInput
        name: addressNameInput
    }

    input priceInput {
        water: currentPrice
        electricity: currentPrice
        room: currentPrice
        internet: currentPrice
    }

    input roomInput {
        sex: Int
        type: Int
        address: addressInput
        images: [Upload]
        roomNum: Int
        peoples: Int
        hired: Boolean
        acreage: Int
        utilities: [Int]
        price: priceInput
        phone: String
        roomName: String
        description: String
    }

    type chatRoom {
        messages: [MessageContent],
        members: [User!]
        lastMessage: MessageContent,
        _id: ID
    }

    type MessageContent {
        chatRoom: ID!,
        messageBody: String,
        from: User,
        to: User,
        createdAt: String,
        messageStatus: Boolean   
    }

    input messagesInput {
        chatRoom: ID!,
        messageBody: String!,
        to: ID!
    }

    type localAddress {
        code: String,
        name: String,
        districts: [Districts]
    }

    type streetsOrWards {
        name: String,
        prefix: String
    }

    type Districts {
        name: String,
        streets: [streetsOrWards],
        wards: [streetsOrWards]
    }

`;

module.exports = typeDefs;

