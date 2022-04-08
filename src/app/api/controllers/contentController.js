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
	}
}
export async function addContent(req, res, next) {
	req.body.user = req.userId
	await add(Content, 'content', req.body, next, (body,next) =>{
		if(body.name === undefined || body.inProduction === undefined|| body.contentInterface === undefined|| body.contentType === undefined || body.language === undefined|| body.user === undefined){
			return next({
				httpCode: 400,
				messageCode: 'objectsAreMissingCode400',
				objectName: 'The name, inProduction, contentInterface, contentType, language and/or user'
			})
		}
	})
}
export async function updateContent(req, res, next) {
	req.body.user = req.userId
	await update(Content, 'content', req.query.id, req.body, next)
}
export async function removeContent(req, res, next) {
	req.body.user = req.userId
	await removeById(Content, 'content', req.query.id, next)
}