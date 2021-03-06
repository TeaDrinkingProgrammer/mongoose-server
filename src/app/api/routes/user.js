import { Router } from 'express'
import {
	getUser,
	removeUser,
	updateUser,
	followUser,
	unfollowUser,
	getFollows,
	getFollowers,
	getUserById
} from '../controllers/userController.js'
import { authoriseToken } from '../controllers/authController.js'
const router = Router()

router.get('/', getUser)
router.get('/:id', getUserById)
router.delete('/:id',authoriseToken, removeUser)
router.put('/:id',authoriseToken, updateUser)
router.post('/:id/follow', authoriseToken, followUser)
router.delete('/:id/follow', authoriseToken, unfollowUser)
router.get('/:id/follow', getFollows)
router.get('/:id/followers', getFollowers)
export default router
