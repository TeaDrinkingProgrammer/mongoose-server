import requester from './testSetup.spec.js'
import User from '../app/api/models/user.js'
import { randomStringGen, signToken } from '../app/helpers/helperMethods.js'
import Content from '../app/api/models/content.js'
import { requestWithInvalidToken, requestWithoutToken} from './sharedTests.js'
const contentEndpoint = '/api/content'
let token = ''
let userId = ''

describe.only('Content',() => {
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
		token = signToken(returnItem.id)
	})
	describe('Post Content',() => {
		it('Should return a valid response, when given a valid Content and token', async function () {
			//Arrange
			const testContent = {
				name: 'Portuguese for Beginners',
				tags: ['Portugal','Culture'],
				inProduction: true,
				platforms: [
					{
						name: 'Youtube',
						link: 'Youtube.com',
					}
				],
				contentInterface: 'audio',
				contentType: 'podcast',
				websiteLink: 'portugueseforbeginners.com',
				language: 'English',
				targetLanguage: 'Portuguese',
				user: userId
			}
			//Act
			const response = await requester.post(contentEndpoint).set('authorization', 'Bearer ' + token).send(testContent)
			//Assert
			response.should.have.status(201)
			response.body.message.should.equal('Content was successfully added to the database')
			response.body.result.name.should.equal(testContent.name)
			response.body.result.platforms.should.have.lengthOf(1)
			response.body.result.should.not.have.property('_id')
		}),
		it('Should return an error, when sent an empty request', async function () {
			//Act
			const response = await requester.post(contentEndpoint).set('authorization', 'Bearer ' + token).send({})
			//Assert
			response.should.have.status(400)
			response.body.message.should.equal('Request body was missing in the request')
		}),
		it('Should return an error, when name is missing', async function () {
			//Arrange
			const testContent = {
				tags: ['Portugal','Culture'],
				inProduction: true,
				platforms: [
					{
						name: 'Youtube',
						link: 'Youtube.com',
					}
				],
				contentInterface: 'audio',
				contentType: 'podcast',
				websiteLink: 'portugueseforbeginners.com',
				language: 'English',
				targetLanguage: 'Portuguese',
				user: userId
			}
			//Act
			const response = await requester.post(contentEndpoint).set('authorization', 'Bearer ' + token).send(testContent)
			//Assert
			response.should.have.status(400)
			response.body.message.should.equal('The name, inProduction, contentInterface, contentType, language and/or user objects are missing in the request')
		})
		it('Should return an error, when sending request without token', async function () {
			//Arrange
			const testContent = {
				name: 'Portuguese for Beginners',
				tags: ['Portugal','Culture'],
				inProduction: true,
				platforms: [
					{
						name: 'Youtube',
						link: 'Youtube.com',
					}
				],
				contentInterface: 'audio',
				contentType: 'podcast',
				websiteLink: 'portugueseforbeginners.com',
				language: 'English',
				targetLanguage: 'Portuguese',
				user: userId
			}
			await requestWithoutToken(requester.post(contentEndpoint),testContent)
		})
		it('Should return an error, when sending invalid token', async function () {
			//Arrange
			const testContent = {
				name: 'Portuguese for Beginners',
				tags: ['Portugal','Culture'],
				inProduction: true,
				platforms: [
					{
						name: 'Youtube',
						link: 'Youtube.com',
					}
				],
				contentInterface: 'audio',
				contentType: 'podcast',
				websiteLink: 'portugueseforbeginners.com',
				language: 'English',
				targetLanguage: 'Portuguese',
				user: userId
			}
			await requestWithInvalidToken(requester.post(contentEndpoint),testContent)
		})
	})
	describe('Get Content by Id',() => {
		it('Should return a valid response, when given a valid comment and token', async function () {
			//Arrange
			const testContent = {
				name: 'Portuguese for Beginners',
				tags: ['Portugal','Culture'],
				inProduction: true,
				platforms: [
					{
						name: 'Youtube',
						link: 'Youtube.com',
					}
				],
				contentInterface: 'audio',
				contentType: 'podcast',
				websiteLink: 'portugueseforbeginners.com',
				language: 'English',
				targetLanguage: 'Portuguese',
				user: userId
			}
			const returnItem = await Content.create(testContent)
			const contentId = returnItem.id
			//Act
			const response = await requester.get(contentEndpoint + '?id=' + contentId)
			//Assert
			response.should.have.status(200)
			response.body.result.name.should.equal(testContent.name)
			response.body.result.platforms.should.have.lengthOf(1)
			response.body.result.should.containSubset(testContent)
		})
		it('Should return an error, when sent a non-existant id', async function () {
			//Act
			const response = await requester.get(contentEndpoint + '?id=' + '439jGH456f')
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('Content could not be retrieved')
		}),
		it('Should return an error, when not sending id', async function () {
			//Act
			const response = await requester.get(contentEndpoint).set('authorization', 'Bearer ' + token)
			//Assert
			response.should.have.status(400)
			response.body.message.should.equal('Invalid request: cannot do request without an id!')
		})
	})
	// describe('Get all Comments',() => {
	// 	it('Should return a valid response, when sending a request with a contentId', async function () {
	// 		//Arrange
	// 		const testContent = {
	// 			commentText: 'Lorem ipsumses',
	// 			user: userId,
	// 			content:  contentId,
	// 			votes: [
	// 				userId
	// 			]
	// 		}
	// 		await Content.create(testContent)
	// 		const testContent2 = {
	// 			commentText: 'Blabla',
	// 			user: userId,
	// 			content:  contentId,
	// 			votes: [
	// 				userId
	// 			]
	// 		}			
	// 		const testContentArray = [
	// 			{
	// 				commentText: 'Lorem ipsumses',
	// 				votes: [
	// 					userId,
	// 				],
	// 				user: userId,
	// 				content: contentId,
	// 				votesCount: 1,
	// 			},
	// 			{
	// 				commentText: 'Blabla',
	// 				votes: [
	// 					userId,
	// 				],
	// 				user: userId,
	// 				content: contentId,
	// 				votesCount: 1,
	// 			},
	// 		]			
	// 		await Content.create(testContent2)
	// 		//Act
	// 		const response = await requester.get(contentEndpoint + '?contentId=' + contentId)
	// 		//Assert
	// 		response.should.have.status(200)
	// 		response.body.message.should.equal('The item(s) were successfully retrieved')
	// 		response.body.result.should.have.lengthOf(2)
	// 		response.body.result.should.not.have.property('_id')

	// 		response.body.result.should.containSubset(testContentArray)
			
	// 	}),
	// 	it('Should return a valid response, when sending a request with a contentId and limit argument', async function () {
	// 		//Arrange
	// 		const testContent = {
	// 			commentText: 'Lorem ipsumses',
	// 			user: userId,
	// 			content:  contentId,
	// 			votes: [
	// 				userId
	// 			]
	// 		}
	// 		await Content.create(testContent)
	// 		const testContent2 = {
	// 			commentText: 'Blabla',
	// 			user: userId,
	// 			content:  contentId,
	// 			votes: [
	// 				userId
	// 			]
	// 		}
	// 		await Content.create(testContent2)
	// 		//Act
	// 		const response = await requester.get(contentEndpoint + '?contentId=' + contentId + '&limit=' + 1)
	// 		//Assert
	// 		response.should.have.status(200)
	// 		response.body.message.should.equal('The item(s) were successfully retrieved')
	// 		response.body.result.should.not.have.property('_id')
	// 		response.body.result.should.have.lengthOf(1)
	// 	}),
	// 	it('Should return an error, when sending a request without contentId', async function () {
	// 		//Arrange
	// 		const testContent = {
	// 			commentText: 'Lorem ipsumses',
	// 			user: userId,
	// 			content:  contentId,
	// 			votes: [
	// 				userId
	// 			]
	// 		}
	// 		await Content.create(testContent)
	// 		const testContent2 = {
	// 			commentText: 'Blabla',
	// 			user: userId,
	// 			content:  contentId,
	// 			votes: [
	// 				userId
	// 			]
	// 		}
	// 		await Content.create(testContent2)
	// 		//Act
	// 		const response = await requester.get(contentEndpoint)
	// 		//Assert
	// 		response.should.have.status(400)
	// 		response.body.message.should.equal('Invalid request: cannot do request without an id!')
	// 	})
	// 	it('Should return an error, when sent a non-existant id', async function () {
	// 		//Act
	// 		const fakeContentId = randomStringGen(24)
	// 		const response = await requester.get(contentEndpoint + '?contentId=' + fakeContentId)
	// 		//Assert
	// 		response.should.have.status(500)
	// 		response.body.message.should.equal('Comment could not be retrieved')
	// 	})
	// }),
	// describe('Update Comment',() => {
	// 	it('Should return a valid response, when given a valid change and token', async function () {
	// 		//Arrange
	// 		const testContent = {
	// 			commentText: 'Lorem ipsumses',
	// 			user: userId,
	// 			content:  contentId,
	// 			votes: [
	// 				userId
	// 			]
	// 		}
	// 		const returnedComment = {
	// 			commentText: 'Some New Text',
	// 			user: userId,
	// 			content:  contentId,
	// 			votes: [
	// 				userId
	// 			]
	// 		}
	// 		const returnItem = await Content.create(testContent)
	// 		const contentId = returnItem.id
	// 		const newCommentText = 'Some New Text'
	// 		//Act
	// 		const response = await requester.put(contentEndpoint + '?id=' + contentId).set('authorization', 'Bearer ' + token).send({
	// 			commentText: newCommentText
	// 		})
	// 		//Assert
	// 		response.should.have.status(200)
	// 		response.body.message.should.equal('Comment was successfully updated')
	// 		response.body.result.should.not.have.property('_id')
	// 		response.body.result.should.containSubset(returnedComment)
	// 	})
	// 	it('Should return an error, when sent a non-existant id', async function () {
	// 		//Arrange
	// 		const fakeId = randomStringGen(24)
	// 		const newCommentText = 'Some New Text'
	// 		//Act
	// 		const response = await requester.put(contentEndpoint + '?id=' + fakeId).set('authorization', 'Bearer ' + token).send({
	// 			commentText: newCommentText
	// 		})
	// 		//Assert
	// 		response.should.have.status(500)
	// 		response.body.message.should.equal('Comment could not be updated')
	// 	})
	// 	it('Should return an error, when not sending id', async function () {
	// 		//Arrange
	// 		const newCommentText = 'Some New Text'
	// 		//Act
	// 		const response = await requester.put(contentEndpoint).set('authorization', 'Bearer ' + token).send({
	// 			commentText: newCommentText
	// 		})
	// 		//Assert
	// 		response.should.have.status(400)
	// 		response.body.message.should.equal('Invalid request: cannot do request without an id and/or body!')
	// 	}),
	// 	it('Should return an error, when sending request without token', async function () {
	// 		const newCommentText = 'Some New Text'
	// 		await requestWithoutToken(requester.put(contentEndpoint),newCommentText )

	// 	}),
	// 	it('Should return an error, when sending invalid token', async function () {
	// 		const newCommentText = 'Some New Text'
	// 		await requestWithInvalidToken(requester.put(contentEndpoint),newCommentText )
	// 	})
	// })
	// describe('Delete Comment',() => {
	// 	it('Should return a valid response, when given a valid id and token', async function () {
	// 		//Arrange
	// 		const testContent = {
	// 			commentText: 'Lorem ipsumses',
	// 			user: userId,
	// 			content:  contentId,
	// 			votes: [
	// 				userId
	// 			]
	// 		}
	// 		const returnItem = await Content.create(testContent)
	// 		const contentId = returnItem.id
	// 		//Act
	// 		const response = await requester.delete(contentEndpoint + '?id=' + contentId).set('authorization', 'Bearer ' + token)
	// 		//Assert
	// 		response.should.have.status(200)
	// 		response.body.message.should.equal('Comment was successfully removed from the database')
	// 		response.body.result.should.containSubset({
	// 			id: contentId
	// 		})
	// 		response.body.result.should.not.have.property('_id')
	// 	})
	// 	it('Should return an error, when sent a non-existant id', async function () {
	// 		//Arrange
	// 		const fakeId = randomStringGen(24)
	// 		//Act
	// 		const response = await requester.delete(contentEndpoint + '?id=' + fakeId).set('authorization', 'Bearer ' + token)
	// 		//Assert
	// 		response.should.have.status(500)
	// 		response.body.message.should.equal('Comment could not be removed from the database')
	// 	})
	// 	it('Should return an error, when not sending id', async function () {
	// 		//Act
	// 		const response = await requester.put(contentEndpoint).set('authorization', 'Bearer ' + token)
	// 		//Assert
	// 		response.should.have.status(400)
	// 		response.body.message.should.equal('Invalid request: cannot do request without an id and/or body!')
	// 	})
	// 	it('Should return an error, when sending request without token', async function () {
	// 		//Arrange
	// 		const testContent = {
	// 			commentText: 'Lorem ipsumses',
	// 			user: userId,
	// 			content:  contentId,
	// 			votes: [
	// 				userId
	// 			]
	// 		}
	// 		const returnItem = await Content.create(testContent)
	// 		const contentId = returnItem.id
	// 		await requestWithoutToken(requester.delete(contentEndpoint + '?id=' + contentId))

	// 	}),
	// 	it('Should return an error, when sending invalid token', async function () {
	// 		//Arrange
	// 		const testContent = {
	// 			commentText: 'Lorem ipsumses',
	// 			user: userId,
	// 			content:  contentId,
	// 			votes: [
	// 				userId
	// 			]
	// 		}
	// 		const returnItem = await Content.create(testContent)
	// 		const contentId = returnItem.id
	// 		await requestWithInvalidToken(requester.delete(contentEndpoint + '?id=' + contentId))
	// 	})
	// })
})