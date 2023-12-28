import { ValidationChain, body } from "express-validator";

export const bodyValidatorMiddleware: ValidationChain[] = ([
    body('login').isLength({ min: 5, max: 12 }).withMessage('min length must be 5 symbols'),
    body('password').isLength({ min: 5, max: 12 }).withMessage('min length must be 5 symbols'),
    body('name').isLength({ min: 5, max: 12 }).withMessage('min length must be 5 symbols'),
])
