import { Router } from 'express'
import {
	getUser,
	removeUser,
	updateUser,
	followUser,
	unfollowUser,
	getFollows,
	getFollowers
} from '../controllers/userController.js'
import { authoriseToken } from '../controllers/authController.js'
const router = Router()

router.get('/', getUser)
router.post('/:id/follow', authoriseToken, followUser)
router.delete('/:id/follow', authoriseToken, unfollowUser)
router.get('/:id/follow', getFollows)
router.get('/:id/followers', getFollowers)
router.delete('/',authoriseToken, removeUser)
router.put('/',authoriseToken, updateUser)
export default router
