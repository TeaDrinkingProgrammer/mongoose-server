import ContentList from '../models/contentList.js'
import { get, getById, add, update, removeById } from './genericController.js'

export async function getContentList(req, res, next) {
	let sortOn = req.query.sortOn ? req.query.sortOn : 'name'
	if (req.query.userId) {
		req.body.userId = req.query.userId
	}
	await get(
		ContentList,
		'contentList',
		sortOn,
		req.query.sortOrder,
		req.query.skip,
		req.query.limit,
		req.body,
		next
	)
}
export async function getContentListById(req, res, next){
	await getById(ContentList, 'contentList', req.params.id, next)
}
export async function addContentList(req, res, next) {
	req.body.user = req.userId
	await add(ContentList, 'contentList', req.body, next, (body,next) =>{
		if(body.name === undefined || body.isPrivate === undefined || body.user === undefined){
			return next({
				httpCode: 400,
				messageCode: 'objectsAreMissingCode400',
				objectName: 'The name, isPrivate and/or user'
			})
		}
	})
}
export async function updateContentList(req, res, next) {
	req.body.user = req.userId
	await update(ContentList, 'contentList', req.query.id, req.body, next)
}
export async function removeContentList(req, res, next) {
	req.body.user = req.userId
	await removeById(ContentList, 'contentList', req.query.id, next)
}
