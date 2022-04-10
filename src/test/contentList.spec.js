import requester from './testSetup.spec.js'
import User from '../app/api/models/user.js'
import { randomStringGen, signToken } from '../app/helpers/helperMethods.js'
import ContentList from '../app/api/models/contentList.js'
import Content from '../app/api/models/content.js'
import { requestWithInvalidToken, requestWithoutToken} from './sharedTests.js'
const contentListEndpoint = '/api/content-list'
let token = ''
let userId = ''
let contentItem1Id = ''
let contentItem2Id = ''
describe('ContentList',() => {
	beforeEach( async function () {
		// unencryptedPassword = "Pasdljkflas5683*"
		// Encrypted password = $2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm
		const testUser = {
			email: 'mariagonzales@gmail.com',
			firstName: 'Maria',
			lastName: 'Gonzales',
			password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
		}
		const returnItem = await User.create(testUser)
		const testContentList = {
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
			user: returnItem.id
		}
		const returnItem2 = await Content.create(testContentList)
		contentItem1Id = returnItem2.id
		const testContentList2 = {
			name: 'Chinese for beginners',
			tags: ['Chinese','Culture'],
			inProduction: true,
			platforms: [
				{
					name: 'Youtube',
					link: 'Youtube.com',
				}
			],
			contentInterface: 'audio',
			contentType: 'podcast',
			websiteLink: 'chineseforbeginners.com',
			language: 'English',
			targetLanguage: 'Chinese (Traditional)',
			user: returnItem.id
		}
		const returnItem3 = await Content.create(testContentList2)
		contentItem2Id = returnItem3.id
		userId = returnItem.id
		token = signToken(returnItem.id)
	}),
	describe('Post ContentList',() => {
		it('Should return a valid response, when given a valid ContentList and token', async function () {
			//Arrange
			const testContentList = {
				name: 'My Language List',
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			//Act
			const response = await requester.post(contentListEndpoint).set('authorization', 'Bearer ' + token).send(testContentList)
			//Assert
			response.should.have.status(201)
			response.body.message.should.equal('ContentList was successfully added to the database')
			response.body.result.name.should.equal(testContentList.name)
			response.body.result.content.should.have.lengthOf(2)
			response.body.result.should.not.have.property('_id')
		}),
		it('Should return an error, when sent an empty request', async function () {
			//Act
			const response = await requester.post(contentListEndpoint).set('authorization', 'Bearer ' + token).send({})
			//Assert
			response.should.have.status(400)
			response.body.message.should.equal('Request body was missing in the request')
		}),
		it('Should return an error, when name is missing', async function () {
			//Arrange
			const testContentList = {
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			//Act
			const response = await requester.post(contentListEndpoint).set('authorization', 'Bearer ' + token).send(testContentList)
			//Assert
			response.should.have.status(400)
			response.body.message.should.equal('The name objects are missing in the request')
		}),
		it('Should return an error, when sending request without token', async function () {
			//Arrange
			const testContentList = {
				name: 'My Language List',
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			await requestWithoutToken(requester.post(contentListEndpoint),testContentList)
		}),
		it('Should return an error, when sending invalid token', async function () {
			//Arrange
			const testContentList = {
				name: 'My Language List',
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			await requestWithInvalidToken(requester.post(contentListEndpoint),testContentList)
		})
	}),
	describe('Get ContentList by Id',() => {
		it('Should return a valid response, when given a valid contentlist and token', async function () {
			//Arrange
			const testContentList = {
				name: 'My Language List',
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			const returnItem = await ContentList.create(testContentList)
			const contentListId = returnItem.id
			//Act
			const response = await requester.get(contentListEndpoint + '/' + contentListId)
			//Assert
			response.should.have.status(200)
			response.body.result.name.should.equal(testContentList.name)
			response.body.result.id.should.equal(contentListId)
			response.body.result.content.should.have.lengthOf(2)
		})
		it('Should return an error, when sent a non-existant id', async function () {
			//Act
			const response = await requester.get(contentListEndpoint + '/' + '439jGH456f')
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('ContentList could not be retrieved')
		})
	})
	describe('Get all Comments',() => {
		it('Should return a valid response, when sending a request with a contentListId', async function () {
			//Arrange
			const testContentList = {
				name: 'My Language List',
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			const returnItem = await ContentList.create(testContentList)
			const contentListId = returnItem.id
			//Act
			const response = await requester.get(contentListEndpoint + '?contentListId=' + contentListId)
			//Assert
			response.should.have.status(200)
			response.body.message.should.equal('The item(s) were successfully retrieved')
			response.body.result.should.have.lengthOf(1)
			response.body.result.should.not.have.property('_id')
			response.body.result[0].should.deep.contain(testContentList)
		})
		it('Should return a valid response, when sending a request with a contentListId and limit argument', async function () {
			//Arrange
			const testContentList = {
				name: 'My Language List',
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}

			await ContentList.create(testContentList)
			const testContentList2 = {
				name: 'My Second Languagelist',
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: false,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			await ContentList.create(testContentList2)
			//Act
			const response = await requester.get(contentListEndpoint + '?limit=' + 1)
			//Assert
			response.should.have.status(200)
			response.body.message.should.equal('The item(s) were successfully retrieved')
			response.body.result.should.not.have.property('_id')
			response.body.result.should.have.lengthOf(1)
		})
	})
	describe('Update Comment',() => {
		it('Should return a valid response, when given a valid change and token', async function () {
			//Arrange
			const testContentList = {
				name: 'My Language List',
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			const returnItem = await ContentList.create(testContentList)

			const returnedContentList = {
				name: 'Some other name',
				description: 'A new description',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			const contentListId = returnItem.id
			const update = {
				description: 'A new description',
				name: 'Some other name'
			}
			//Act
			const response = await requester.put(contentListEndpoint + '/' + contentListId).set('authorization', 'Bearer ' + token).send(update)
			//Assert
			response.should.have.status(200)
			response.body.message.should.equal('ContentList was successfully updated')
			response.body.result.should.not.have.property('_id')
			response.body.result.should.containSubset(returnedContentList)
		})
		it('Should return an error, when sent a non-existant id', async function () {
			//Arrange
			const fakeId = randomStringGen(24)
			const update = {
				description: 'A new description',
				name: 'Some other name'
			}
			//Act
			const response = await requester.put(contentListEndpoint + '/' + fakeId).set('authorization', 'Bearer ' + token).send(update)
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('ContentList could not be updated')
		})
		it('Should return an error, when not sending id', async function () {
			//Arrange
			const update = {
				description: 'A new description',
				name: 'Some other name'
			}
			//Act
			const response = await requester.put(contentListEndpoint).set('authorization', 'Bearer ' + token).send(update)
			//Assert
			response.should.have.status(404)
			response.body.message.should.equal('Endpoint not found!')
		}),
		it('Should return an error, when sending request without token', async function () {
			const testContentList = {
				name: 'My Language List',
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			const returnItem2 = await ContentList.create(testContentList)
			contentItem1Id = returnItem2.id
			const update = {
				description: 'A new description',
				name: 'Some other name'
			}
			await requestWithoutToken(requester.put(contentListEndpoint + '/' + contentItem1Id),update )

		}),
		it('Should return an error, when sending invalid token', async function () {
			const testContentList = {
				name: 'My Language List',
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			const returnItem2 = await ContentList.create(testContentList)
			contentItem1Id = returnItem2.id
			const update = {
				description: 'A new description',
				name: 'Some other name'
			}
			await requestWithInvalidToken(requester.put(contentListEndpoint + '/' + contentItem1Id),update )
		})
	})
	describe('Delete Comment',() => {
		it('Should return a valid response, when given a valid id and token', async function () {
			//Arrange
			const testContentList = {
				name: 'My Language List',
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			const returnItem = await ContentList.create(testContentList)
			const contentListId = returnItem.id
			//Act
			const response = await requester.delete(contentListEndpoint + '/' + contentListId).set('authorization', 'Bearer ' + token)
			//Assert
			response.should.have.status(200)
			response.body.message.should.equal('ContentList was successfully removed from the database')
			response.body.result.should.containSubset({
				id: contentListId
			})
			response.body.result.should.not.have.property('_id')
		})
		it('Should return an error, when sent a non-existant id', async function () {
			//Arrange
			const fakeId = randomStringGen(24)
			//Act
			const response = await requester.delete(contentListEndpoint + '/' + fakeId).set('authorization', 'Bearer ' + token)
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('ContentList could not be removed from the database')
		})
		it('Should return an error, when not sending id', async function () {
			//Act
			const response = await requester.delete(contentListEndpoint).set('authorization', 'Bearer ' + token)
			//Assert
			response.should.have.status(404)
			response.body.message.should.equal('Endpoint not found!')
		})
		it('Should return an error, when sending request without token', async function () {
			//Arrange
			const testContentList = {
				name: 'My Language List',
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			const returnItem = await ContentList.create(testContentList)
			const contentListId = returnItem.id
			await requestWithoutToken(requester.delete(contentListEndpoint + '/' + contentListId))

		}),
		it('Should return an error, when sending invalid token', async function () {
			//Arrange
			const testContentList = {
				name: 'My Language List',
				description: 'I am trying to learn Portuguese and Chinese',
				isPrivate: true,
				user: userId,
				content: [
					contentItem1Id, contentItem2Id
				]
			}
			const returnItem = await ContentList.create(testContentList)
			const contentListId = returnItem.id
			await requestWithInvalidToken(requester.delete(contentListEndpoint + '/' + contentListId))
		})
	})
})