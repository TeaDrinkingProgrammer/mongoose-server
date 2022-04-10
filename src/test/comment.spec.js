import requester from './testSetup.spec.js'
import User from '../app/api/models/user.js'
import { randomStringGen, signToken } from '../app/helpers/helperMethods.js'
import Content from '../app/api/models/content.js'
import Comment from '../app/api/models/comment.js'
import { requestWithInvalidToken, requestWithoutToken} from './sharedTests.js'
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
			response.body.result.should.not.have.property('_id')
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
			response.body.message.should.equal('The commentText, user and/or content objects are missing in the request')
		}),
		it('Should return an error, when sending request without token', async function () {
			const testComment = {
				commentText: 'Lorem ipsum',
				user: userId,
				content:  contentId
			}
			await requestWithoutToken(requester.post(commentEndpoint),testComment)

		}),
		it('Should return an error, when sending invalid token', async function () {
			const testComment = {
				commentText: 'Lorem ipsum',
				user: userId,
				content:  contentId
			}
			await requestWithInvalidToken(requester.post(commentEndpoint),testComment)
		})
	})
	describe('Get Comment by Id',() => {
		it('Should return a valid response, when given a valid comment and token', async function () {
			//Arrange
			const testComment = {
				commentText: 'Lorem ipsumses',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}
			const returnItem = await Comment.create(testComment)
			const commentId = returnItem.id
			//Act
			const response = await requester.get(commentEndpoint + '/' + commentId)
			//Assert
			response.should.have.status(200)
			response.body.message.should.equal('Comment was successfully retrieved')
			response.body.result.commentText.should.equal(testComment.commentText)
			response.body.result.votes.should.have.lengthOf(1)
			response.body.result.should.not.have.property('_id')
			response.body.result.content.should.equal(testComment.content)
		}),
		it('Should return an error, when sent a non-existant id', async function () {
			//Act
			const response = await requester.get(commentEndpoint + '/' + '439jGH456f')
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('Comment could not be retrieved')
		}),
		it('Should return an error, when not sending id', async function () {
			//Act
			const response = await requester.get(commentEndpoint).set('authorization', 'Bearer ' + token)
			//Assert
			response.should.have.status(400)
			response.body.message.should.equal('Invalid request: cannot do request without an id!')
		})
	})
	describe('Get all Comments',() => {
		it('Should return a valid response, when sending a request with a contentId', async function () {
			//Arrange
			const testComment = {
				commentText: 'Lorem ipsumses',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}
			await Comment.create(testComment)
			const testComment2 = {
				commentText: 'Blabla',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}			
			const testcommentArray = [
				{
					commentText: 'Lorem ipsumses',
					votes: [
						userId,
					],
					user: userId,
					content: contentId,
					votesCount: 1,
				},
				{
					commentText: 'Blabla',
					votes: [
						userId,
					],
					user: userId,
					content: contentId,
					votesCount: 1,
				},
			]			
			await Comment.create(testComment2)
			//Act
			const response = await requester.get(commentEndpoint + '?contentId=' + contentId)
			//Assert
			response.should.have.status(200)
			response.body.message.should.equal('The item(s) were successfully retrieved')
			response.body.result.should.have.lengthOf(2)
			response.body.result.should.not.have.property('_id')

			response.body.result.should.containSubset(testcommentArray)
			
		}),
		it('Should return a valid response, when sending a request with a contentId and limit argument', async function () {
			//Arrange
			const testComment = {
				commentText: 'Lorem ipsumses',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}
			await Comment.create(testComment)
			const testComment2 = {
				commentText: 'Blabla',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}
			await Comment.create(testComment2)
			//Act
			const response = await requester.get(commentEndpoint + '?contentId=' + contentId + '&limit=' + 1)
			//Assert
			response.should.have.status(200)
			response.body.message.should.equal('The item(s) were successfully retrieved')
			response.body.result.should.not.have.property('_id')
			response.body.result.should.have.lengthOf(1)
		}),
		it('Should return an error, when sending a request without contentId', async function () {
			//Arrange
			const testComment = {
				commentText: 'Lorem ipsumses',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}
			await Comment.create(testComment)
			const testComment2 = {
				commentText: 'Blabla',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}
			await Comment.create(testComment2)
			//Act
			const response = await requester.get(commentEndpoint)
			//Assert
			response.should.have.status(400)
			response.body.message.should.equal('Invalid request: cannot do request without an id!')
		})
		it('Should return an error, when sent a non-existant id', async function () {
			//Act
			const fakeContentId = randomStringGen(24)
			const response = await requester.get(commentEndpoint + '?contentId=' + fakeContentId)
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('Comment could not be retrieved')
		})
	}),
	describe('Update Comment',() => {
		it('Should return a valid response, when given a valid change and token', async function () {
			//Arrange
			const testComment = {
				commentText: 'Lorem ipsumses',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}
			const returnedComment = {
				commentText: 'Some New Text',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}
			const returnItem = await Comment.create(testComment)
			const commentId = returnItem.id
			const newCommentText = 'Some New Text'
			//Act
			const response = await requester.put(commentEndpoint + '/' + commentId).set('authorization', 'Bearer ' + token).send({
				commentText: newCommentText
			})
			//Assert
			response.should.have.status(200)
			response.body.message.should.equal('Comment was successfully updated')
			response.body.result.should.not.have.property('_id')
			response.body.result.should.containSubset(returnedComment)
		})
		it('Should return an error, when sent a non-existant id', async function () {
			//Arrange
			const fakeId = randomStringGen(24)
			const newCommentText = 'Some New Text'
			//Act
			const response = await requester.put(commentEndpoint + '/' + fakeId).set('authorization', 'Bearer ' + token).send({
				commentText: newCommentText
			})
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('Comment could not be updated')
		})
		it('Should return an error, when not sending id', async function () {
			//Arrange
			const newCommentText = 'Some New Text'
			//Act
			const response = await requester.put(commentEndpoint).set('authorization', 'Bearer ' + token).send({
				commentText: newCommentText
			})
			//Assert
			response.should.have.status(404)
			response.body.message.should.equal('Endpoint not found!')
		}),
		it('Should return an error, when sending request without token', async function () {
			const testComment = {
				commentText: 'Lorem ipsumses',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}
			const returnItem = await Comment.create(testComment)
			const commentId = returnItem.id		
			const newCommentText = 'Some New Text'
			await requestWithoutToken(requester.put(commentEndpoint + '/' + commentId),newCommentText )

		}),
		it('Should return an error, when sending invalid token', async function () {
			const testComment = {
				commentText: 'Lorem ipsumses',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}
			const returnItem = await Comment.create(testComment)
			const commentId = returnItem.id	
			const newCommentText = 'Some New Text'
			await requestWithInvalidToken(requester.put(commentEndpoint + '/' + commentId),newCommentText )
		})
	})
	describe('Delete Comment',() => {
		it('Should return a valid response, when given a valid id and token', async function () {
			//Arrange
			const testComment = {
				commentText: 'Lorem ipsumses',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}
			const returnItem = await Comment.create(testComment)
			const commentId = returnItem.id
			//Act
			const response = await requester.delete(commentEndpoint + '/' + commentId).set('authorization', 'Bearer ' + token)
			//Assert
			response.should.have.status(200)
			response.body.message.should.equal('Comment was successfully removed from the database')
			response.body.result.should.containSubset({
				id: commentId
			})
			response.body.result.should.not.have.property('_id')
		})
		it('Should return an error, when sent a non-existant id', async function () {
			//Arrange
			const fakeId = randomStringGen(24)
			//Act
			const response = await requester.delete(commentEndpoint + '/' + fakeId).set('authorization', 'Bearer ' + token)
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('Comment could not be removed from the database')
		})
		it('Should return an error, when not sending id', async function () {
			//Act
			const response = await requester.delete(commentEndpoint).set('authorization', 'Bearer ' + token)
			//Assert
			response.should.have.status(404)
			response.body.message.should.equal('Endpoint not found!')
		})
		it('Should return an error, when sending request without token', async function () {
			//Arrange
			const testComment = {
				commentText: 'Lorem ipsumses',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}
			const returnItem = await Comment.create(testComment)
			const commentId = returnItem.id
			await requestWithoutToken(requester.delete(commentEndpoint + '/' + commentId))

		}),
		it('Should return an error, when sending invalid token', async function () {
			//Arrange
			const testComment = {
				commentText: 'Lorem ipsumses',
				user: userId,
				content:  contentId,
				votes: [
					userId
				]
			}
			const returnItem = await Comment.create(testComment)
			const commentId = returnItem.id
			await requestWithInvalidToken(requester.delete(commentEndpoint + '/' + commentId))
		})
	})
})