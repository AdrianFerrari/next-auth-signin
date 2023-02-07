'use client'
import { useEffect } from 'react'
import { signIn, useSession } from "next-auth/react";

export default function GoogleSignIn() {
    const { data: session, status } = useSession();


    useEffect(() => {
        if (!(status === "loading") && !session) void signIn('google');
        if (session) window.close();
    }, [session, status])


    return (
        <h1 className='bg-white flex justify-center items-center absolute top-0 left-0 h-screen w-screen'>Loading...</h1>
    )
}