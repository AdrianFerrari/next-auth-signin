import { DefaultSession } from "next-auth"
import { signOut } from 'next-auth/react'

export default function Home({ user } : { user: DefaultSession["user"] }) {
    async function deleteUser() {
        const response = await fetch("api/auth/delete", {
            method: "POST",
            headers :{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: user?.name})
        })
        if(!response.ok) throw new Error("Could not find user")
        signOut()
    }


    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4'>
                <h1>Current User Logged In</h1>
                <p>{user?.name}</p>
                <p>{user?.email}</p>
            </div>
            <button onClick={() => deleteUser()} className='bg-slate-600 border-solid text-white px-3 py-2'>Delete Account</button>
            <button onClick={() => signOut()} className='bg-slate-600 border-solid text-white px-3 py-2'>Sign Out</button>
        </div>
    )
}