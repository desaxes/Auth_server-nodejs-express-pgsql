import { ValidationChain, query } from "express-validator";

export const queryValidatorMiddleware: ValidationChain[] = ([
    query('login').isLength({ min: 5, max: 12 }).withMessage('min length must be 5 symbols'),
    query('password').isLength({ min: 5, max: 12 }).withMessage('min length must be 5 symbols')
])
