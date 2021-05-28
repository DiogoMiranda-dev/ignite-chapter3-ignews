import { Client } from 'faunadb'

export const fauna = new  Client({
    secret: process.env.FAUNABD_API_KEY
})