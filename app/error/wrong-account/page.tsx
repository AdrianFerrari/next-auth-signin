'use client'
import { useSearchParams } from 'next/navigation';

export default function WrongAccount() {
    const params = useSearchParams()
    const _provider = params.get('provider')
    return (
        <div className='bg-white flex flex-col justify-center items-center absolute top-0 left-0 h-screen w-screen p-8 gap-2'>
            <h1 className='text-8xl'>401</h1>
            <p className='text-lg'>We can&apos;t log you in with that account because you previously log in with {_provider}. Please try to log in with {_provider}.</p>
        </div>
    )
}