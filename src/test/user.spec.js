import requester from './testSetup.spec.js'
import User from '../app/api/models/user.js'
import { randomStringGen, signToken } from '../app/helpers/helperMethods.js'
import { requestWithInvalidToken, requestWithoutToken} from './sharedTests.js'
export const userEndpoint = '/api/user'
let token = ''
describe('User',() => {
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
		token = signToken(returnItem.id)
	}),
	describe('Get user by Id',() => {
		it('Should return a valid response, when given a valid user and token', async function () {
			//Arrange
			const testUser = {
				email: 'johnjohnson@gmail.com',
				firstName: 'John',
				lastName: 'Johnson',
				password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
			}
			const returnItem = await User.create(testUser)
			const userId = returnItem.id
			//Act
			const response = await requester.get(userEndpoint + '/' + userId)
			//Assert
			response.should.have.status(200)
			response.body.result.email.should.equal(testUser.email)
			response.body.result.id.should.equal(userId)
		})
		it('Should return an error, when sent a non-existant id', async function () {
			//Act
			const response = await requester.get(userEndpoint + '/' + '439jGH456f')
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('User could not be retrieved')
		})
	})
	describe('Get all Comments',() => {
		it('Should return a valid response, when sending a request with a userId', async function () {
			//Arrange
			const testUser2 = {
				email: 'johnjohnson@gmail.com',
				firstName: 'John',
				lastName: 'Johnson',
				password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
			}
			const returnedTestUser = {
				email: 'johnjohnson@gmail.com',
				firstName: 'John',
				lastName: 'Johnson',
			}
			const returnItem = await User.create(testUser2)
			const userId2 = returnItem.id
			//Act
			const response = await requester.get(userEndpoint + '?userId=' + userId2)
			//Assert
			response.should.have.status(200)
			response.body.message.should.equal('The item(s) were successfully retrieved')
			response.body.result.should.have.lengthOf(2)
			response.body.result.should.not.have.property('_id')
			response.body.result[1].should.contain(returnedTestUser)
			// response.body.result.should.containSubset(testUser)
		})
		it('Should return a valid response, when sending a request with a userId and limit argument', async function () {
			//Arrange
			const testUser2 = {
				email: 'johnjohnson@gmail.com',
				firstName: 'John',
				lastName: 'Johnson',
				password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
			}

			await User.create(testUser2)
			const testUser3 = {
				email: 'markvanhoveren@gmail.com',
				firstName: 'Mark',
				lastName: 'van Hoveren',
				password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
			}
			await User.create(testUser3)
			//Act
			const response = await requester.get(userEndpoint + '?limit=' + 1)
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
			const testUser2 = {
				email: 'johnjohnson@gmail.com',
				firstName: 'John',
				lastName: 'Johnson',
				password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
			}
			const returnItem2 = await User.create(testUser2)
			const userId2 = returnItem2.id
			const returnedUser = {
				email: 'johnjohnson@hotmail.com',
				firstName: 'John',
				lastName: 'Johnsons',
			}
			const update = {
				email: 'johnjohnson@hotmail.com',
				lastName: 'Johnsons'
			}
			//Act
			const response = await requester.put(userEndpoint + '/' + userId2).set('authorization', 'Bearer ' + token).send(update)
			//Assert
			response.should.have.status(200)
			response.body.message.should.equal('User was successfully updated')
			response.body.result.should.not.have.property('_id')
			response.body.result.should.containSubset(returnedUser)
		})
		it('Should return an error, when sent a non-existant id', async function () {
			//Arrange
			const fakeId = randomStringGen(24)
			const update = {
				email: 'johnjohnson@hotmail.com',
				lastName: 'Johnsons'
			}
			//Act
			const response = await requester.put(userEndpoint + '/' + fakeId).set('authorization', 'Bearer ' + token).send(update)
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('User could not be updated')
		})
		it('Should return an error, when not sending id', async function () {
			//Arrange
			const update = {
				email: 'johnjohnson@hotmail.com',
				lastName: 'Johnsons'
			}
			//Act
			const response = await requester.put(userEndpoint).set('authorization', 'Bearer ' + token).send(update)
			//Assert
			response.should.have.status(404)
			response.body.message.should.equal('Endpoint not found!')
		}),
		it('Should return an error, when sending request without token', async function () {
			const testUser2 = {
				email: 'johnjohnson@gmail.com',
				firstName: 'John',
				lastName: 'Johnson',
				password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
			}
			const returnItem2 = await User.create(testUser2)
			const userId2 = returnItem2.id
			const update = {
				email: 'johnjohnson@hotmail.com',
				lastName: 'Johnsons'
			}
			await requestWithoutToken(requester.put(userEndpoint + '/' + userId2),update )

		}),
		it('Should return an error, when sending invalid token', async function () {
			const testUser2 = {
				email: 'johnjohnson@gmail.com',
				firstName: 'John',
				lastName: 'Johnson',
				password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
			}
			const returnItem2 = await User.create(testUser2)
			const userId2 = returnItem2.id
			const update = {
				email: 'johnjohnson@hotmail.com',
				lastName: 'Johnsons'
			}
			await requestWithInvalidToken(requester.put(userEndpoint + '/' + userId2),update )
		})
	})
	describe('Delete Comment',() => {
		it('Should return a valid response, when given a valid id and token', async function () {
			//Arrange
			const testUser2 = {
				email: 'johnjohnson@gmail.com',
				firstName: 'John',
				lastName: 'Johnson',
				password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
			}
			const returnItem2 = await User.create(testUser2)
			const userId2 = returnItem2.id
			//Act
			const response = await requester.delete(userEndpoint + '/' + userId2).set('authorization', 'Bearer ' + token)
			//Assert
			response.should.have.status(200)
			response.body.message.should.equal('User was successfully removed from the database')
			response.body.result.should.containSubset({
				id: userId2
			})
			response.body.result.should.not.have.property('_id')
		})
		it('Should return an error, when sent a non-existant id', async function () {
			//Arrange
			const fakeId = randomStringGen(24)
			//Act
			const response = await requester.delete(userEndpoint + '/' + fakeId).set('authorization', 'Bearer ' + token)
			//Assert
			response.should.have.status(500)
			response.body.message.should.equal('User could not be removed from the database')
		})
		it('Should return an error, when not sending id', async function () {
			//Act
			const response = await requester.delete(userEndpoint).set('authorization', 'Bearer ' + token)
			//Assert
			response.should.have.status(404)
			response.body.message.should.equal('Endpoint not found!')
		})
		it('Should return an error, when sending request without token', async function () {
			//Arrange
			const testUser2 = {
				email: 'johnjohnson@gmail.com',
				firstName: 'John',
				lastName: 'Johnson',
				password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
			}
			const returnItem = await User.create(testUser2)
			const userId2 = returnItem.id
			await requestWithoutToken(requester.delete(userEndpoint + '/' + userId2))

		}),
		it('Should return an error, when sending invalid token', async function () {
			//Arrange
			const testUser2 = {
				email: 'johnjohnson@gmail.com',
				firstName: 'John',
				lastName: 'Johnson',
				password: '$2b$10$2UgJ72WXxfroJmUInWJKpey7D9qBtlcauuv.t51YIGGHlsq/qUIqm'
			}
			const returnItem2 = await User.create(testUser2)
			const userId2 = returnItem2.id
			await requestWithInvalidToken(requester.delete(userEndpoint + '/' + userId2))
		})
	})
})