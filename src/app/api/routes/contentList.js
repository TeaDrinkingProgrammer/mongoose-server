import { Router } from 'express'
import {
	addContentList,
	getContentList,
	removeContentList,
	updateContentList,
} from '../controllers/contentListController.js'
import { authoriseToken } from '../controllers/authController.js'
const router = Router()

router.get('/', getContentList)
router.post('/', authoriseToken, addContentList)
router.delete('/', authoriseToken, removeContentList)
router.put('/', authoriseToken, updateContentList)
export default router
