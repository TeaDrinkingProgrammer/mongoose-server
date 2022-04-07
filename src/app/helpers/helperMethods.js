import jwt from 'jsonwebtoken'
import { env } from '../config/index.js'
export function IsEmptyOrUndefined(jsonObject) {
	if(jsonObject === undefined || Object.keys(jsonObject).length === 0){
		return true
	} else {
		return false
	}
}
export function signToken(id) {
	return jwt.sign({ id }, env.JWT_SECRET_KEY, {
		expiresIn: '5h',
	})
}
export function uppercaseFirstChar(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}
export function cleanMongoGetRequest(returnItem){
	returnItem = JSON.parse(JSON.stringify(returnItem))
	delete returnItem.__v
	delete returnItem._id
	delete returnItem.password
	return returnItem
}
export function randomStringGen(len){
	return [...Array(len)].map(() => Math.random().toString(36)[2]).join('')
}