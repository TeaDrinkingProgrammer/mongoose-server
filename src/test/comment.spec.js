import requester from './testSetup.spec.js'
import User from '../app/api/models/user.js'
import { signToken } from '../app/helpers/helperMethods.js'
import Content from '../app/api/models/content.js'
const commentEndpoint = '/api/comment'
let token = ''
let contentId = ''
let userId = ''
describe('Comment',() => {
	beforeEach( async function () {
		// unencryptedPassword = "Pasdljkflas5683*"
		// Encrypted password = $2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm
		const testUser = {
			email: 'mariagonzales@gmail.com',
			firstName: 'Maria',
			lastName: 'Gonzales',
			password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
		}
		const returnItem = await User.create({
			...testUser
		})
		userId = returnItem.id
		const testContent = {
			name: 'Language video',
			tags: ['Spanish','Culture'],
			inProduction: true,
			platforms: [
				{
					name: 'Youtube',
					link: 'Youtube.com',
				}
			],
			contentInterface: 'video',
			contentType: 'videos',
			websiteLink: 'somewebsite.com',
			language: 'English',
			targetLanguage: 'Spanish',
			user: returnItem.id
		}
		const returnItem2 = await Content.create({
			...testContent
		})
		contentId = returnItem2.id
		token = signToken(returnItem.id)
	})
	describe('Post Comment',() => {
		it('Should return a valid response, when given a valid comment and token', async function () {
			//Arrange
			const testComment = {
				commentText: 'Lorem ipsum',
				user: userId,
				content:  contentId
			}
			//Act
			const response = await requester.post(commentEndpoint).set('authorization', 'Bearer ' + token).send(testComment)
			//Assert
			response.should.have.status(201)
			response.body.message.should.equal('Comment was successfully added to the database')
			response.body.result.commentText.should.equal(testComment.commentText)
			response.body.result.votes.should.have.lengthOf(0)
			response.body.result.content.should.equal(testComment.content)
		})
		it('Should return an error, when sent an empty request', async function () {
			//Act
			const response = await requester.post(commentEndpoint).set('authorization', 'Bearer ' + token).send({})
			//Assert
			response.should.have.status(400)
			response.body.message.should.equal('Request body was missing in the request')
		})
		it('Should return an error, when commentText is missing', async function () {
			//Arrange
			const testComment = {
				user: userId,
				content:  contentId
			}
			//Act
			const response = await requester.post(commentEndpoint).set('authorization', 'Bearer ' + token).send(testComment)
			//Assert
			response.should.have.status(400)
			response.body.message.should.equal('The commentText, user and/or content was missing in the request')
		}),
		it('Should return an error, when sending request without token', async function () {
			//Arrange
			const testComment = {
				commentText: 'Lorem ipsum',
				user: userId,
				content:  contentId
			}
			//Act
			const response = await requester.post(commentEndpoint).send(testComment)
			//Assert
			response.should.have.status(401)
			response.body.message.should.equal('Authorization header is missing!')
		}),
		it('Should return an error, when sending invalid token', async function () {
			//Arrange
			const testComment = {
				commentText: 'Lorem ipsum',
				user: userId,
				content:  contentId
			}
			//Act
			const response = await requester.post(commentEndpoint).set('authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY0OTI1MTMyNywiaWF0IjoxNjQ5MjUxMzI3fQ.xnLlsEb3LX--ni8OI-zX_FecDGB7nUC2QHw6gopRQSo').send(testComment)
			//Assert
			response.should.have.status(401)
			response.body.message.should.equal('The user is not authorised or the token is expired.')
		})
	})
	// describe("Get Comment",() => {
	//     it("Should return a valid response, when given a valid comment and token", async function () {
	//         //Arrange
	//         const testComment = {
	//             commentText: 'Lorem ipsum',
	//             user: userId,
	//             content:  contentId
	//         }
	//         //Act
	//         const response = await requester.get(commentEndpoint).set("authorization", "Bearer " + token).send(testComment)
	//         //Assert
	//         response.should.have.status(201)
	//         response.body.message.should.equal("Comment was successfully added to the database")
	//         response.body.result.commentText.should.equal(testComment.commentText)
	//         response.body.result.votes.should.have.lengthOf(0)
	//         response.body.result.content.should.equal(testComment.content)
	//     })
	//     it("Should return an error, when sent an empty request", async function () {
	//         //Act
	//         const response = await requester.post(commentEndpoint).set("authorization", "Bearer " + token).send({})
	//         //Assert
	//         response.should.have.status(400)
	//         response.body.message.should.equal("Request body was missing in the request")
	//     })
	//     it("Should return an error, when commentText is missing", async function () {
	//         //Arrange
	//         const testComment = {
	//             user: userId,
	//             content:  contentId
	//         }
	//         //Act
	//         const response = await requester.post(commentEndpoint).set("authorization", "Bearer " + token).send(testComment)
	//         //Assert
	//         response.should.have.status(400)
	//         response.body.message.should.equal("The commentText, user and/or content was missing in the request")
	//     })
	// })
})