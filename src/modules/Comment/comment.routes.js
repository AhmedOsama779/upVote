
import { Router } from "express";
const router = Router()
import { auth } from '../../middlewares/auth.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import * as controllers from './comment.controller.js'

router.post('/add', auth(), asyncHandler(controllers.addComment))
router.delete('/delete/:commentId', auth(), asyncHandler(controllers.deleteComment))



router.post('/addReply', auth(), asyncHandler(controllers.addReply))
router.post('/addReplyonReply', auth(), asyncHandler(controllers.addReplyOnReply))

export default router