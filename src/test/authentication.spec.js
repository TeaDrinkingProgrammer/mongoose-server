import requester from "./testSetup.spec.js";
import User from "../app/api/models/user.js"
import jwt from "jsonwebtoken";
import { getSession } from "../app/loaders/neo4j.js";
//Arrange

const testUser2 = {
    email: "henkdesteen@gmail.com",
    firstName: "Henk",
    lastName: "de Steen",
    password: "Passwistle7476("
}
const userEndpoint = "/api/auth"
describe("Authentication", () => {
    describe("Register", () => {
        const registerEndpoint = userEndpoint + "/register"
        it("Should return a valid response a user, when given a valid user", async function () {
            //Arrange
            const testUser = {
                email: "janjanssen@gmail.com",
                firstName: "Jan",
                lastName: "Janssen",
                password: "Password123*"
            }
            //Act
            const response = await requester.post(registerEndpoint).send(testUser)
            const user = await User.findOne({ email: testUser.email })
            //Assert
            response.should.have.status(201)
            response.body.message.should.equal("Token was successfully generated")
            delete testUser.password
            response.body.result.should.include({ ...testUser})
            response.body.result.id.should.equal(user.id)
        })
        it("Should store the user in Neo4j and Mongodb, when given a valid user", async function () {
            //Arrange
            const testUser = {
                email: "janjanssen@gmail.com",
                firstName: "Jan",
                lastName: "Janssen",
                password: "Password123*"
            }
            //Act
            const response = await requester.post(registerEndpoint).send(testUser)
            //Assert
            const user = await User.findOne({ email: testUser.email })
            const session = getSession()
            let neoQuery = await session.run('MATCH (u:User{_id: $id }) RETURN u', { id: user.id })
            delete testUser.password
            user.should.include({ ...testUser })
            neoQuery.records[0]._fields[0].properties._id.should.equal(user.id)
        })
        it("Should return an error, when sent an empty request", async function () {
            //Act
            const response = await requester.post(registerEndpoint).send({})
            //Assert
            response.should.have.status(400)
            response.body.message.should.equal("Request body was missing in the request")
        })
        it("Should return an error, when the password is missing", async function () {
            //Arrange
            const testUser = {
                email: "janjanssen@gmail.com",
                firstName: "Jan",
                lastName: "Janssen",
            }
            //Act
            const response = await requester.post(registerEndpoint).send(testUser)
            //Assert
            response.should.have.status(400)
            response.body.message.should.equal("The password was not included in the request")
        })
    }),

    describe("Login", () => { 
        const loginEndpoint = userEndpoint + "/login"
        it("Should return a valid response, when given a valid user", async function () {
            //Arrange
            const encryptedPassword ="$2b$10$CDbKz5jwue/4zGYj5/s9hORkbLNFFlBdAzqJnuNSLSqBM70.VIgNS"
            const testUser = {
                email: "janjanssen@gmail.com",
                password: "Password123*",
                firstName: "Jan",
                lastName: "Janssen",
            }
            const returnItem = await User.create({
                ...testUser,
                password: encryptedPassword
              });
            //Act
            const response = await requester.post(loginEndpoint).send(testUser)
            const user = await User.findOne({ email: testUser.email })
            //Assert
            response.should.have.status(200)
            response.body.message.should.equal("Token was successfully generated")
            delete testUser.password
            response.body.result.should.include({ ...testUser })
            response.body.result.id.should.equal(user.id)
        })
        it("Should return an error, when given an incorrect password", async function () {
            //Arrange
            const encryptedPassword ="$2b$10$CDbKz5jwue/4zGYj5/s9hORkbLNFFlBdAzqJnuNSLSqBM70.VIgNS"
            const testUser = {
                email: "janjanssen@gmail.com",
                password: "Password1582*",
                firstName: "Jan",
                lastName: "Janssen",
            }
            const returnItem = await User.create({
                ...testUser,
                password: encryptedPassword
              });
            //Act
            const response = await requester.post(loginEndpoint).send(testUser)
            const user = await User.findOne({ email: testUser.email })
            //Assert
            response.should.have.status(400)
            response.body.message.should.equal("Wrong username or password")
        })
        it("Should return an error, when sent an empty request", async function () {
            //Act
            const response = await requester.post(loginEndpoint).send({})
            //Assert
            response.should.have.status(400)
            response.body.message.should.equal("Request body was missing in the request")
        })
        it("Should return an error, when the password is missing", async function () {
            //Arrange
            const testUser = {
                email: "janjanssen@gmail.com",
                firstName: "Jan",
                lastName: "Janssen",
            }
            //Act
            const response = await requester.post(loginEndpoint).send(testUser)
            //Assert
            response.should.have.status(400)
            response.body.message.should.equal("The email and/or password was missing in the request")
        })
    })
})