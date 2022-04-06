import Content from '../models/content.js'
import { get, getById, add, update, removeById } from './genericController.js'

export async function getContent(req, res, next) {
	if (req.query.id) {
		await getById(Content, 'content', req.query.id, next)
	} else {
		let sortOn = req.query.sortOn ? req.query.sortOn : 'name'
		await get(
			Content,
			'content',
			sortOn,
			req.query.sortOrder,
			req.query.skip,
			req.query.limit,
			req.body,
			next
		)
		//model, objectName, sortOn, skip, limit, body, next
	}
}
export async function addContent(req, res, next) {
	req.body.user = req.userId
	await add(Content, 'content', req.body, next)
}
export async function updateContent(req, res, next) {
	req.body.user = req.userId
	await update(Content, 'content', req.query.id, req.body, next)
}
export async function removeContent(req, res, next) {
	req.body.user = req.userId
	await removeById(Content, 'content', req.query.id, next)
}