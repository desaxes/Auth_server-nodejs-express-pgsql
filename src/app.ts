import express, { NextFunction, Request, Response } from 'express'
import { authRouter } from './routes/auth-router'
import cors from 'cors'
export const app = express()

app.use(express.json())
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS','PUT','DELETE']
}))
app.use('/auth', authRouter())

