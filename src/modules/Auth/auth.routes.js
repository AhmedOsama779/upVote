
import { Router } from "express";
import { validation } from "../../middlewares/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()

import * as controllers from './auth.controller.js'
import * as validationSchemas from './auth.validation.js'

router.post('/signUp', validation(validationSchemas.signUpSchema), asyncHandler(controllers.signUp))
router.get('/confirmEmail/:token', validation(validationSchemas.confirmEmailSchema), asyncHandler(controllers.confirmEmail))
router.post('/login', validation(validationSchemas.logInSchema), asyncHandler(controllers.login))
router.get('/forget', asyncHandler(controllers.foregtPass))
router.post('/resetPass/:token', asyncHandler(controllers.resetPassword))

export default router