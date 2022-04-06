import { Router } from 'express'
import {
	addContent,
	getContent,
	removeContent,
	updateContent,
} from './../controllers/contentController.js'
import { authoriseToken } from '../controllers/authController.js'
const router = Router()

router.get('/', getContent)
router.post('/', authoriseToken, addContent)
router.delete('/', authoriseToken, removeContent)
router.put('/', authoriseToken, updateContent)
export default router
