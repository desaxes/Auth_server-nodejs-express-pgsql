import { Request, Response } from "express";
import { pool } from "../db";
import CryptoJS from "crypto-js";
import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../api-types";
class userController {
    async createAccount(req: RequestWithBody<{ login: string, password: string, name: string }>, res: Response) {
        try {
            let wordArray = CryptoJS.enc.Utf8.parse(req.body.login.concat(':', req.body.password));
            let base64 = CryptoJS.enc.Base64.stringify(wordArray);
            let date = new Date
            const newAcc = await pool.query(`INSERT INTO userAuthData (user_id,authKey,name) values($1,$2,$3) RETURNING *`, [
                ((date.getDate() + date.getMinutes()) * date.getSeconds()) * 143,
                base64,
                req.body.name
            ])
            res.json(newAcc.rows)
        }
        catch (e) {
            res.status(400).json({ message: 'incorrect field values' })
        }
    }
    async logIn(req: RequestWithQuery<{ login: string, password: string }>, res: Response) {
        let wordArray = CryptoJS.enc.Utf8.parse(req.query.login.concat(':', req.query.password));
        let base64 = CryptoJS.enc.Base64.stringify(wordArray);
        const account = await pool.query(
            `SELECT * FROM userAuthData WHERE authKey=$1`, [base64]
        )
        if (account.rowCount === 0) {
            res.status(401).json({ error: 'incorrect login or password' })
            return
        }
        const token = CryptoJS.enc.Hex.parse(base64)
        const hex = CryptoJS.enc.Hex.stringify(token)
        const random = Math.random().toString(36).substring(2)
        const tokenResult = await pool.query(
            `UPDATE userAuthData SET authToken = $1 where authKey=$2`, [hex + random, base64]
        )
        const accountUpdate = await pool.query(
            `SELECT * FROM userAuthData WHERE authKey=$1`, [base64]
        )
        res.json(accountUpdate.rows[0])
    }
    async authorize(req: RequestWithQuery<{ key: string }>, res: Response) {
        const checkToken = await pool.query(
            `SELECT * FROM userAuthData WHERE authToken=$1`, [req.query.key]
        )
        if (checkToken.rowCount === 0) {
            res.sendStatus(401)
            return
        }
        res.json(checkToken.rows[0])
        console.log(checkToken.rows[0])
    }
    async getAllAccounts(req: Request, res: Response) {
        const accs = await pool.query('SELECT * FROM userAuthData')
        res.json(accs.rows)
    }
    async deleteAccount(req: RequestWithBody<{ authKey: string }>, res: Response) {
        const acc = await pool.query('DELETE FROM userAuthData WHERE authKey = $1', [req.body.authKey])
        if (acc.rowCount === 0) {
            res.sendStatus(400)
            return
        }
        res.sendStatus(204)
    }
    async deleteAllAccounts(req: Request, res: Response) {
        const acc = await pool.query('DELETE FROM userAuthData')
        if (acc.rowCount === 0) {
            res.sendStatus(400)
            return
        }
        res.sendStatus(204)
    }
}
export const userAuthController = new userController
