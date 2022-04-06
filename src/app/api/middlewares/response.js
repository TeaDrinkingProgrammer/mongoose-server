import logger from '../../config/logger.js'
import getText from '../../lang/get-text.js'
// eslint-disable-next-line no-unused-vars
export default (packet, _req, res, _next) => {
	packet.httpCode = packet.httpCode === undefined ? 500 : packet.httpCode
	packet.messageCode = packet.messageCode === undefined ? 'code500' : packet.messageCode
	logger.debug('Response middleware:')
	logger.debug('Status: ', packet.httpCode)
	logger.debug('Result: ', packet.result)
	let message = getText(packet.messageCode, packet.objectName)
	logger.debug('Message: ', message)
	if (packet.httpCode >= 200 && packet.httpCode < 300) {
		res.status(packet.httpCode).json({
			message: message,
			result: packet.result,
		})
	} else if (packet.httpCode >= 300 && packet.httpCode < 600) {
		if (packet.error) {
			logger.debug('Error: ', packet.error)
			res.status(packet.httpCode).json({
				message: message,
				error: packet.error.message,
			})
		} else {
			res.status(packet.httpCode).json({ message: message })
		}
	}
}
