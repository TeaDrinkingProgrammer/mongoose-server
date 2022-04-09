import User from '../models/user.js'
import { get, getById, update, removeById } from './genericController.js'
import { getSession } from '../../loaders/neo4j.js'
import { cleanMongoGetRequest } from '../../helpers/helperMethods.js'
import { getNeoQuery } from '../../config/neoQueries.js'
import logger from '../../config/logger.js'
//TODO: Add new endpoint for following users or add to getUser?
export async function getUser(req, res, next) {
	let sortOn = req.query.sortOn ? req.query.sortOn : 'username'
	await get(
		User,
		'user',
		sortOn,
		req.query.sortOrder,
		req.query.skip,
		req.query.limit,
		req.body,
		next
	)
}
export async function getUserById(req, res, next){
	await getById(User, 'user', req.params.id, next)
}
export async function updateUser(req, res, next) {
	await update(User, 'user', req.query.id, req.body, next)
}
export async function removeUser(req, res, next) {
	await removeById(User, 'user', req.query.id, next)
}
export async function followUser(req, res, next) {
	let session = getSession()
	const user1Id = req.userId
	const user2Id = req.params.id
	if (user1Id && user2Id) {
		let user1IdExists = await idExists(user1Id,next)
		let user2IdExists = await idExists(user2Id,next)
		if (user1IdExists && user2IdExists) {
			try {
				const query = getNeoQuery('followUser2')
				await session.run(query, {
					user1Id: user1Id,
					user2Id: user2Id
				})
			} catch (error) {
				return next({
					httpCode: 500,
					messageCode: 'retrievalError',
					objectName: 'Follow',
					error: error,
				})
			}
			//TODO: Could add check for if a user is already following another user, this doesn't matter though, because we use MERGE. Could check with output of neoQuery
			//TODO: Could lookup names of users
			return next({
				httpCode: 200,
				messageCode: 'followSuccess',
			})
		} else {
			return next({
				httpCode: 404,
				messageCode: 'code404',
				objectName: 'User id or followUserId'
			})
		}
	} else {
		return next({
			httpCode: 400,
			messageCode: 'idAndBodyNotIncludedError',
		})
	}
}
export async function getFollows(req,res,next){
	return getFollowsorFollowers(req,res,next,true)
}
export async function getFollowers(req,res,next){
	return getFollowsorFollowers(req,res,next,false)
}
export async function getFollowsorFollowers(req, res, next,follows) {
	let session = getSession()
	const userId = req.params.id
	if (userId) {
		let userIdExists = await idExists(userId,next)
		if (userIdExists.bool) {
			let query
			let neoQueryResult
			if(follows == true){
				query = getNeoQuery('getFollowsForUser1')
			} else {
				query = getNeoQuery('getFollowersForUser1')
			}
			try {
				neoQueryResult = await session.run(query, {
					user1Id: userId
				})
				logger.log(neoQueryResult)
			} catch (error) {
				return next({
					httpCode: 500,
					messageCode: 'retrievalError',
					objectName: 'Follow',
					error: error,
				})
			}
			let userArray = []
			for(let i = 0;  i < neoQueryResult.records.length;i++){
				const node = neoQueryResult.records[i]._fields[0]
				let returnItem = await User.findById(node.properties._id)
				returnItem = cleanMongoGetRequest(returnItem)
				userArray.push(returnItem)
			}
			return next({
				httpCode: 200,
				messageCode: 'code200',
				result: userArray
			})
		} else {
			if(userIdExists.error){
				return next({
					httpCode: 500,
					messageCode: 'deletionError',
					objectName: 'follow'
				})
			} else {
				return next({
					httpCode: 404,
					messageCode: 'code404',
					objectName: 'User id or followUserId'
				})
			}

		}
	} else {
		return next({
			httpCode: 400,
			messageCode: 'idAndBodyNotIncludedError',
		})
	}
}
export async function unfollowUser(req, res, next) {
	let session = getSession()
	const user1Id = req.userId
	const user2Id = req.params.id
	if (user1Id && user2Id) {
		let user1IdExists = await idExists(user1Id,next)
		let user2IdExists = await idExists(user2Id,next)
		if (user1IdExists.bool && user2IdExists.bool) {
			try {
				const query = getNeoQuery('unFollowUser2')
				await session.run(query, {
					user1Id: user1Id,
					user2Id: user2Id
				})
			} catch (error) {
				return next({
					httpCode: 500,
					messageCode: 'deletionError',
					objectName: 'follow',
					error: error,
				})
			}
			//TODO: Could add check for if a user is already following another user, this doesn't matter though, because we use MERGE. Could check with output of neoQuery
			//TODO: Could lookup names of users
			return next({
				httpCode: 200,
				messageCode: 'unfollowSuccess',
			})
		} else {
			if(user1IdExists.error){
				return next({
					httpCode: 500,
					messageCode: 'deletionError',
					objectName: 'User 1'
				})
			} else if(user2IdExists.error){
				return next({
					httpCode: 500,
					messageCode: 'deletionError',
					objectName: 'User 2'
				})
			} else {
				return next({
					httpCode: 404,
					messageCode: 'code404',
					objectName: 'User id or followUserId'
				})
			}
		}
	} else {
		return next({
			httpCode: 400,
			messageCode: 'idAndBodyNotIncludedError',
		})

	}
}
async function idExists(id) {
	try {
		let query = await User.count({ _id: id })
		if (query > 0) {
			return {
				bool:true
			}
		} else {
			return {
				bool:true
			}
		}
	} catch (error) {
		return {
			error: error
		}
	}
}
