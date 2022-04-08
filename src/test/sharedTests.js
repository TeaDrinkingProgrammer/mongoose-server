import { IsEmptyOrUndefined } from '../app/helpers/helperMethods.js'

export async function requestWithoutToken(requestFunction,body) {
	let response
	//Act
	if(!IsEmptyOrUndefined(body)){
		response = await requestFunction.send(body)
	} else {
		response = await requestFunction
	}
	//Assert
	response.should.have.status(401)
	response.body.message.should.equal('Authorization header is missing!')
}
export async function requestWithInvalidToken(requestFunction,body) {
	const invalidToken = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY0OTI1MTMyNywiaWF0IjoxNjQ5MjUxMzI3fQ.xnLlsEb3LX--ni8OI-zX_FecDGB7nUC2QHw6gopRQSo'
	let response
	//Act
	if(!IsEmptyOrUndefined(body)){
		response = await requestFunction.set('authorization', 'Bearer ' + invalidToken).send(body)
	} else {
		response = await requestFunction.set('authorization', 'Bearer ' + invalidToken)
	}
	//Assert
	response.should.have.status(401)
	response.body.message.should.equal('The user is not authorised or the token is expired.')
}