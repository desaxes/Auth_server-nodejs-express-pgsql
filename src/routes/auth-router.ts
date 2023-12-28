import { Router } from "express";
import { userAuthController } from "../controller/user-controllers";
import { queryValidatorMiddleware } from "../middlewares/authQueryValidatorMiddleware";
import { inputValidationMiddleware } from "../middlewares/input-validation";
import { bodyValidatorMiddleware } from "../middlewares/authBodyValidatorMiddleware copy";
import { userCollectionController } from './../controller/collection-controllers';

export const authRouter = () => {
    const router = Router()
    router.get('/', queryValidatorMiddleware, inputValidationMiddleware, userAuthController.logIn)
    router.get('/accs', userAuthController.getAllAccounts)
    router.get('/appstart', userAuthController.authorize)
    router.post('/', bodyValidatorMiddleware, inputValidationMiddleware, userAuthController.createAccount)
    router.delete('/', userAuthController.deleteAccount)
    router.delete('/accs', userAuthController.deleteAllAccounts)
    router.post('/collection', userCollectionController.addMovieToCol)
    router.get('/collection/:id', userCollectionController.getMoviesFromCol)
    router.get('/collection', userCollectionController.checkCollectionDB)
    router.delete('/collection', userCollectionController.removeFromCollection)
    return router
}