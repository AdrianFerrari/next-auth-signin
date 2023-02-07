"use client";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useFormik } from 'formik';
import validate from "./validate";
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Values {
    name: string;
    password: string;
}

export default function Login() {
    const router = useRouter()
    const [innerWidth, setInnerWidth] = useState(0);
    const [innerHeight, setInnerHeight] = useState(0);
    const [errorMessage, setErrorMessage] = useState("")
    const formik = useFormik({
        initialValues: {
            name: "",
            password: "",
        },
        validate,
        onSubmit
    })

    function errmes(str:string){
        console.log(str)
    }

    async function onSubmit(values: Values) {
        const status = await signIn("credentials", {
            redirect: false,
            name: values.name,
            password: values.password,
            callbackUrl: "/"
        })
        if (status?.error) {
            status.error === null 
            ? setErrorMessage("")
            : setErrorMessage(status.error)
        }
        if(status?.ok && status?.url) router.push(status.url)
        
    }
    

    useEffect(() => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);
        function updateInnerWindow() {
            setInnerWidth(window.innerWidth);
            setInnerHeight(window.innerHeight);
        }
        window.addEventListener("resize", updateInnerWindow);

        return () => window.removeEventListener("resize", updateInnerWindow);
    }, []);

    const left = (innerWidth - 500) / 2;
    const top = (innerHeight - 550) / 2;
    const windowOptions = `width=500,height=550,left=${left},top=${top}`;

 

    async function popWindow(provider: string) {
        if (innerWidth > 600) {
            const newWindow = window.open(
                `/${provider}-signin`,
                "SignIn",
                windowOptions
            );
            newWindow?.focus();
        } else {
            try {
                await signIn(provider, {
                    redirect: false,
                    callbackUrl: "/"
                });

            } catch(error : any) {
                throw new Error(error.message)

            }
        }
    }

    

    return (
        <>
            <h1 className="self-center text-4xl mb-6 text-blue-600 font-bold">Login</h1>
            <button
                className="bg-white border-solid border-gray-300 border-2 px-3 py-2 flex items-center justify-center gap-2 shadow-md"
                onClick={() => popWindow("google")}
            >
                <Image src="/icons-google.png" width={24} height={24} alt=""/>
                Sign in with Google
            </button>
            <button
                className="bg-white border-solid border-gray-300 border-2 px-3 py-2 flex items-center justify-center gap-2 shadow-md"
                onClick={() => popWindow('github')}
            >
                <Image src="/icons-github.png" width={24} height={24} alt=""/>
                Sign in with Github
            </button>
            <div className="flex flex-row w-full justify-center items-center gap-2 text-gray-300 my-4">
                <hr className="grow border-1 border-gray-300" />
                or
                <hr className="grow border-1 border-gray-300" />
            </div>
            <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col gap-6"
                >
                {errorMessage && <p className="text-red-500 m-0 -mb-3">{errorMessage}</p>}
                <input
                    className="py-2 px-4 h-12 border-2 border-blue-300 rounded w-full shadow-inner"
                    name="name"
                    type="text"
                    placeholder="Name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                />
                {formik.errors.name && formik.touched.name && <p className="text-red-500 -my-4">{formik.errors.name}</p>}
                <input
                    className="py-2 px-4 h-12 border-2 border-blue-300 rounded w-full shadow-inner"
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
                {formik.errors.password && formik.touched.password && <p className="text-red-500 -my-4">{formik.errors.password}</p>}
                <button
                    className="bg-blue-600 text-white border-2 border-blue-600 w-full py-3 transition hover:bg-white hover:text-blue-600 active:scale-110"
                    type="submit"
                >
                    Sign in
                </button>
            </form>
            <p>
                Dont have an account? <Link className="text-blue-600" href="/signup">Sign up</Link>
            </p>
        </>
    );
}
