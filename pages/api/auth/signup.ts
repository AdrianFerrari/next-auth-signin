import type { NextApiRequest, NextApiResponse } from 'next'
import userAuthSchema from "app/database/schema"
import connectMongoDB from "app/database/connectMongo"

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    try {
        connectMongoDB()
        if(req.method !== "POST") res.status(400).end('Only POST methods accepted')
        const { name, password } = req.body
        const user = await userAuthSchema.findOne({name})
        if(user) throw new Error("An user with than name already exist")
        const newuser = new userAuthSchema({name, password})
        await newuser.save()
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