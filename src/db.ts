import pg from 'pg'
export const pool = new pg.Pool({
    user:'postgres',
    password:'admin',
    host:'localhost',
    port:5432,
    database:'app_auth'
})