import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "app/database/clientPromise"



export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    try {
        const { email, provider } = req.body
        const client = await clientPromise
        const database = client.db('nextauth_db');
        const users = database.collection('users');
        const data = await users.findOne({email});
        if(data) {
            const id = data._id
            const accounts = database.collection('accounts')
            const account = await accounts.find({userId: id}).toArray()
            const _provider = account[0].provider
            if (_provider !== provider)
                throw new Error(_provider)
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
            status: 401,
            url: null
        })
    }
}