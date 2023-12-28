import { Response } from "express";
import { pool } from "../db";
import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../api-types";
class collectionController {
    async addMovieToCol(req: RequestWithBody<{
        movieId: string,
        userId: number,
        title: string,
        poster: string,
        type: string,
        userrait: number,
        genre: string,
        year: string
    }>, res: Response) {
        const dubl = await pool.query('SELECT * FROM userCollection WHERE movieid=$1 AND user_id=$2',
            [
                req.body.movieId,
                req.body.userId
            ])
        if (dubl.rows.length > 0) {
            res.sendStatus(400)
            return
        }
        const response = await pool.query('INSERT INTO userCollection (movieId,user_id,title,poster,type,userrait,genre,year) values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
            [
                req.body.movieId,
                req.body.userId,
                req.body.title,
                req.body.poster,
                req.body.type,
                req.body.userrait,
                req.body.genre,
                req.body.year
            ])
        res.json(response.rows[0])
    }
    async getMoviesFromCol(req: RequestWithParams<{ id: number }>, res: Response) {
        const response = await pool.query('SELECT * FROM userCollection WHERE user_id=$1', [req.params.id])
        res.json(response.rows)
    }
    async checkCollectionDB(req: RequestWithQuery<{ id: string, userid: number }>, res: Response) {
        const check = await pool.query('SELECT * FROM userCollection WHERE movieid=$1 AND user_id=$2',
            [
                req.query.id,
                req.query.userid
            ])
        if (check.rows.length > 0) {
            res.sendStatus(200)
            return
        }
        res.sendStatus(400)
    }
    async removeFromCollection(req: RequestWithQuery<{ id: string, userid: number }>, res: Response) {
        await pool.query(`DELETE FROM userCollection WHERE movieid=$1 AND user_id=$2`, [
            req.query.id,
            req.query.userid
        ])
        res.sendStatus(200)
    }
}
export const userCollectionController = new collectionController
