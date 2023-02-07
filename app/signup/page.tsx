'use client'
import { useFormik } from 'formik';
import validate from '../auth/validate';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";

interface Values {
    name: string;
    password: string;
    confirmpass: string;
}

export default function SignUp() {
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState("")
    const formik = useFormik({
        initialValues: {
            name: "",
            password: "",
            confirmpass: "",
        },
        validate,
        onSubmit
    })

    async function onSubmit(values: Values) {
        console.log(values)
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        })
        const status = await response.json()
        if (status?.error) {
            status.error === null 
            ? setErrorMessage("")
            : setErrorMessage(status.error)
        }
        if(status?.ok && status?.url) {
            await signIn("credentials", {
                redirect: false,
                name: values.name,
                password: values.password,
                callbackUrl: "/"
            })
            router.push(status.url)
        }
    }

    return (
        <>
            <h1 className="self-center text-4xl mb-6 text-blue-600 font-bold">Sign Up</h1>
            <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col gap-6"
            >
                {errorMessage && <p className="text-red-500 m-0 -mb-3">{errorMessage}</p>}
                <input name="csrfToken" type="hidden" />
                <input
                    className="py-2 px-4 h-12 border-2 border-blue-300 rounded w-full"
                    name="name"
                    type="text"
                    placeholder="Name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    required
                />
                {formik.errors.name && formik.touched.name && <p className="text-red-500 -my-4">{formik.errors.name}</p>}
                <input
                    className="py-2 px-4 h-12 border-2 border-blue-300 rounded w-full"
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    required
                />
                {formik.errors.password && formik.touched.password && <p className="text-red-500 -my-4">{formik.errors.password}</p>}
                <input
                    className="py-2 px-4 h-12 border-2 border-blue-300 rounded w-full"
                    name="confirmpass"
                    type="password"
                    placeholder="Confirm password"
                    onChange={formik.handleChange}
                    value={formik.values.confirmpass}
                    required
                />
                {formik.errors.confirmpass && formik.touched.confirmpass && <p className="text-red-500 -my-4">{formik.errors.confirmpass}</p>}
                <button
                    className="bg-blue-600 text-white border-2 border-blue-600 w-full py-3 transition hover:bg-white hover:text-blue-600 active:scale-110"
                    type="submit"
                >
                    Sign up
                </button>
            </form>
        </>

    )
}