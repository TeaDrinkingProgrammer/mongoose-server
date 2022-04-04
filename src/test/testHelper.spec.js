import { getSession } from "../app/loaders/neo4j.js";
import chai from "chai";
import Comment from "../app/api/models/comment.js"
import Content from "../app/api/models/content.js"
import ContentList from "../app/api/models/contentList.js"
import User from "../app/api/models/user.js"

beforeEach( async function () {
    await Promise.all([Comment.deleteMany(),Content.deleteMany(),ContentList.deleteMany(),User.deleteMany()])
    console.info("Mongodb test database has been emptied")
    const session = getSession()
    await session.run("MATCH (n) DETACH DELETE n")
    await session.close()
})
before(async function (){
    chai.should()
})
