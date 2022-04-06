import { Router } from 'express'
import {
	getUser,
	removeUser,
	updateUser,
	followUser
} from '../controllers/userController.js'
import { authoriseToken } from '../controllers/authController.js'
const router = Router()

router.get('/', getUser)
router.post('/:id/follow', authoriseToken, followUser)
router.delete('/',authoriseToken, removeUser)
router.put('/',authoriseToken, updateUser)
export default router
