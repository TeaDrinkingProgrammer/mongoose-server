import requester from "./requester.spec.js";
import User from "../app/api/models/user.js"
import jwt from "jsonwebtoken";

const testUser1 = {
    email: "janjanssen@gmail.com",
    firstName: "Jan",
    lastName: "Janssen",
    password: "Password123*"
}
const testUser2 = {
    email: "henkdesteen@gmail.com",
    firstName: "Henk",
    lastName: "de Steen",
    password: "Passwistle7476("
}
const userEndpoint = "/api/auth"
describe("Authentication", () => {
    it("Should register a user, when given a valid user", async function () {
        //Arrange
        const response = await requester.post(userEndpoint + "/register").send(testUser1)
        const user = await User.findOne({email: testUser1.email})
        console.log("response: ", response)
        response.should.have.status(201)
    })
})