import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "app/database/clientPromise"



export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    try {
        const { name } = req.body
        const client = await clientPromise
        const database = client.db('nextauth_db');
        const users = database.collection('users');
        const accounts = database.collection('accounts');
        const user = await users.findOne({name: name});
        if(user) {
            const id = user._id
            await users.deleteOne({name: name});
            await accounts.deleteOne({userId: id})
        }
        res.status(200).json({
            error: null,
            ok: true,
            status: 200,
            url: process.env.NEXTAUTH_URL
        })
    } catch(err: any) {
        res.status(401).json({
            error: err.message,
            ok: false,
            status: 404,
            url: null
        })
    }
}