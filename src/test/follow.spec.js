import requester from './testSetup.spec.js'
import User from '../app/api/models/user.js'
import { randomStringGen, signToken } from '../app/helpers/helperMethods.js'
import { requestWithInvalidToken, requestWithoutToken} from './sharedTests.js'
import { userEndpoint } from './user.spec.js'
import { getNeoQuery } from '../app/config/neoQueries.js'
import { getSession } from '../app/loaders/neo4j.js'
let token = ''
let userId = ''
let userId2 = ''
let session = getSession()
describe('User follows', () => {
	beforeEach( async function () {
		// unencryptedPassword = "Pasdljkflas5683*"
		// Encrypted password = $2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm
		const testUser = {
			email: 'mariagonzales@gmail.com',
			firstName: 'Maria',
			lastName: 'Gonzales',
			password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
		}
		const testUser2 = {
			email: 'markhanson@gmail.com',
			firstName: 'Mark',
			lastName: 'Hanson',
			password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
		}
		const returnItem = await User.create(testUser)
		const returnItem2 = await User.create(testUser2)
		userId =  returnItem.id
		userId2 = returnItem2.id
		const query = getNeoQuery('insertForId')
		await session.run(query,
			{id: returnItem.id})
		await session.run(query,
			{id: returnItem2.id})
		token = signToken(returnItem.id)
	}),
	describe('Get follows by Id',() => {
		beforeEach( async function () {
			let query = getNeoQuery('followUser2')
			const neoQuery = await session.run(query, {
				user1Id: userId,
				user2Id: userId2
			})
			console.log(neoQuery)
		}),
		it('Should return a valid response, when given a valid user and token', async function () {
			//Act
			const response = await requester.get(userEndpoint + '/' + userId + '/follow')
			//Assert
			response.should.have.status(200)
			response.body.result.should.have.lengthOf(1)
		}),
		it('Should return an error, when sent a non-existant id', async function () {
			//Act
			const response = await requester.get(userEndpoint + '/' + '43dkcgjntgoiu5ht034' + '/follow')
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('Follow could not be removed from the database')
		})
	})
	describe('Get followers by Id',() => {
		beforeEach( async function () {
			let query = getNeoQuery('followUser2')
			const neoQuery = await session.run(query, {
				user1Id: userId,
				user2Id: userId2
			})
			console.log(neoQuery)
		}),
		it('Should return a valid response, when given a valid user and token', async function () {
			//Act
			const response = await requester.get(userEndpoint + '/' + userId2 + '/followers')
			//Assert
			response.should.have.status(200)
			response.body.result.should.have.lengthOf(1)
		}),
		it('Should return an error, when sent a non-existant id', async function () {
			//Act
			const response = await requester.get(userEndpoint + '/' + '43dkcgjntgoiu5ht034' + '/followers')
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('Follow could not be removed from the database')
		})
	})
	describe('Unfollow User',() => {
		beforeEach( async function () {
			let query = getNeoQuery('followUser2')
			const neoQuery = await session.run(query, {
				user1Id: userId,
				user2Id: userId2
			})
			console.log(neoQuery)
		}),
		it('Should return a valid response, when given a valid id and token', async function () {
			//Act
			const response = await requester.delete(userEndpoint + '/' + userId2 + '/follow').set('authorization', 'Bearer ' + token)
			//Assert
			response.should.have.status(200)
			response.body.message.should.equal('User 1 has stopped following user 2')
		})
		it('Should return an error, when sent a non-existant id', async function () {
			//Arrange
			const fakeId = randomStringGen(24)
			//Act
			const response = await requester.delete(userEndpoint + '/' + fakeId + '/follow').set('authorization', 'Bearer ' + token)
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('User 2 could not be removed from the database')
		})
		it('Should return an error, when sending request without token', async function () {
			await requestWithoutToken(requester.delete(userEndpoint + '/' + userId2 + '/follow'))

		}),
		it('Should return an error, when sending invalid token', async function () {
			await requestWithInvalidToken(requester.delete(userEndpoint + '/' + userId2 + '/follow'))
		})
	})
})