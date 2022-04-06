import User from '../models/user.js'
import { get, getById, update, removeById } from './genericController.js'
import { getSession } from '../../loaders/neo4j.js'
//TODO: Add new endpoint for following users or add to getUser?
export async function getUser(req, res, next) {
	if (req.query.id) {
		await getById(User, 'user', req.query.id, next)
	} else {
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
				await session.run('MATCH (user1:User{_id: $user1Id}) MATCH (user2:User{_id: $user2Id}) MERGE (user1)-[:FOLLOWS]-(user2)', {
					user1Id: user1Id,
					user2Id: user2Id
				})
			} catch (error) {
				return next({
					httpCode: 404,
					messageCode: 'code500',
					error: error
				})
			}
			//TODO: Could add check for if a user is already following another user, this doesn't matter though, because we use MERGE. Could check with output of neoQuery
			//TODO: Could lookup names of users
			return next({
				httpCode: 200,
				result: 'user 1 is now following user 2',
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

async function idExists(id,next) {
	try {
		let query = await User.count({ _id: id })
		if (query > 0) {
			return true
		} else {
			return false
		}
	} catch (error) {
		return next({
			httpCode: 500,
			messageCode: 'code500',
			error: error,
		})
	}
}
