
import { Router } from "express";
import { auth, authorization } from "../../middlewares/auth.js";
import { myMulter } from "../../services/multer.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()

import * as controllers from './product.controller.js'
import { endPoints } from "./product.endPoints.js";



router.post('/add', auth(), myMulter({}).array('pic', 2), asyncHandler(controllers.addProduct))

router.get('/', asyncHandler(controllers.getAllProducts))
router.patch('/like/:productId', auth(), asyncHandler(controllers.likeProduct))
router.patch('/unlike/:productId', auth(), asyncHandler(controllers.unlikeProduct))
router.patch('/soft', auth(), authorization(endPoints.SOFT_DELETE), asyncHandler(controllers.softDelete))

export default router
