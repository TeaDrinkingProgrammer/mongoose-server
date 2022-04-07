import logger from '../config/logger.js'

class Lang {
	genericStrings = {
		welcomeCode: 'Client connected',
		serverStart: 'Server started',
		testConnection: 'Successfully connected to server',
		endpointNotFoundError: 'Endpoint not found!',
		idNotIncludedError: 'Invalid request: cannot do request without an id!',
		idAndBodyNotIncludedError:
      'Invalid request: cannot do request without an id and/or body!',
		passwordNotIncluded: 'The password was not included in the request',
		sortOnNotIncluded: 'Cannot call get without sort argument!',
		code500: 'Internal server error',
		tokenSuccess: 'Token was successfully generated',
		notAuthenticated: 'Wrong username or password',
		tokenMissing: 'Authorization header is missing!',
		tokenNotAuthorised: 'The user is not authorised or the token is expired.',
		code200: 'The item(s) were successfully retrieved',
		followSuccess: 'User 1 now follows user 2',
		unfollowSuccess: 'User 1 has stopped following user 2'
	}
	// objectName = " ";
	interpolatedStrings = (messageName, objectName) => {
		let array = {
			code404: `${objectName} does not exist`,
			alreadyExists: `${objectName} already exists`,
			retrievalError: `${objectName} could not be retrieved`,
			creationError: `${objectName} could not be added`,
			deletionError: `${objectName} could not be removed from the database`,
			updateError: `${objectName} could not be updated`,
			creationSuccess: `${objectName} was successfully added to the database`,
			deletionSuccess: `${objectName} was successfully removed from the database`,
			updateSuccess: `${objectName} was successfully updated`,
			isMissingCode400: `${objectName} was missing in the request`,
			findByIdSuccess: `${objectName} was successfully retrieved`,
		}
		return array[messageName]
	}

	getString(messageCode, objectName) {
		logger.debug('getText: ', messageCode, objectName)
		if (
			objectName !== undefined &&
      this.interpolatedStrings[messageCode] !== null
		) {
			return this.interpolatedStrings(messageCode, objectName)
		} else if (this.genericStrings[messageCode] !== null) {
			return this.genericStrings[messageCode]
		} else {
			logger.error('String does not exist! Messagecode: ', messageCode)
		}
	}
}
export default new Lang()
