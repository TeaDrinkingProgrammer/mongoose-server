import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app/app.js";
import { getSession } from "../app/loaders/neo4j.js";
import Comment from "../app/api/models/comment.js"
import Content from "../app/api/models/content.js"
import ContentList from "../app/api/models/contentList.js"
import User from "../app/api/models/user.js"
chai.use(chaiHttp)
const requester = chai.request(app).keepOpen()
export default requester

after( async function () {
    await Promise.all([Comment.deleteMany(),Content.deleteMany(),ContentList.deleteMany(),User.deleteMany()])
    console.info("Mongodb test database has been emptied")
    const session = getSession()
    await session.run("MATCH (n) DETACH DELETE n")
    await session.close()
    console.info("Neo4j test database has been emptied")
    requester.close()
    console.info("Test runner closed")
})