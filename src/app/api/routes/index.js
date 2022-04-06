import { Router } from 'express'
import content from './content.js'
import user from './user.js'
import comment from './comment.js'
import contentList from './contentList.js'
import authorisation from './authorisation.js'
const router = Router()
router.use('/content', content)
router.use('/user', user)
router.use('/comment', comment)
router.use('/content-list', contentList)
router.use('/auth', authorisation)
export default router
