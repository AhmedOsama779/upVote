
import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { myMulter } from "../../services/multer.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()


import * as controllers from './user.controller.js'
router.patch('/profile', auth(), myMulter({}).single('pic'), asyncHandler(controllers.addProfile))
router.patch('/covers', auth(), myMulter({}).array('pic', 2), asyncHandler(controllers.addCover))
router.patch('/updatePass', auth(), asyncHandler(controllers.updatePassword))




export default router