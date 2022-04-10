import { Router } from 'express'
import {
	addComment,
	getComment,
	getCommentById,
	removeComment,
	updateComment,
} from '../controllers/commentController.js'
import { authoriseToken } from '../controllers/authController.js'
const router = Router()

router.get('/', getComment)
router.get('/:id', getCommentById)
router.post('/', authoriseToken, addComment)
router.delete('/:id', authoriseToken, removeComment)
router.put('/:id', authoriseToken, updateComment)
export default router
