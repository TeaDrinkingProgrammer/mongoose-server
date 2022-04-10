import { Router } from 'express'
import {
	addContentList,
	getContentList,
	getContentListById,
	removeContentList,
	updateContentList,
} from '../controllers/contentListController.js'
import { authoriseToken } from '../controllers/authController.js'
const router = Router()

router.get('/', getContentList)
router.get('/:id',getContentListById)
router.post('/', authoriseToken, addContentList)
router.delete('/:id', authoriseToken, removeContentList)
router.put('/:id', authoriseToken, updateContentList)
export default router
